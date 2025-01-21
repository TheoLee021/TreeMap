from app.database import engine
from app.models import Base

def drop_tables():
    Base.metadata.drop_all(bind=engine)

if __name__ == "__main__":
    drop_tables()
    print("Tables dropped successfully") 