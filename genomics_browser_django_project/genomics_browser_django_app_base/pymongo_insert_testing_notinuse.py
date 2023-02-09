'''
Data structure of mongoDB
--MongoDB
  +--Database
  |  +--Collection
  |  |  +--Document
  |  |  +--Document
  |  |
  |  +--Collection
  |  |  +--Document
  | 
  +--Database
  |  +--Collection
'''

from pymongo_get_database import get_connection
db = get_connection()


# To create a collection
patient_collection_name = db['patients']
# gene_collection_name = db['genes']
# dataset_collection_name = db['datasets']

test = {
    "_id": "UCDSS_1000",
    "gene_ids": ["1","2"],
    "values": [1.50e-6, 0.90432],
    "dataset_id": [1]
}

# insert_one(document) to insert one document
# insert_many([document1,document2] to insert more than one document)
patient_collection_name.insert_one(test)