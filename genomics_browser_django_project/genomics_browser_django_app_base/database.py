from bson.json_util import loads, dumps

from genomics_browser_django_app_base.pymongo_get_database import get_connection

from genomics_browser_django_app_base.serializers import DatasetSerializer
from genomics_browser_django_app_base.serializers import GeneSerializer
from genomics_browser_django_app_base.serializers import CounterSerializer

from genomics_browser_django_app_base.parsed_dataset import ParsedDataset

from rest_framework import status

import re
import datetime

class Database(): 
    client = get_connection()
    patient_collection  = client['patients']
    gene_collection     = client['genes']
    dataset_collection  = client['datasets']
    counter_collection  = client['counters']

    class Counters:
        COUNTER_NAME_KEY        = 'name_use'
        COUNTER_VALUE_KEY       = 'seq_val'
        GENE_COUNTER_NAME       = 'gene_counter'
        DATASET_COUNTER_NAME    = 'dataset_counter'
        INCREMENT_OPERATION     = '$set'

        """
        Get the last inserted gene counter value from the gene counter collection in the database.

        ### Returns
        - `int`: The last inserted gene counter value.
        """
        def get_last_gene_counter():
            counter = Database.counter_collection.find_one(
                {Database.Counters.COUNTER_NAME_KEY: Database.Counters.GENE_COUNTER_NAME})
            if counter:
                serial = CounterSerializer(counter, many=False)
                counter = serial.data.get(Database.Counters.COUNTER_VALUE_KEY)
            else:
                counter = 0
            return counter

        """
        Get the last inserted dataset counter value from the dataset counter collection in the database.

        ### Returns
        - `int`: The last inserted dataset counter value.
        """ 
        def get_last_dataset_counter():
            counter = Database.counter_collection.find_one(
                {Database.Counters.COUNTER_NAME_KEY: Database.Counters.DATASET_COUNTER_NAME})
            if counter:
                serial = CounterSerializer(counter, many=False)
                counter = serial.data.get(Database.Counters.COUNTER_VALUE_KEY)
            else:
                counter = 0
            return counter

        def get_new_gene_counter():
            return Database.Counters.get_last_gene_counter() + 1

        def get_new_dataset_counter():
            return Database.Counters.get_last_dataset_counter() + 1

        """
        Increment the gene counter value in the gene counter collection in the database to reflect a
        new gene insertion.

        ### Returns
        - `int`: The incremented gene counter value.
        """
        def increment_gene_counter():
            counter = Database.Counters.get_new_gene_counter()
            if counter == 1:
                Database.counter_collection.insert_one({
                    Database.Counters.COUNTER_VALUE_KEY: counter,
                    Database.Counters.COUNTER_NAME_KEY: Database.Counters.GENE_COUNTER_NAME
                })
            else:
                Database.counter_collection.update_one({
                    Database.Counters.COUNTER_NAME_KEY: Database.Counters.GENE_COUNTER_NAME}, 
                    {
                        Database.Counters.INCREMENT_OPERATION: {
                            Database.Counters.COUNTER_VALUE_KEY: counter, 
                            Database.Counters.COUNTER_NAME_KEY: Database.Counters.GENE_COUNTER_NAME
                        }
                    }, 
                upsert=False)
            return counter
        
        def increment_dataset_counter():
            counter = Database.Counters.get_new_dataset_counter()
            if counter == 1:
                Database.counter_collection.insert_one({
                    Database.Counters.COUNTER_VALUE_KEY: counter,
                    Database.Counters.COUNTER_NAME_KEY: Database.Counters.DATASET_COUNTER_NAME
                })
            else:
                Database.counter_collection.update_one({
                    Database.Counters.COUNTER_NAME_KEY: Database.Counters.DATASET_COUNTER_NAME}, 
                    {
                        Database.Counters.INCREMENT_OPERATION: {
                            Database.Counters.COUNTER_VALUE_KEY: counter, 
                            Database.Counters.COUNTER_NAME_KEY: Database.Counters.DATASET_COUNTER_NAME
                        }
                    }, 
                upsert=False)
            return counter

    class Patients:
        def get_patients_with_gene_from_dataset(request):
            patients = Database.patient_collection.find({'$and': [{'gene_ids': str(request['gene_id'])}, {'dataset_id': int(request['dataset_id'])}]}, {'_id': 0, 'gene_ids': 0, 'dataset_id': 0})
            json_data = loads(dumps(patients))
            return json_data 

        def get_patient_one(request):
            patient = Database.patient_collection.find_one({'patient_id': request['patient_id']})
            json_data = loads(dumps(patient))
            return json_data

        def get_patient_all(request):
            patients = Database.patient_collection.find({}, {'_id': 0, 'patient_id': 1})
            json_data = loads(dumps(patients))
            return json_data
        
        def post_patient_one(request):
            pass
            return loads(dumps(status.HTTP_201_CREATED))

        def post_patient_many(request):
            Database.patient_collection.insert_many(request)
            return loads(dumps(status.HTTP_201_CREATED))

    class Genes:
        def get_gene_one(request):
            gene = Database.gene_collection.find_one({'id': int(request['gene_id']), 'name': str(request['gene_name'])})
            serial = GeneSerializer(gene, many=False)
            json_data = serial.data
            json_data['patient_ids'] = loads(json_data['patient_ids'])
            json_data['gene_values'] = loads(json_data['gene_values'])
            return json_data

        def get_gene_all(request):
            genes = Database.gene_collection.find({}, {'_id': 0, 'name': 1, 'id': 1})
            json_data = loads(dumps(genes))
            return json_data

        def post_gene_one(request):
            pass
            return loads(dumps(status.HTTP_201_CREATED))

        def post_gene_many(request):
            Database.gene_collection.insert_many(request) 
            return loads(dumps(status.HTTP_201_CREATED))

    class Datasets:
        def get_dataset_one(request):
            dataset = Database.dataset_collection.find_one({'id': int(request['dataset_id'])})
            serial = DatasetSerializer(dataset, many=False)
            return serial.data

        def get_dataset_all(request):
            datasets = Database.dataset_collection.find({}, {'_id': 0})
            json_data = loads(dumps(datasets))
            return json_data

        def post_dataset_one(request):
            request['ctx'] = {
                'FILES' : request['ctx'].FILES.copy(),
                'POST'  : request['ctx'].POST.copy()
            }
            date_created    = request['ctx']['POST'].get('dateCreated')
            date_created = re.sub(r' GMT[+-]\d{4}\s*\([^)]*\)', '', date_created)
            date_created = datetime.datetime.strptime(date_created, '%a %b %d %Y %H:%M:%S').date()
            dataset = ParsedDataset(
                in_txt          =   list(request['ctx']['FILES'].values())[0],
                name            =   list(request['ctx']['FILES'].values())[0].name,
                description     =   request['ctx']['POST'].get('description'),
                url             =   request['ctx']['POST'].get('urltoFile'),
                date_created    =   date_created,
                dataset_id      =   Database.Counters.get_new_dataset_counter()
            )
                
            serial = DatasetSerializer(dataset.get_dataset_info())
            Database.Patients.post_patient_many(dataset.get_patients())
            Database.Genes.post_gene_many(dataset.get_genes())
            Database.Counters.increment_gene_counter()
            Database.dataset_collection.insert_one(serial.data)
            Database.Counters.increment_dataset_counter()
            return loads(dumps(status.HTTP_201_CREATED))

