from bson.json_util import loads, dumps

from genomics_browser_django_app_base.pymongo_get_database import get_connection

from genomics_browser_django_app_base.serializers import DatasetSerializer
from genomics_browser_django_app_base.serializers import GeneSerializer
from genomics_browser_django_app_base.serializers import CounterSerializer
from genomics_browser_django_app_base.serializers import UserSerializer

from genomics_browser_django_app_base.parsed_dataset import ParsedDataset

from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password 

from rest_framework import status

from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

import base64
import re
import datetime
import os

class Database(): 
    client = get_connection()
    patient_collection      = client['patients']
    gene_collection         = client['genes']
    dataset_collection      = client['datasets']
    counter_collection      = client['counters']
    user_collection         = client['users']
    superuser_collection    = client['superusers']

    class Users:
        def decrypt_password(encrypted_password:str) -> str:
            encryptionKey = os.environ.get('ENCRYPTION_SECRET_KEY')
            if not encryptionKey:
                print("Environmental Variable has not been set up!")
                return "Random String"
            
            cipher = AES.new(encryptionKey, AES.MODE_CBC)
            ciphertext = base64.b64decode(encrypted_password)
            decrypted_password = unpad(cipher.decrypt(ciphertext), AES.block_size)

            return decrypted_password

        def get_user_one(request):
            """
            Retrieves a user from the database.
            
            Returns:
                dict: The user information.
            """
            user = Database.user_collection.find_one({'email': request['ctx'].POST['email']})
            if not user:
                return status.HTTP_404_NOT_FOUND 
            
            if not check_password(request['ctx'].POST['password'], user['password']):
                return status.HTTP_404_NOT_FOUND

            serial = UserSerializer(user, many=False)
            user = serial.data
            return status.HTTP_200_OK
        
        def post_user_one(request):
            """
            Creates a user in the database.
            
            Returns:
                dict: The user information.
            """
            user = request['ctx'].POST.copy()
            if Database.user_collection.find_one({'email': user['email']}):
                return status.HTTP_409_CONFLICT
            user['password'] = make_password(user['password'])
            user.update({'id': Database.Counters.get_new_user_counter()})
            serial = UserSerializer(user, many=False)
            Database.user_collection.insert_one(serial.data)
            Database.Counters.increment_user_counter()

        def post_superuser_one(request):
            """
            Creates a superuser in the database.
            
            Returns:
                dict: The superuser information.
            """
            Database.superuser_collection.insert_one(request)
    
    class Counters:
        COUNTER_NAME_KEY = 'name_use'
        COUNTER_VALUE_KEY = 'seq_val'
        GENE_COUNTER_NAME = 'gene_counter'
        DATASET_COUNTER_NAME = 'dataset_counter'
        USER_COUNTER_NAME = 'user_counter'
        INCREMENT_OPERATION = '$set'

        def get_last_user_counter():
            """
            Retrieves the last user counter value from the database.
            
            Returns:
                int: The last user counter value.
            """
            counter = Database.counter_collection.find_one(
                {Database.Counters.COUNTER_NAME_KEY: Database.Counters.USER_COUNTER_NAME})
            if counter:
                serial = CounterSerializer(counter, many=False)
                counter = serial.data.get(Database.Counters.COUNTER_VALUE_KEY)
            else:
                counter = 0
            return counter
        
        def get_last_gene_counter():
            """
            Retrieves the last gene counter value from the database.
            
            Returns:
                int: The last gene counter value.
            """
            counter = Database.counter_collection.find_one(
                {Database.Counters.COUNTER_NAME_KEY: Database.Counters.GENE_COUNTER_NAME})
            if counter:
                serial = CounterSerializer(counter, many=False)
                counter = serial.data.get(Database.Counters.COUNTER_VALUE_KEY)
            else:
                counter = 0
            return counter

        def get_last_dataset_counter():
            """
            Retrieves the last dataset counter value from the database.
            
            Returns:
                int: The last dataset counter value.
            """
            counter = Database.counter_collection.find_one(
                {Database.Counters.COUNTER_NAME_KEY: Database.Counters.DATASET_COUNTER_NAME})
            if counter:
                serial = CounterSerializer(counter, many=False)
                counter = serial.data.get(Database.Counters.COUNTER_VALUE_KEY)
            else:
                counter = 0
            return counter

        def get_new_user_counter():
            """
            Calculates the next user counter value.
            
            Returns:
                int: The next user counter value.
            """
            return Database.Counters.get_last_user_counter() + 1
        
        def get_new_gene_counter():
            """
            Calculates the next gene counter value.
            
            Returns:
                int: The next gene counter value.
            """
            return Database.Counters.get_last_gene_counter() + 1

        def get_new_dataset_counter():
            """
            Calculates the next dataset counter value.
            
            Returns:
                int: The next dataset counter value.
            """
            return Database.Counters.get_last_dataset_counter() + 1

        def increment_user_counter():
            """
            Increments the user counter value in the database.
            
            Returns:
                int: The updated user counter value.
            """
            counter = Database.Counters.get_new_user_counter()
            if counter == 1:
                Database.counter_collection.insert_one({
                    Database.Counters.COUNTER_VALUE_KEY: counter,
                    Database.Counters.COUNTER_NAME_KEY: Database.Counters.USER_COUNTER_NAME
                })
            else:
                Database.counter_collection.update_one({
                    Database.Counters.COUNTER_NAME_KEY: Database.Counters.USER_COUNTER_NAME}, 
                    {
                        Database.Counters.INCREMENT_OPERATION: {
                            Database.Counters.COUNTER_VALUE_KEY: counter, 
                            Database.Counters.COUNTER_NAME_KEY: Database.Counters.USER_COUNTER_NAME
                        }
                    }, 
                upsert=False)
            return counter
        
        def increment_gene_counter():
            """
            Increments the gene counter value in the database.
            
            Returns:
                int: The updated gene counter value.
            """
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
            """
            Increments the dataset counter value in the database.
            
            Returns:
                int: The updated dataset counter value.
            """
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
        @staticmethod
        def get_patients_with_gene_from_dataset(request):
            """Get all patients with a given gene ID from a specified dataset.

            Args:
                request (dict): A dictionary containing the 'gene_id' and 'dataset_id' keys.

            Returns:
                list: A list of patient data objects matching the query.
            """
            patients = Database.patient_collection.find({'$and': [{'gene_ids': str(request['gene_id'])}, {'dataset_id': int(request['dataset_id'])}]}, {'_id': 0, 'gene_ids': 0, 'dataset_id': 0})
            json_data = loads(dumps(patients))
            return json_data 

        @staticmethod
        def get_patient_one(request):
            """Get a single patient with a given patient ID.

            Args:
                request (dict): A dictionary containing the 'patient_id' key.

            Returns:
                dict: A patient data object matching the query.
            """
            patient = Database.patient_collection.find_one({'patient_id': request['patient_id']})
            json_data = loads(dumps(patient))
            return json_data

        @staticmethod
        def get_patient_all(request):
            """Get all patient IDs.

            Args:
                request (dict): An empty dictionary.

            Returns:
                list: A list of patient IDs.
            """
            patients = Database.patient_collection.find({}, {'_id': 0, 'patient_id': 1})
            json_data = loads(dumps(patients))
            return json_data
        
        @staticmethod
        def post_patient_one(request):
            """Insert a single patient record into the database.

            Args:
                request (dict): A dictionary containing patient data.

            Returns:
                dict: HTTP 201 Created status message.
            """
            pass
            return loads(dumps(status.HTTP_201_CREATED))

        @staticmethod
        def post_patient_many(request):
            """Insert multiple patient records into the database.

            Args:
                request (list): A list of dictionaries containing patient data.

            Returns:
                dict: HTTP 201 Created status message.
            """
            Database.patient_collection.insert_many(request)
            return loads(dumps(status.HTTP_201_CREATED))

    class Genes:
        def get_gene_one(request):
            """Retrieves the data for a single gene from the gene collection in the database.

            Args:
                request (dict): A dictionary containing the 'gene_id' and 'gene_name' fields.

            Returns:
                dict: A dictionary containing the gene data.
            """
            gene = Database.gene_collection.find_one({'id': int(request['gene_id']), 'name': str(request['gene_name'])})
            serial = GeneSerializer(gene, many=False)
            json_data = serial.data
            json_data['patient_ids'] = loads(json_data['patient_ids'])
            json_data['gene_values'] = loads(json_data['gene_values'])
            return json_data

        def get_gene_all(request):
            """Retrieves the name and ID of all genes in the gene collection in the database.

            Args:
                request: Not used.

            Returns:
                dict: A dictionary containing the gene names and IDs.
            """
            genes = Database.gene_collection.find({}, {'_id': 0, 'name': 1, 'id': 1})
            json_data = loads(dumps(genes))
            return json_data

        def post_gene_one(request):
            """Adds a single gene to the gene collection in the database.

            Args:
                request: Not used.

            Returns:
                dict: A dictionary containing a status code indicating success or failure.
            """
            pass
            return loads(dumps(status.HTTP_201_CREATED))

        def post_gene_many(request):
            """Adds multiple genes to the gene collection in the database.

            Args:
                request: A list of dictionaries, where each dictionary represents a gene.

            Returns:
                dict: A dictionary containing a status code indicating success or failure.
            """
            Database.gene_collection.insert_many(request) 
            return loads(dumps(status.HTTP_201_CREATED)) 

    class Datasets:
        @staticmethod
        def get_dataset_one(request):
            """Get a single dataset with a given dataset ID.

            Args:
                request (dict): A dictionary containing the 'dataset_id' key.

            Returns:
                dict: A serialized dataset object matching the query.
            """
            dataset = Database.dataset_collection.find_one({'id': int(request['dataset_id'])})
            serial = DatasetSerializer(dataset, many=False)
            return serial.data

        @staticmethod
        def get_dataset_all(request):
            """Get all datasets.

            Args:
                request (dict): An empty dictionary.

            Returns:
                list: A list of serialized dataset objects.
            """
            datasets = Database.dataset_collection.find({}, {'_id': 0})
            json_data = loads(dumps(datasets))
            return json_data

        @staticmethod
        def post_dataset_one(request):
            """Insert a single dataset record into the database.

            Args:
                request (dict): A dictionary containing dataset data.

            Returns:
                dict: HTTP 201 Created status message.
            """
            # Extract data from request and create ParsedDataset object
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

            # Serialize dataset, insert records into database, and increment counters
            serial = DatasetSerializer(dataset.get_dataset_info())
            Database.Patients.post_patient_many(dataset.get_patients())
            Database.Genes.post_gene_many(dataset.get_genes())
            Database.Counters.increment_gene_counter()
            Database.dataset_collection.insert_one(serial.data)
            Database.Counters.increment_dataset_counter()
            return loads(dumps(status.HTTP_201_CREATED))
        
