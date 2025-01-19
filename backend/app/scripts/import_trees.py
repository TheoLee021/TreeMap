import csv
import sys
import requests
import re
from datetime import datetime

def convert_height(height_str):
    # Example: "31'-45'" -> average in meters
    match = re.match(r"(\d+)'-(\d+)'", height_str)
    if match:
        min_height = float(match.group(1))
        max_height = float(match.group(2))
        avg_feet = (min_height + max_height) / 2
        return avg_feet * 0.3048  # Convert to meters
    return None

def convert_diameter(diameter_str):
    # Example: '8"' -> centimeters
    match = re.match(r'(\d+)"', diameter_str)
    if match:
        inches = float(match.group(1))
        return inches * 2.54  # Convert to centimeters
    return None

def parse_health(health_str):
    # Example: "40% - Poor" -> "poor"
    if not health_str:
        return "unknown"
    if "-" in health_str:
        return health_str.split("-")[1].strip().lower()
    return health_str.lower()

def parse_date(date_str):
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, '%m/%d/%Y').isoformat()
    except:
        return None

def import_trees(csv_file):
    with open(csv_file, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                lat = float(row.get('Latitude', '').strip())
                lon = float(row.get('Longitude', '').strip())
                
                if not lat or not lon:
                    print(f"Skipping row with missing coordinates: {row}")
                    continue

                tree_data = {
                    'tag_number': row.get('Tag #', '').strip(),
                    'common_name': row.get('COMMON NAME', '').strip(),
                    'species': row.get('BOTANICAL NAME', '').strip(),
                    'height': convert_height(row.get('Height', '')),
                    'diameter': convert_diameter(row.get('Diameter', '')),
                    'health_condition': parse_health(row.get('Health', '')),
                    'last_pruned': parse_date(row.get('Last Pruned')),
                    'note': row.get('Note', '').strip(),
                    'latitude': lat,
                    'longitude': lon
                }

                # Remove None values
                tree_data = {k: v for k, v in tree_data.items() if v is not None}

                response = requests.post('http://localhost:8000/trees', json=tree_data)
                if response.status_code == 200:
                    print(f"Successfully imported tree {tree_data['tag_number']}")
                else:
                    print(f"Error importing tree {tree_data['tag_number']}: {response.text}")

            except Exception as e:
                print(f"Error processing row: {row}")
                print(f"Error: {str(e)}")

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python import_trees.py <csv_file>")
        sys.exit(1)
    
    import_trees(sys.argv[1])