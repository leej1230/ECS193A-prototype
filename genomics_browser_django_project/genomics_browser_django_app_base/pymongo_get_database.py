from pymongo import MongoClient

def get_connection():
    # After user id, it should be a password (foreveryone1230) is a password for now
    CONNECTION_STRING = "mongodb+srv://jaewoo1230:foreveryone1230@test.dq6btwc.mongodb.net/?retryWrites=true&w=majority"

    # Connect to a database
    client = MongoClient(CONNECTION_STRING)

    return client['genomics_browser_database']

# For the case you want to run this file
# if __name__ == "__main__":
#     patients_db = get_connection()
