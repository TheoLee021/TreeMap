from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://treeuser:treepassword@db:5432/treemap")
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

def reset_database():
    session = Session()
    try:
        # Drop all tables and types
        session.execute(text("DROP TABLE IF EXISTS alembic_version CASCADE"))
        session.execute(text("DROP TABLE IF EXISTS trees CASCADE"))
        session.execute(text("DROP TABLE IF EXISTS users CASCADE"))
        session.execute(text("DROP TYPE IF EXISTS treehealthtype CASCADE"))
        session.execute(text("DROP TYPE IF EXISTS userrole CASCADE"))
        session.commit()
        print("Successfully reset database")
        
    except Exception as e:
        print(f"Error resetting database: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    reset_database() 