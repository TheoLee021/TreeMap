import csv
import sys
import re
import asyncio
from datetime import datetime
from app.database import AsyncSessionLocal
from app.models import Tree
from sqlalchemy import text

def convert_height(height_str):
    if not height_str:
        return None
    match = re.match(r"(\d+)'-(\d+)'", height_str)
    if match:
        min_height, max_height = map(float, match.groups())
        return ((min_height + max_height) / 2) * 0.3048
    return None

def convert_diameter(diameter_str):
    if not diameter_str:
        return None
    match = re.match(r'(\d+)"', diameter_str)
    if match:
        return float(match.group(1)) * 2.54
    return None

def parse_health(health_str):
    if not health_str:
        return "unknown"
    return health_str.split("-")[1].strip().lower() if "-" in health_str else health_str.lower()

def parse_date(date_str):
    if not date_str or not date_str.strip():
        print(f"Empty date string: {date_str!r}")
        return None
    try:
        print(f"Parsing date string: {date_str!r}")
        result = datetime.strptime(date_str.strip(), '%m/%d/%Y')
        print(f"Successfully parsed date: {result}")
        return result
    except ValueError as e:
        print(f"Failed to parse date {date_str!r}: {e}")
        return None

async def import_trees(csv_file):
    async with AsyncSessionLocal() as db:
        try:
            await db.execute(text("DELETE FROM trees"))
            
            with open(csv_file, 'r') as f:
                reader = csv.DictReader(f)
                count = 0
                trees = []
                
                for row in reader:
                    try:
                        lat = float(row.get('Latitude', '').strip())
                        lon = float(row.get('Longitude', '').strip())
                        
                        if not lat or not lon:
                            continue

                        print(f"\nProcessing row with Last Inspection: {row.get('Last Inspection')!r}")
                        print(f"Health: {row.get('Health')!r}")
                        print(f"Expert Notes: {row.get('Expert Notes')!r}")

                        tree = Tree(
                            tag_number=int(row.get('Tag #', '0').strip()),
                            common_name=row.get('COMMON NAME', '').strip(),
                            botanical_name=row.get('BOTANICAL NAME', '').strip(),
                            latitude=lat,
                            longitude=lon,
                            height=convert_height(row.get('Height')),
                            diameter=convert_diameter(row.get('Diameter')),
                            crown_height=convert_height(row.get('Crown height')),
                            crown_spread=convert_height(row.get('Crown Spread')),
                            last_update=parse_date(row.get('Last Update')),
                            contributors=row.get('Contributors', '').strip() or None,
                            notes=row.get('Notes', '').strip() or None,
                            last_inspection=parse_date(row.get('Last Inspection')),
                            health=parse_health(row.get('Health')),
                            expert_notes=row.get('Expert Notes', '').strip() or None
                        )
                        trees.append(tree)
                        count += 1
                        
                        if len(trees) >= 100:
                            db.add_all(trees)
                            await db.commit()
                            trees = []

                    except Exception as e:
                        print(f"Error processing row {count + 1}: {e}")
                        continue

                if trees:
                    db.add_all(trees)
                    await db.commit()
                
                return count

        except Exception as e:
            print(f"Database error: {e}")
            await db.rollback()
            raise

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python import_trees.py <csv_file>")
        sys.exit(1)
    
    count = asyncio.run(import_trees(sys.argv[1]))
    print(f"Successfully imported {count} trees")