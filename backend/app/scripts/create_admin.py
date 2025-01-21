from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from app.models import User, UserRole
from app.auth import get_password_hash

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://treeuser:treepassword@db:5432/treemap")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_admin_user(email: str, password: str):
    db = SessionLocal()
    try:
        # Check if admin user already exists
        existing_admin = db.query(User).filter(User.email == email).first()
        if existing_admin:
            print(f"Admin user {email} already exists")
            return

        # Create new admin user
        admin_user = User(
            email=email,
            hashed_password=get_password_hash(password),
            role=UserRole.admin,  # Using the enum value
            is_active=1  # Using integer instead of boolean
        )
        
        db.add(admin_user)
        db.commit()
        print(f"Successfully created admin user: {email}")
        
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Default admin credentials
    admin_email = "admin@example.com"
    admin_password = "admin1234"
    
    create_admin_user(admin_email, admin_password) 