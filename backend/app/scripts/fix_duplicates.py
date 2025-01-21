from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://treeuser:treepassword@db:5432/treemap")
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

def fix_duplicate_tag_numbers():
    session = Session()
    try:
        # Find duplicates
        result = session.execute(
            text("""
                SELECT tag_number, array_agg(id) as ids
                FROM trees
                GROUP BY tag_number
                HAVING COUNT(*) > 1
            """)
        )
        
        for row in result:
            tag_number = row[0]
            ids = row[1]
            print(f"Found duplicate tag_number {tag_number} for tree IDs: {ids}")
            
            # Keep the first occurrence as is (no suffix)
            # Update others with suffix
            for i, tree_id in enumerate(ids[1:], 1):
                session.execute(
                    text("UPDATE trees SET tag_suffix = :suffix WHERE id = :tree_id"),
                    {"suffix": f"({i})", "tree_id": tree_id}
                )
                print(f"Updated tree ID {tree_id} with tag_suffix ({i})")
        
        session.commit()
        print("Successfully fixed duplicate tag numbers")
        
    except Exception as e:
        print(f"Error fixing duplicates: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    fix_duplicate_tag_numbers() 