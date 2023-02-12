from pymongo_get_database import get_connection
from typing import List

# This function will insert a data to mongodb
# Must receive:
#   1. List of dictionaries for patient document
#   2. List of dictionaries for gene document
#   3. dictionary for dataset document
def insert_to_mongodb(patient_documents: List[dict], gene_documents: List[dict], dataset_document: dict) -> None:
    db = get_connection()

    patient_collection = db['patients']
    gene_collection = db['genes']
    dataset_collection = db['datasets']

    patient_collection.insert_many(patient_documents)
    gene_collection.insert_many(gene_documents)
    dataset_collection.insert_one(dataset_document)

    return