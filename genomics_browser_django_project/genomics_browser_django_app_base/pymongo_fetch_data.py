'''
Collection Names
patient_collection = db['patients']
gene_collection = db['genes']
dataset_collection = db['datasets']
'''

from pymongo_get_database import get_connection
from pandas import DataFrame

db = get_connection()

def patientId_query(patientid:str):
    collection_name = db['patients']
    item_details = collection_name.find()
    converted_items = DataFrame(item_details)

    # May need to process converted_items

    # What needs to be returned?