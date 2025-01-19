import csv
import requests
from datetime import datetime
import re
import sys

def convert_height(height_str):
    # Convert '31'-45'' format to meters (taking average)
    match = re.match(r"(\d+)'-(\d+)'", height_str)
    if match:
        min_height, max_height = map(int, match.groups())
        avg_feet = (min_height + max_height) / 2
        return round(avg_feet * 0.3048, 2)  # Convert to meters
    return None

def convert_diameter(diameter_str):
    # Convert '8"' format to centimeters
    match = re.match(r'(\d+)"', diameter_str)
    if match:
        inches = int(match.group(1))
        return round(inches * 2.54, 2)  # Convert to centimeters
    return None

def parse_health(health_str):
    # Convert '40% - Poor' format to standardized format
    match = re.match(r'(\d+)% - (\w+)', health_str)
    if match:
        return match.group(2).lower()
    return 'unknown'

def parse_date(date_str):
    # Convert MM/DD/YYYY to ISO format
    try:
        return datetime.strptime(date_str, '%m/%d/%Y').isoformat()
    except:
        return None

def import_trees(csv_path, api_url='http://localhost:8000/trees'):
    print(f"Importing trees from {csv_path}")
    with open(csv_path, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                tree_data = {
                    'species': row['BOTANICAL NAME'],
                    'common_name': row['COMMON NAME'],
                    'height': convert_height(row['Height']),
                    'diameter': convert_diameter(row['Diameter']),
                    'health_condition': parse_health(row['Health']),
                    'last_pruned': parse_date(row['Lastest Update']),
                    'latitude': float(row['Latitude']),
                    'longitude': float(row['Longitude']),
                    'notes': row['Note'],
                    'age': 0  # Placeholder as age is not in CSV
                }
                
                response = requests.post(api_url, json=tree_data)
                if response.status_code == 200:
                    print(f"Successfully imported tree {row['Tag #']}")
                else:
                    print(f"Failed to import tree {row['Tag #']}: {response.text}")
            except Exception as e:
                print(f"Error processing tree {row['Tag #']}: {str(e)}")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        csv_path = sys.argv[1]
    else:
        csv_path = '../TreeDataset_DeAnzaCollege.csv'
    import_trees(csv_path) 