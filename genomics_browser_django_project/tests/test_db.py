from django.test import TestCase
from genomics_browser_django_app_base.pymongo_get_database import get_connection
import random

'''
This test is mainly for checking if the backend is properly connecting with the mongodb that will be used for saving data
Test starts from making temporary collection in the database we will be using in web app
Using that collection there will be three tests:
    1. Insertion Test
        Insert random number into the collection, fails if value was not inserted -> insertion function didn't return id
    2. Get Test
        After system passes insertion test, there will be test for retrieving value from database
        First system will retrieve the value from database based on id issued in test #1.
        Then compare the value between retrieved value and value used when inserting value. Fails if the values are not equal.
    3. Deleting collection
        Delete the temporary made collection from the database. Fails if it was not deleted.
'''

class TestConnection(TestCase):
    def test_database_connection(self):
        db = get_connection()
        testCollection = db['BackendUnitTest']
        randomNumber = random.randint(0,2147483647)

        checkInsertion = testCollection.insert({"Random_number":randomNumber})

        self.assertIsNotNone(checkInsertion, "It will fail if insert was not done properly")

        # Get saved value based on the id issued when we inserted data
        retrievedValue = testCollection.find_one({"_id":checkInsertion})

        self.assertEqual(retrievedValue["Random_number"], randomNumber, "Fails if data is not retrieved properly")

        # Delete the collection used for test
        db.drop_collection("BackendUnitTest")
        self.assertNotIn("BackendUnitTest", db.list_collection_names(), msg="Fails if collection made for test is still in database")
