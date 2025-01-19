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
    # Example: '8"' -> meters
    match = re.match(r'(\d+)"', diameter_str)
    if match:
        inches = float(match.group(1))
        return inches * 0.0254  # Convert to meters
    return None

def parse_health(health_str):
    # Example: "40% - Poor" -> "poor"
    if not health_str:
        return "unknown"
    if "-" in health_str:
        return health_str.split("-")[1].strip().lower()
    return health_str.lower()

def import_trees(csv_path):
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                # Extract latitude and longitude
                lat = float(row['Latitude']) if row['Latitude'] else None
                lng = float(row['Longitude']) if row['Longitude'] else None
                
                if lat is None or lng is None:
                    print(f"Skipping tree with invalid coordinates: {row}")
                    continue

                # Create tree data
                tree_data = {
                    'species': row['BOTANICAL NAME'],
                    'height': convert_height(row['Height']),
                    'diameter': convert_diameter(row['Diameter']),
                    'health_condition': parse_health(row['Health']),
                    'planted_date': datetime.now().isoformat(),  # Using current date as placeholder
                    'last_inspection': None,
                    'notes': row['Lastest Update'],
                    'latitude': lat,
                    'longitude': lng
                }

                # Send POST request to create tree
                response = requests.post('http://localhost:8000/trees/', json=tree_data)
                
                if response.status_code == 200:
                    print(f"Successfully imported tree: {tree_data['species']}")
                else:
                    print(f"Failed to import tree: {response.status_code} - {response.text}")
            
            except Exception as e:
                print(f"Error processing row: {e}")
                continue

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python import_trees.py <csv_file_path>")
        sys.exit(1)
    
    csv_file = sys.argv[1]
    print(f"Importing trees from {csv_file}")
    import_trees(csv_file) 