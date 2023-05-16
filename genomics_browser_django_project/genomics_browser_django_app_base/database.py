import base64
import copy
import datetime
import json
import math
import os
import re
import urllib.request
import uuid

import numpy as np
import pandas as pd
from bson.json_util import dumps, loads
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.http.response import JsonResponse
from genomics_browser_django_app_base.parsed_dataset import ParsedDataset
from genomics_browser_django_app_base.pymongo_get_database import get_connection
from genomics_browser_django_app_base.serializers import (
    CounterSerializer,
    DatasetSerializer,
    GeneSerializer,
    UserSerializer,
)
from rest_framework import status


class Database:
    client = get_connection()
    patient_collection = client['patients']
    gene_collection = client['genes']
    dataset_collection = client['datasets']
    counter_collection = client['counters']
    user_collection = client['users']
    superuser_collection = client['superusers']

    class Users:
        def decrypt_password(encrypted_password: str) -> str:
            encryptionKey = os.environ.get('ENCRYPTION_SECRET_KEY')
            if not encryptionKey:
                print("Environmental Variable has not been set up!")
                return "Random String"

            cipher = AES.new(encryptionKey, AES.MODE_CBC)
            ciphertext = base64.b64decode(encrypted_password)
            decrypted_password = unpad(
                cipher.decrypt(ciphertext), AES.block_size
            )
            return decrypted_password

        def get_user_one(request):
            """
            Retrieves a user from the database.

            Returns:
                dict: The user information.
            """
            user = Database.user_collection.find_one(
                {'email': request['ctx'].POST['email']}
            )
            if not user:
                return status.HTTP_404_NOT_FOUND

            if not check_password(
                request['ctx'].POST['password'], user['password']
            ):
                return status.HTTP_404_NOT_FOUND

            serial = UserSerializer(user, many=False)
            user = serial.data
            return user

        def get_user_all(request):
            """
            Retrieves all users from the database.

            Returns:
                    list: The users information.
            """
            users = Database.user_collection.find()
            serial = UserSerializer(users, many=True)
            json_data = serial.data
            return json_data

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
            user.update({'id': uuid.uuid4()})
            serial = UserSerializer(user, many=False)
            Database.user_collection.insert_one(serial.data)
            # Database.Counters.increment_user_counter()

        def delete_user_one(request):
            """
            Deletes a user from the database.

            Returns:
                dict: The user information.
            """
            Database.user_collection.delete_one({'id': int(request['user_id'])})
            Database.Counters.decrement_user_counter()

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
        PATIENT_COUNTER_NAME = 'patient_counter'
        USER_COUNTER_NAME = 'user_counter'
        INCREMENT_OPERATION = '$set'

        def get_last_user_counter():
            """
            Retrieves the last user counter value from the database.

            Returns:
                int: The last user counter value.
            """
            counter = Database.counter_collection.find_one(
                {
                    Database.Counters.COUNTER_NAME_KEY: Database.Counters.USER_COUNTER_NAME
                }
            )
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
                {
                    Database.Counters.COUNTER_NAME_KEY: Database.Counters.GENE_COUNTER_NAME
                }
            )
            if counter:
                serial = CounterSerializer(counter, many=False)
                counter = serial.data.get(Database.Counters.COUNTER_VALUE_KEY)
            else:
                counter = 0
            return counter

        def get_last_patient_counter():
            """
            Retrieves the last patient counter value from the database.

            Returns:
                int: The last patient counter value.
            """
            counter = Database.counter_collection.find_one(
                {
                    Database.Counters.COUNTER_NAME_KEY: Database.Counters.PATIENT_COUNTER_NAME
                }
            )
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
                {
                    Database.Counters.COUNTER_NAME_KEY: Database.Counters.DATASET_COUNTER_NAME
                }
            )
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
                Database.counter_collection.insert_one(
                    {
                        Database.Counters.COUNTER_VALUE_KEY: counter,
                        Database.Counters.COUNTER_NAME_KEY: Database.Counters.USER_COUNTER_NAME,
                    }
                )
            else:
                Database.counter_collection.update_one(
                    {
                        Database.Counters.COUNTER_NAME_KEY: Database.Counters.USER_COUNTER_NAME
                    },
                    {
                        Database.Counters.INCREMENT_OPERATION: {
                            Database.Counters.COUNTER_VALUE_KEY: counter,
                            Database.Counters.COUNTER_NAME_KEY: Database.Counters.USER_COUNTER_NAME,
                        }
                    },
                    upsert=False,
                )
            return counter

        def decrement_user_counter():
            """
            Decrements the user counter value in the database.

            Returns:
                int: The updated user counter value.
            """
            counter = Database.Counters.get_last_user_counter() - 1
            Database.counter_collection.update_one(
                {
                    Database.Counters.COUNTER_NAME_KEY: Database.Counters.USER_COUNTER_NAME
                },
                {
                    Database.Counters.INCREMENT_OPERATION: {
                        Database.Counters.COUNTER_VALUE_KEY: counter,
                        Database.Counters.COUNTER_NAME_KEY: Database.Counters.USER_COUNTER_NAME,
                    }
                },
                upsert=False,
            )
            return counter

        def increment_gene_counter():
            """
            Increments the gene counter value in the database.

            Returns:
                int: The updated gene counter value.
            """
            counter = Database.Counters.get_new_gene_counter()
            if counter == 1:
                Database.counter_collection.insert_one(
                    {
                        Database.Counters.COUNTER_VALUE_KEY: counter,
                        Database.Counters.COUNTER_NAME_KEY: Database.Counters.GENE_COUNTER_NAME,
                    }
                )
            else:
                Database.counter_collection.update_one(
                    {
                        Database.Counters.COUNTER_NAME_KEY: Database.Counters.GENE_COUNTER_NAME
                    },
                    {
                        Database.Counters.INCREMENT_OPERATION: {
                            Database.Counters.COUNTER_VALUE_KEY: counter,
                            Database.Counters.COUNTER_NAME_KEY: Database.Counters.GENE_COUNTER_NAME,
                        }
                    },
                    upsert=False,
                )
            return counter

        def increment_dataset_counter():
            """
            Increments the dataset counter value in the database.

            Returns:
                int: The updated dataset counter value.
            """
            counter = Database.Counters.get_new_dataset_counter()
            if counter == 1:
                Database.counter_collection.insert_one(
                    {
                        Database.Counters.COUNTER_VALUE_KEY: counter,
                        Database.Counters.COUNTER_NAME_KEY: Database.Counters.DATASET_COUNTER_NAME,
                    }
                )
            else:
                Database.counter_collection.update_one(
                    {
                        Database.Counters.COUNTER_NAME_KEY: Database.Counters.DATASET_COUNTER_NAME
                    },
                    {
                        Database.Counters.INCREMENT_OPERATION: {
                            Database.Counters.COUNTER_VALUE_KEY: counter,
                            Database.Counters.COUNTER_NAME_KEY: Database.Counters.DATASET_COUNTER_NAME,
                        }
                    },
                    upsert=False,
                )
            return counter

        @staticmethod
        def update_dataset_counter(request):
            """
            Updates the dataset counter value in the database to some value in request.

            Args:
                int: new counter value

            Returns:
                int: The updated dataset counter value.
            """

            counter = Database.counter_collection.find_one(
                {
                    Database.Counters.COUNTER_NAME_KEY: Database.Counters.DATASET_COUNTER_NAME
                }
            )
            if counter:
                serial = CounterSerializer(counter, many=False)
                counter = serial.data.get(Database.Counters.COUNTER_VALUE_KEY)
            else:
                counter = 0

            if counter == 0:
                Database.counter_collection.insert_one(
                    {
                        Database.Counters.COUNTER_VALUE_KEY: int(
                            request['new_counter_value']
                        ),
                        Database.Counters.COUNTER_NAME_KEY: Database.Counters.DATASET_COUNTER_NAME,
                    }
                )
            else:
                Database.counter_collection.update_one(
                    {
                        Database.Counters.COUNTER_NAME_KEY: Database.Counters.DATASET_COUNTER_NAME
                    },
                    {
                        Database.Counters.INCREMENT_OPERATION: {
                            Database.Counters.COUNTER_VALUE_KEY: int(
                                request['new_counter_value']
                            ),
                            Database.Counters.COUNTER_NAME_KEY: Database.Counters.DATASET_COUNTER_NAME,
                        }
                    },
                    upsert=False,
                )
            return request['new_counter_value']

        def update_patient_counter(request):
            """
            Updates the patient counter value in the database to some value in request.

            Args:
                int: new counter value

            Returns:
                int: The updated patient counter value
            """

            counter = Database.counter_collection.find_one(
                {
                    Database.Counters.COUNTER_NAME_KEY: Database.Counters.PATIENT_COUNTER_NAME
                }
            )
            if counter:
                serial = CounterSerializer(counter, many=False)
                counter = serial.data.get(Database.Counters.COUNTER_VALUE_KEY)
            else:
                counter = 0

            if counter == 0:
                Database.counter_collection.insert_one(
                    {
                        Database.Counters.COUNTER_VALUE_KEY: int(
                            request['new_counter_value']
                        ),
                        Database.Counters.COUNTER_NAME_KEY: Database.Counters.PATIENT_COUNTER_NAME,
                    }
                )
            else:
                Database.counter_collection.update_one(
                    {
                        Database.Counters.COUNTER_NAME_KEY: Database.Counters.PATIENT_COUNTER_NAME
                    },
                    {
                        Database.Counters.INCREMENT_OPERATION: {
                            Database.Counters.COUNTER_VALUE_KEY: int(
                                request['new_counter_value']
                            ),
                            Database.Counters.COUNTER_NAME_KEY: Database.Counters.PATIENT_COUNTER_NAME,
                        }
                    },
                    upsert=False,
                )
            return request['new_counter_value']

        def update_gene_counter(request):
            """
            Updates the gene counter value in the database to some value in request.

            Args:
                int: new counter value

            Returns:
                int: The updated gene counter value.
            """

            counter = Database.counter_collection.find_one(
                {
                    Database.Counters.COUNTER_NAME_KEY: Database.Counters.GENE_COUNTER_NAME
                }
            )
            if counter:
                serial = CounterSerializer(counter, many=False)
                counter = serial.data.get(Database.Counters.COUNTER_VALUE_KEY)
            else:
                counter = 0

            if counter == 0:
                Database.counter_collection.insert_one(
                    {
                        Database.Counters.COUNTER_VALUE_KEY: int(
                            request['new_counter_value']
                        ),
                        Database.Counters.COUNTER_NAME_KEY: Database.Counters.GENE_COUNTER_NAME,
                    }
                )
            else:
                Database.counter_collection.update_one(
                    {
                        Database.Counters.COUNTER_NAME_KEY: Database.Counters.GENE_COUNTER_NAME
                    },
                    {
                        Database.Counters.INCREMENT_OPERATION: {
                            Database.Counters.COUNTER_VALUE_KEY: int(
                                request['new_counter_value']
                            ),
                            Database.Counters.COUNTER_NAME_KEY: Database.Counters.GENE_COUNTER_NAME,
                        }
                    },
                    upsert=False,
                )
            return request['new_counter_value']

    class Patients:
        @staticmethod
        def get_patients_with_gene_from_dataset(request):
            """Get all patients with a given gene ID from a specified dataset.

            Args:
                request (dict): A dictionary containing the 'gene_id' and 'dataset_id' keys.

            Returns:
                list: A list of patient data objects matching the query.
            """
            gene = Database.gene_collection.find_one(
                {
                    '$and': [
                        {'name': str(request['gene_id'])},
                        {'dataset_id': int(request['dataset_id'])},
                    ]
                }
            )

            if gene is not None:
                list_possible_patients = gene['patient_ids']['arr']
                str_list_possible_patients = [
                    str(cur_patient) for cur_patient in list_possible_patients
                ]

                patients_found = Database.patient_collection.find(
                    {'patient_id': {'$in': str_list_possible_patients}},
                    {'_id': 0},
                )

                patients_found_list = [{}]
                for doc in patients_found:
                    patients_found_list.append(doc)

                patients_found_list = patients_found_list[1:]

                json_data = loads(dumps(patients_found_list))
                return json_data

            return loads(dumps([{}]))

        @staticmethod
        def get_patients_from_dataset(request):
            """Get all patients from a specified dataset.

            Args:
                request (dict): A dictionary containing the 'dataset_id' key.

            Returns:
                list: A list of patient data objects matching the query.
            """
            patients_found = Database.patient_collection.find(
                {'dataset_id': int(request['dataset_id'])}, {'_id': 0}
            )

            patients_found_list = [{}]
            for doc in patients_found:
                patients_found_list.append(doc)

            patients_found_list = patients_found_list[1:]

            json_data = loads(dumps(patients_found_list))
            return json_data

        @staticmethod
        def get_patient_one(request):
            """Get a single patient with a given patient ID.

            Args:
                request (dict): A dictionary containing the 'patient_id' key.

            Returns:
                dict: A patient data object matching the query.
            """
            patient = Database.patient_collection.find_one(
                {'patient_id': request['patient_id']}
            )
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
            patients = Database.patient_collection.find(
                {}, {'_id': 0, 'patient_id': 1}
            )
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

        @staticmethod
        def update_patients_many_list(request):
            """Update multiple patient records in the database.

            Args:
                request (list): A list of dictionaries containing patient data.

            Returns:
                dict: HTTP 201 Created status message.
            """

            data_request = json.loads(request['ctx'].body)

            patients_update_dict = data_request['patient_modify_list']

            patients_list = list(patients_update_dict.keys())

            patients_dataset_id = 0
            if len(patients_list) > 0:
                patients_dataset_id = patients_update_dict[patients_list[0]][
                    'dataset_id'
                ]

            # for updating patients: need to only focus on patient info
            for i in range(0, len(patients_list)):
                cur_patient_obj = patients_update_dict[patients_list[i]]

                keys_attributes_list = list(cur_patient_obj.keys())
                update_patient_obj = copy.deepcopy(cur_patient_obj)
                for j in range(0, len(keys_attributes_list)):
                    if keys_attributes_list[j][0:4] == "ENSG":
                        # gene modify so remove key from patient info to modify since gene modified separately
                        update_patient_obj.pop(keys_attributes_list[j], None)

                        gene = Database.gene_collection.find_one(
                            {
                                'name': str(keys_attributes_list[j]),
                                'dataset_id': int(patients_dataset_id),
                            }
                        )
                        gene_patients_list = gene['patient_ids']['arr']
                        gene_patient_index = gene_patients_list.index(
                            patients_list[i]
                        )
                        gene_values_list = gene['gene_values']['arr']
                        gene_values_list[gene_patient_index] = float(
                            cur_patient_obj[keys_attributes_list[j]]
                        )

                        Database.gene_collection.update_one(
                            {
                                '$and': [
                                    {'name': str(keys_attributes_list[j])},
                                    {'dataset_id': int(patients_dataset_id)},
                                ]
                            },
                            {
                                "$set": {
                                    'gene_values': {'arr': gene_values_list}
                                }
                            },
                        )

                # patient modify: set to all new attributes, but removed gene names above
                Database.patient_collection.update_one(
                    {
                        '$and': [
                            {'patient_id': str(patients_list[i])},
                            {'dataset_id': int(patients_dataset_id)},
                        ]
                    },
                    {"$set": update_patient_obj},
                )

            return loads(dumps({'status': 'success'}))

    class Genes:
        def get_gene_one(request):
            """Retrieves the data for a single gene from the gene collection in the database.

            Args:
                request (dict): A dictionary containing the 'gene_id' and 'gene_name' fields.

            Returns:
                dict: A dictionary containing the gene data.
            """
            gene = Database.gene_collection.find_one(
                {
                    'id': int(request['gene_id']),
                    'name': str(request['gene_name']),
                }
            )
            serial = GeneSerializer(gene, many=False)
            json_data = serial.data
            return json_data

        def get_gene_all(request):
            """Retrieves the name and ID of all genes in the gene collection in the database.

            Args:
                request: Not used.

            Returns:
                dict: A dictionary containing the gene names and IDs.
            """
            genes = Database.gene_collection.find(
                {}, {'_id': 0, 'name': 1, 'id': 1}
            )
            json_data = loads(dumps(genes))
            return json_data

        def get_search_gene(request):
            """Retrieves the name and ID of particular number of genes in the gene collection in the database based on the keyword user input.

            Args:
                request: Contains the keyword user searched.

            Returns:
                dict: A dictionary containing the gene names and IDs.
            """

            search_word = request['search_word']
            page = int(request['page_id']) - 1

            numberofList = 5

            doc_count = 0

            if search_word == ' ':
                doc_count = Database.gene_collection.count_documents({})
                genes = (
                    Database.gene_collection.find(
                        {}, {'_id': 0, 'name': 1, 'id': 1}
                    )
                    .skip(numberofList * page)
                    .limit(numberofList)
                )
            else:
                doc_count = Database.gene_collection.count_documents(
                    {'name': {'$regex': search_word, '$options': 'i'}}
                )
                genes = (
                    Database.gene_collection.find(
                        {'name': {'$regex': search_word, '$options': 'i'}},
                        {'_id': 0, 'name': 1, 'id': 1},
                    )
                    .skip(numberofList * page)
                    .limit(numberofList)
                )

            json_data = loads(dumps(genes))

            totalPages = math.ceil(doc_count / numberofList)

            print(totalPages)
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

        def get_genes_from_dataset(request):
            """Get all genes from a specified dataset.

            Args:
                request (dict): A dictionary containing the 'dataset_id' key.

            Returns:
                list: A list of gene data objects matching the query.
            """
            genes_found = Database.gene_collection.find(
                {'dataset_id': int(request['dataset_id'])}, {'_id': 0}
            )

            genes_found_list = [{}]
            for doc in genes_found:
                genes_found_list.append(doc)

            genes_found_list = genes_found_list[1:]

            json_data = loads(dumps(genes_found_list))
            return json_data

        def get_seq_names(request):
            gene_ensembl_id = "ENSG00000157764"
            with urllib.request.urlopen(
                'https://biodbnet.abcc.ncifcrf.gov/webServices/rest.php/biodbnetRestApi.json?method=db2db&input=ensemblgeneid&inputValues='
                + gene_ensembl_id
                + '&outputs=refseqmrnaaccession,affyid&taxonId=9606&format=row'
            ) as url:
                s = json.loads(url.read())
                variant_names = s[0]['RefSeq mRNA Accession']
            variant_names_list = variant_names.split('//')

            # for sample just take one variant
            rfseq_accession = variant_names_list[0]

            url_seq = (
                "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id="
                + str(rfseq_accession)
                + "&rettype=fasta&retmode=text"
            )
            with urllib.request.urlopen(url_seq) as url_seq_open:
                seq_resp = url_seq_open.read().decode('utf-8')
                lines_seq = seq_resp.split(',')
                mrna = lines_seq[-1].split('\n')
                return loads(dumps({'code': mrna}))

    class Datasets:
        @staticmethod
        def get_dataset_one(request):
            """Get a single dataset with a given dataset ID.

            Args:
                request (dict): A dictionary containing the 'dataset_id' key.

            Returns:
                dict: A serialized dataset object matching the query.
            """
            dataset = Database.dataset_collection.find_one(
                {'id': int(request['dataset_id'])}
            )
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
                'FILES': request['ctx'].FILES.copy(),
                'POST': request['ctx'].POST.copy(),
            }
            date_created = request['ctx']['POST'].get('dateCreated')
            date_created = re.sub(
                r' GMT[+-]\d{4}\s*\([^)]*\)', '', date_created
            )
            date_created = datetime.datetime.strptime(
                date_created, '%a %b %d %Y %H:%M:%S'
            ).date()
            dataset = ParsedDataset(
                in_txt=list(request['ctx']['FILES'].values())[0],
                name=list(request['ctx']['FILES'].values())[0].name,
                description=request['ctx']['POST'].get('description'),
                url=request['ctx']['POST'].get('urltoFile'),
                date_created=date_created,
                dataset_id=Database.Counters.get_new_dataset_counter(),
            )

            # Serialize dataset, insert records into database, and increment counters
            serial = DatasetSerializer(dataset.get_dataset_info())

            Database.Patients.post_patient_many(dataset.get_patients())

            Database.Genes.post_gene_many(dataset.get_genes())

            Database.Counters.increment_gene_counter()

            Database.dataset_collection.insert_one(serial.data)

            Database.Counters.increment_dataset_counter()
            return loads(dumps(status.HTTP_201_CREATED))

        def delete_dataset_one(request):
            try:
                """
                Even if there is no one matching value(s), no error will be generated, nothing will be deleted and the function will reutrn
                Update counters but be careful of 0 case edge

                Returns:
                    json object: status of operation
                """

                datasets_deleted = Database.dataset_collection.delete_one(
                    {'id': int(request['dataset_id'])}
                )
                genes_deleted = Database.gene_collection.delete_many(
                    {'dataset_id': int(request['dataset_id'])}
                )
                patients_deleted = Database.patient_collection.delete_many(
                    {'dataset_id': int(request['dataset_id'])}
                )

                last_dataset_counter = (
                    Database.Counters.get_last_dataset_counter()
                )
                last_gene_counter = Database.Counters.get_last_gene_counter()
                last_patient_counter = (
                    Database.Counters.get_last_patient_counter()
                )

                if last_dataset_counter > datasets_deleted.deleted_count:
                    last_dataset_counter = (
                        last_dataset_counter - datasets_deleted.deleted_count
                    )
                    ret_val = Database.Counters.update_dataset_counter(
                        {'new_counter_value': last_dataset_counter}
                    )

                if last_gene_counter > genes_deleted.deleted_count:
                    last_dataset_counter = (
                        last_dataset_counter - genes_deleted.deleted_count
                    )
                    Database.Counters.update_gene_counter(
                        {'new_counter_value': last_gene_counter}
                    )

                if last_patient_counter > patients_deleted.deleted_count:
                    last_patient_counter = (
                        last_patient_counter - patients_deleted.deleted_count
                    )
                    Database.Counters.update_patient_counter(
                        {'new_counter_value': last_patient_counter}
                    )

                return loads(dumps(status.HTTP_200_OK))
            except:
                return loads(dumps({status.HTTP_404_NOT_FOUND}))

        @staticmethod
        def update_dataset_one(request):
            # dataset id mandatory, date created will exist, so POST will always be there

            request['ctx'] = {
                'FILES': request['ctx'].FILES.copy(),
                'POST': request['ctx'].POST.copy(),
            }

            date_created = request['ctx']['POST'].get('dateCreated')
            description = request['ctx']['POST'].get('description')
            url = request['ctx']['POST'].get('urltoFile')
            dataset_id = int(request['ctx']['POST'].get('datasetID'))

            dataset_to_modify = Database.Datasets.get_dataset_one(
                {'dataset_id': dataset_id}
            )
            print("existing record:   ", dataset_to_modify)
            atleast_one_modified = False

            new_dataset = {}

            if (
                description != None
                and description != ""
                and description != dataset_to_modify['description']
            ):
                new_dataset["description"] = description
                atleast_one_modified = True

            if url != None and url != "" and url != dataset_to_modify['url']:
                new_dataset["url"] = url
                atleast_one_modified = True

            if (
                date_created != 'null'
                and date_created != None
                and atleast_one_modified
            ):
                date_created = re.sub(
                    r' GMT[+-]\d{4}\s*\([^)]*\)', '', date_created
                )
                date_created = datetime.datetime.strptime(
                    date_created, '%a %b %d %Y %H:%M:%S'
                ).date()
                date_modified = date_created

                serial_temp = DatasetSerializer(
                    {
                        'id': dataset_id,
                        'name': "",
                        'description': "",
                        'gene_ids': json.dumps({'arr': []}),
                        'patient_ids': json.dumps({'arr': []}),
                        'gene_id_count': 0,
                        'patient_id_count': 0,
                        'date_created': date_created,
                        'url': url,
                    }
                )

                new_dataset["date_created"] = serial_temp.data['date_created']

            # Extract data from request and create ParsedDataset object
            if (
                request['ctx']['FILES'] != None
                and len(list(request['ctx']['FILES'].values())) > 0
            ):
                in_txt_file = list(request['ctx']['FILES'].values())[0]
                name_file = list(request['ctx']['FILES'].values())[0].name

                df = pd.read_csv(in_txt_file)
                df = df.drop_duplicates(subset=["Sample name"])
                df = df.loc[:, ~df.columns.duplicated()]

                updated_gene_names = [
                    updated_gene_names
                    for updated_gene_names in df.columns
                    if "ENSG" in updated_gene_names
                ]
                updated_patient_ids = [pid for pid in df["Sample name"]]

                orig_gene_names = dataset_to_modify['gene_ids']["arr"]
                orig_patient_ids = dataset_to_modify['patient_ids']["arr"]

                add_gene_names = list(
                    set(updated_gene_names) - set(orig_gene_names)
                )
                add_patient_ids = list(
                    set(updated_patient_ids) - set(orig_patient_ids)
                )

                modify_gene_names = list(
                    set(updated_gene_names) - set(add_gene_names)
                )
                modify_patient_ids = list(
                    set(updated_patient_ids) - set(add_patient_ids)
                )

                delete_gene_names = list(
                    set(orig_gene_names) - set(updated_gene_names)
                )
                delete_patient_ids = list(
                    set(orig_patient_ids) - set(updated_patient_ids)
                )

                # delete to lighten future operations
                genes_deleted = Database.gene_collection.delete_many(
                    {'name': {'$in': delete_gene_names}}
                )

                patients_deleted = Database.patient_collection.delete_many(
                    {'patient_id': {'$in': delete_patient_ids}}
                )
                print(patients_deleted.deleted_count)

                # modify when there are less in dataset
                for i in range(0, len(modify_gene_names)):
                    cur_gene = modify_gene_names[i]
                    new_gene = {
                        "patient_ids": json.loads(
                            json.dumps({"arr": updated_patient_ids})
                        ),
                        "gene_values": json.loads(
                            json.dumps(
                                {
                                    "arr": df[modify_gene_names]
                                    .T.iloc[i]
                                    .tolist()
                                }
                            )
                        ),
                    }
                    Database.gene_collection.update_one(
                        {'name': cur_gene}, {"$set": new_gene}
                    )

                for i in range(0, len(modify_patient_ids)):
                    cur_patient = modify_patient_ids[i]
                    new_patient = {
                        'age': int(df["Age At Onset"].iloc[i]),
                        'diabete': str(df['Diabetes'].iloc[i]).lower(),
                        'final_diagnosis': str(
                            df['Final Diagnosis'].iloc[i]
                        ).lower(),
                        'gender': str(df['Gender'].iloc[i]).lower(),
                        'hypercholesterolemia': str(
                            df['Hypercholesterolemia'].iloc[i]
                        ).lower(),
                        'hypertension': str(df['Hypertension'].iloc[i]).lower(),
                        'race': str(df['Race'].iloc[i]).lower(),
                        'gene_ids': json.dumps({"arr": updated_gene_names}),
                    }
                    Database.patient_collection.update_one(
                        {'patient_id': cur_patient}, {"$set": new_patient}
                    )

                # add to the dataset
                # want cols about patient, so can't just use add_gene_names list
                stuff_to_add_txt_file = "./temp.csv"
                stuff_to_add_name = "temp"

                if len(add_gene_names) > 0:
                    subset_df_add = df.loc[
                        :, ~df.columns.isin(modify_gene_names)
                    ].copy()
                    subset_df_add.to_csv(stuff_to_add_txt_file)

                    dataset = ParsedDataset(
                        in_txt=stuff_to_add_txt_file,
                        name=stuff_to_add_name,
                        description="",
                        url="",
                        date_created=date_created,
                        dataset_id=dataset_id,
                    )

                    # insert gene records only
                    Database.Genes.post_gene_many(dataset.get_genes())

                if len(add_patient_ids) > 0:
                    subset_df_add = df[df['Sample name'].isin(add_patient_ids)]
                    subset_df_add.to_csv(stuff_to_add_txt_file)

                    dataset = ParsedDataset(
                        in_txt=stuff_to_add_txt_file,
                        name=stuff_to_add_name,
                        description="",
                        url="",
                        date_created=date_created,
                        dataset_id=dataset_id,
                    )

                    Database.Patients.post_patient_many(dataset.get_patients())

                if len(add_patient_ids) > 0 or len(add_gene_names) > 0:
                    os.remove(stuff_to_add_txt_file)

                new_dataset["gene_ids"] = json.loads(
                    json.dumps({"arr": updated_gene_names})
                )
                new_dataset["patient_ids"] = json.loads(
                    json.dumps({"arr": updated_patient_ids})
                )
                new_dataset["gene_id_count"] = len(updated_gene_names)
                new_dataset["patient_id_count"] = len(updated_patient_ids)

                # updated_new_gene_names_indices = [i for i, item in enumerate(diff_gene_names) if item in set(updated_gene_names)]

            Database.dataset_collection.update_one(
                {'id': dataset_id}, {"$set": new_dataset}
            )

            return loads(dumps(status.HTTP_201_CREATED))
