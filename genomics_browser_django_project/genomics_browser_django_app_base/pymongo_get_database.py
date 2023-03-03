from pymongo import MongoClient
from dotenv import load_dotenv
import os
load_dotenv()

def get_connection():
    # After user id, it should be a password (foreveryone1230) is a password for now
    CONNECTION_STRING = os.environ.get('DATABASE_CONNECTION_STRING')

    # Connect to a database
    client = MongoClient(CONNECTION_STRING)

    return client['genomics_browser_database']

# For the case you want to run this file
# if __name__ == "__main__":
#     patients_db = get_connection()
