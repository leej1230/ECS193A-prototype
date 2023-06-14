import base64
import copy
import datetime
import json
import math
import operator
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
from django.http.response import JsonResponse
from fuzzywuzzy import fuzz
from genomics_browser_django_app_base.parsed_dataset import ParsedDataset
from genomics_browser_django_app_base.pymongo_get_database import get_connection
from genomics_browser_django_app_base.serializers import (
    CounterSerializer,
    DatasetSerializer,
    GeneSerializer,
    UserSerializer,
)

from rest_framework import status
#from rest_framework.decorators import api_view, renderer_classes

from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer

# from django.http.response import JsonResponse
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer


class Database:
    client = get_connection()
    patient_collection = client['patients']
    gene_collection = client['genes']
    dataset_collection = client['datasets']
    counter_collection = client['counters']
    user_collection = client['users']
    superuser_collection = client['superusers']
    role_history_collection = client['role_histories']
    authorized_email_collection = client['authorized_emails']

    class Users:
        def get_user_one(request):
            """
            Retrieves a user from the database.

            Returns:
                dict: The user information.
            """
            user = Database.user_collection.find_one(
                {'auth0_uid': request['user_id']}
            )
            if not user:
                return status.HTTP_404_NOT_FOUND

            # if not check_password(
            #     request['ctx'].POST['password'], user['password']
            # ):
            #     return status.HTTP_404_NOT_FOUND

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
                None
            """
            user = request['ctx'].POST.copy()
            if Database.user_collection.find_one({'email': user['email']}):
                return status.HTTP_409_CONFLICT
            user.update({'date_created': datetime.datetime.now()})
            user.update({'bookmarked_genes': []})
            user.update({'bookmarked_datasets': []})
            # Temporary
            user.update({'is_admin': True})
            user.update({'is_staff': True})
            serial = UserSerializer(user, many=False)
            Database.user_collection.insert_one(serial.data)
            # Database.Counters.increment_user_counter()

        def delete_user_one(request):
            """
            Deletes a user from the database.

            Returns:
                dict: The user information.
            """
            Database.user_collection.delete_one(
                {'auth0_uid': request['user_id']}
            )
            Database.Counters.decrement_user_counter()

        def post_bookmarked_genes(request):
            request_data = request['ctx'].POST.copy()
            user = Database.user_collection.find_one(
                {'auth0_uid': request_data['user_id']}
            )
            if not user:
                return status.HTTP_404_NOT_FOUND
            # updated_bookmarked_genes = set(user['bookmarked_genes'])
            # updated_bookmarked_genes.add(request_data['gene_url'])
            # Database.user_collection.update_one(
            #     {'$and': {{'auth0_uid': request_data['user_id']}}},
            #     {
            #         "$set": {
            #             {'bookmarked_genes': list(updated_bookmarked_genes)}
            #         }
            #     },
            # )
            query = {'auth0_uid': request_data['user_id']}
            update = {
                "$addToSet": {'bookmarked_genes': request_data['gene_url']}
            }  # Replace 'myArray' with the actual array field name

            Database.user_collection.update_one(query, update)

        def delete_bookmarked_genes(request):
            request_data = request['ctx'].POST.copy()
            user = Database.user_collection.find_one(
                {'auth0_uid': request_data['user_id']}
            )
            if not user:
                return status.HTTP_404_NOT_FOUND

            query = {'auth0_uid': request_data['user_id']}
            update = {
                "$pull": {'bookmarked_genes': request_data['gene_url']}
            }  # Replace 'myArray' with the actual array field name

            Database.user_collection.update_one(query, update)

            updated_user = Database.user_collection.find_one(query)

            return updated_user['bookmarked_genes']

        def post_bookmarked_datasets(request):
            request_data = request['ctx'].POST.copy()
            user = Database.user_collection.find_one(
                {'auth0_uid': request_data['user_id']}
            )
            if not user:
                return status.HTTP_404_NOT_FOUND
            query = {'auth0_uid': request_data['user_id']}
            update = {
                "$addToSet": {
                    'bookmarked_datasets': request_data['dataset_url']
                }
            }  # Replace 'myArray' with the actual array field name

            Database.user_collection.update_one(query, update)

        def delete_bookmarked_datasets(request):
            request_data = request['ctx'].POST.copy()
            user = Database.user_collection.find_one(
                {'auth0_uid': request_data['user_id']}
            )
            if not user:
                return status.HTTP_404_NOT_FOUND

            query = {'auth0_uid': request_data['user_id']}
            update = {
                "$pull": {'bookmarked_datasets': request_data['dataset_url']}
            }  # Replace 'myArray' with the actual array field name

            Database.user_collection.update_one(query, update)

        def get_edits_for_dataset(request):
            """Get all edits for display"""

            data_request = json.loads(request['ctx'].body)
            
            update_dataset_name = ""
            user_updated_id = 0

            if 'dataset_name' in data_request:
                update_dataset_name = str(data_request['dataset_name'])
            
            if 'user_id' in data_request:
                user_updated_id = data_request['user_id']

            edits_for_dataset_by_user_result = []

            user_updated = Database.user_collection.find_one(
                {'auth0_uid': user_updated_id}
            )

            if 'edits' in user_updated:
                edits_structure = user_updated['edits']

                
                if update_dataset_name in edits_structure:
                    # dataset already has some edits
                    edits_for_dataset_by_user_result = edits_structure[
                        update_dataset_name
                    ]

            json_data = loads(dumps(edits_for_dataset_by_user_result))
            return json_data

        def delete_one_edit(request):
            """Delete an edit record since undone likely"""
            try:
                data_request = json.loads(request['ctx'].body)

                edit_rec_id = int(data_request['edit_record_id'])
                update_dataset_name = data_request['dataset_name']
                user_updated_id = data_request['user_id']

                user_updated = Database.user_collection.find_one(
                    {'auth0_uid': user_updated_id}
                )

                if 'edits' in user_updated:
                    edits_structure = user_updated['edits']
                    if update_dataset_name in edits_structure:
                        # dataset already has some edits
                        edits_list = edits_structure[update_dataset_name]
                        edit_rec_index = -1
                        for i in range(0, len(edits_list)):
                            if int(edits_list[i]['id']) == edit_rec_id:
                                edit_rec_index = i
                                break
                        if edit_rec_index != -1:
                            edits_list.pop(edit_rec_index)
                        else:
                            print("Delete record not complete")

                        edits_structure[update_dataset_name] = edits_list

                        user_updated['edits'] = edits_structure

                        # do not update edits count because that would mess up new id generation
                        # only update if last id removed
                        if (
                            'edits_count' in user_updated
                            and user_updated['edits_count'] > 0
                            and user_updated['edits_count'] == edit_rec_id
                        ):
                            user_updated['edits_count'] = (
                                user_updated['edits_count'] - 1
                            )

                        Database.user_collection.update_one(
                            {'auth0_uid': user_updated_id},
                            {
                                "$set": {
                                    'edits_count': user_updated['edits_count'],
                                    'edits': edits_structure,
                                }
                            },
                        )

                return loads(dumps(status.HTTP_200_OK))
            except:
                return loads(dumps({status.HTTP_404_NOT_FOUND}))

            updated_user = Database.user_collection.find_one(query)

            return updated_user['bookmarked_datasets']

        def update_role(request):
            request_data = request['ctx'].POST.copy()
            user = Database.user_collection.find_one(
                {'auth0_uid': request_data['user_uid']}
            )
            if not user:
                return status.HTTP_404_NOT_FOUND

            query = {'auth0_uid': request_data['user_uid']}
            update = {
                "$set": {request_data['role_label']: request_data['value']}
            }  # Replace 'myArray' with the actual array field name

            Database.user_collection.update_one(query, update)

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

    class Role_Histories:
        @staticmethod
        def get_log_all(request):
            """
            Get all hisotry for changing logs
            """
            all_logs = Database.role_history_collection.find(
                {}, {'_id': 0}
            ).sort('time', -1)

            json_data = list(loads(dumps(all_logs)))
            return json_data

        @staticmethod
        def post_log(request):
            """
            Add log to history
            """
            try:
                new_log = {
                    'asked': request['ctx'].POST.get('request_user'),
                    request['ctx']
                    .POST.get('role_title'): request['ctx']
                    .POST.get('changed'),
                    'target': request['ctx'].POST.get('changed_user'),
                    'time': datetime.datetime.now(),
                }
                Database.role_history_collection.insert_one(new_log)

                max_documents = 50
                current_count = (
                    Database.role_history_collection.count_documents({})
                )
                if current_count > max_documents:
                    oldest_documents = (
                        Database.role_history_collection.find()
                        .sort('time', 1)
                        .limit(current_count - max_documents)
                    )
                    for document in oldest_documents:
                        Database.role_history_collection.delete_one(
                            {'_id': document['_id']}
                        )

                return loads(dumps(status.HTTP_200_OK))
            except:
                return loads(dumps({status.HTTP_404_NOT_FOUND}))

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
                        {'dataset_name': str(request['dataset_name'])},
                    ]
                }
            )

            if gene is not None and 'patient_ids' in gene:
                list_possible_patients = gene['patient_ids']['arr']
                str_list_possible_patients = [
                    str(cur_patient) for cur_patient in list_possible_patients
                ]

                patients_found = Database.patient_collection.find(
                    {
                        '$and': [
                            {'patient_id': {'$in': str_list_possible_patients}},
                            {'dataset_name': request['dataset_name']},
                        ]
                    },
                    {'_id': 0},
                )

                patients_found_list = [{}]
                for doc in patients_found:
                    patients_found_list.append(doc)

                patients_found_list = patients_found_list[1:]

                json_data = loads(dumps(patients_found_list))
                return json_data

            return loads(dumps([]))

        @staticmethod
        def get_patients_from_dataset(request):
            """Get all patients from a specified dataset.

            Args:
                request (dict): A dictionary containing the 'dataset_id' key.

            Returns:
                list: A list of patient data objects matching the query.
            """
            patients_found = Database.patient_collection.find(
                {'dataset_name': request['dataset_name']}, {'_id': 0}
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

            max_edits_per_dataset_user_combo = 5

            data_request = json.loads(request['ctx'].body)

            update_dict = data_request['modify_list']
            update_dataset_name = str(data_request['dataset_name'])
            user_updating_id = data_request['user_id']

            objects_list = list(update_dict.keys())

            if (
                'save_undo_list' in data_request
                and len(data_request['save_undo_list'].keys()) > 0
            ):
                objects_old_values_saved = data_request['save_undo_list']
                # Database.edit_collection.insert_one({'id': int(current_num_edits_saved+1), 'edit_info':copy.deepcopy(update_dict), 'old_values':copy.deepcopy(objects_old_values_saved) , 'edit_date':datetime.datetime.now() })
                user_that_is_updating = Database.user_collection.find_one(
                    {'auth0_uid': user_updating_id}
                )

                new_edit_id = 1

                # need to update counts
                if 'edits_count' in user_that_is_updating:
                    current_edits_count = user_that_is_updating['edits_count']
                    user_that_is_updating['edits_count'] = (
                        current_edits_count + 1
                    )
                    new_edit_id = current_edits_count + 1
                else:
                    user_that_is_updating['edits_count'] = 1

                if 'edits' in user_that_is_updating:
                    # update existing edits
                    edits_structure = user_that_is_updating['edits']
                    if update_dataset_name in edits_structure:
                        # dataset already has some edits
                        edits_list_for_dataset = edits_structure[
                            update_dataset_name
                        ]

                        # if pass the maximum allowed for the undo history, then need to remove the oldest one
                        if (
                            len(edits_list_for_dataset)
                            >= max_edits_per_dataset_user_combo
                        ):
                            index_to_remove = -1
                            oldest_date = None
                            for i in range(0, len(edits_list_for_dataset)):
                                cur_edit_record_date = edits_list_for_dataset[
                                    i
                                ]['edit_date']
                                if (
                                    oldest_date == None
                                    or cur_edit_record_date < oldest_date
                                ):
                                    oldest_date = cur_edit_record_date
                                    index_to_remove = i

                            edits_list_for_dataset.pop(index_to_remove)

                        edits_list_for_dataset.append(
                            {
                                'id': new_edit_id,
                                'edit_info': copy.deepcopy(update_dict),
                                'old_values': copy.deepcopy(
                                    objects_old_values_saved
                                ),
                                'edit_date': datetime.datetime.now(),
                            }
                        )

                        edits_structure[
                            update_dataset_name
                        ] = edits_list_for_dataset
                    else:
                        # first time this user is editing this dataset
                        edits_structure[update_dataset_name] = [
                            {
                                'id': new_edit_id,
                                'edit_info': copy.deepcopy(update_dict),
                                'old_values': copy.deepcopy(
                                    objects_old_values_saved
                                ),
                                'edit_date': datetime.datetime.now(),
                            }
                        ]
                    user_that_is_updating['edits'] = edits_structure
                else:
                    # user editing first time
                    user_that_is_updating['edits'] = {
                        update_dataset_name: [
                            {
                                'id': new_edit_id,
                                'edit_info': copy.deepcopy(update_dict),
                                'old_values': copy.deepcopy(
                                    objects_old_values_saved
                                ),
                                'edit_date': datetime.datetime.now(),
                            }
                        ]
                    }
                Database.user_collection.update_one(
                    {'auth0_uid': user_updating_id},
                    {
                        "$set": {
                            'edits_count': user_that_is_updating['edits_count'],
                            'edits': user_that_is_updating['edits'],
                        }
                    },
                )
            
            

            objects_dataset_name = data_request['dataset_name']

            if data_request['row_type_for_dataset'] == "gene":
                # genes are the rows, patient info not exist but just possibly gene values
                for i in range(0, len(objects_list)):
                    cur_gene_obj = update_dict[objects_list[i]]

                    keys_attributes_list = list(cur_gene_obj.keys())
                    update_gene_obj = copy.deepcopy(cur_gene_obj)

                    gene = Database.gene_collection.find_one(
                        {
                            'name': str(objects_list[i]),
                            'dataset_name': str(objects_dataset_name),
                        }
                    )

                    patient_objects_list = None
                    gene_values_list = None
                    if 'patient_ids' in gene:
                        patient_objects_list = gene['patient_ids']['arr']
                    if 'gene_values' in gene:
                        gene_values_list = gene['gene_values']['arr']

                    for j in range(0, len(keys_attributes_list)):
                        if len(keys_attributes_list[j]) >= len(data_request['dataset_patient_code']) and keys_attributes_list[j][0:(len(data_request['dataset_patient_code']))] == data_request['dataset_patient_code']:
                            update_gene_obj.pop(keys_attributes_list[j], None)

                            gene_patient_index = patient_objects_list.index(
                                keys_attributes_list[j]
                            )

                            try:
                                gene_values_list[gene_patient_index] = float(
                                    cur_gene_obj[keys_attributes_list[j]]
                                )
                            except:
                                gene_values_list[gene_patient_index] = cur_gene_obj[keys_attributes_list[j]]
                                

                    # gene modify: set to all new attributes, remove patient keys since saving array of gene values
                    if gene_values_list != None:
                        update_gene_obj['gene_values'] = {
                            'arr': gene_values_list
                        }

                    Database.gene_collection.update_one(
                        {
                            '$and': [
                                {'name': str(objects_list[i])},
                                {'dataset_name': str(objects_dataset_name)},
                            ]
                        },
                        {"$set": update_gene_obj},
                    )

            else:
                # patients are the rows
                for i in range(0, len(objects_list)):
                    cur_patient_obj = update_dict[objects_list[i]]

                    keys_attributes_list = list(cur_patient_obj.keys())
                    update_patient_obj = copy.deepcopy(cur_patient_obj)

                    for j in range(0, len(keys_attributes_list)):
                        if len(keys_attributes_list[j]) >= 4 and keys_attributes_list[j][0:4] == "ENSG":
                            # gene modify so remove key from patient info to modify since gene modified separately
                            update_patient_obj.pop(
                                keys_attributes_list[j], None
                            )

                            gene = Database.gene_collection.find_one(
                                {
                                    'name': str(keys_attributes_list[j]),
                                    'dataset_name': str(objects_dataset_name),
                                }
                            )
                            gene_objects_list = gene['patient_ids']['arr']
                            gene_patient_index = gene_objects_list.index(
                                objects_list[i]
                            )
                            gene_values_list = gene['gene_values']['arr']

                            try:
                                # value may or may not be able to convert to float
                                gene_values_list[gene_patient_index] = float(
                                    cur_patient_obj[keys_attributes_list[j]]
                                )
                            except:
                                gene_values_list[gene_patient_index] = cur_patient_obj[keys_attributes_list[j]]

                            Database.gene_collection.update_one(
                                {
                                    '$and': [
                                        {'name': str(keys_attributes_list[j])},
                                        {'dataset_name': str(objects_dataset_name)},
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
                                {'patient_id': str(objects_list[i])},
                                {'dataset_name': str(objects_dataset_name)},
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
                    'dataset_name': str(request['dataset_name']),
                    'name': str(request['gene_name']),
                },
                {"_id": 0},
            )

            # serial = GeneSerializer(gene, many=False)
            # json_data = serial.data

            return loads(dumps(gene))

        def get_gene_count(request):
            """Retrieves the count of all genes in the gene collection in the database.

            Args:
                request: Not used.

            Returns:
                dict: The gene count
            """
            genes_count = Database.gene_collection.count_documents({})

            # print("gene count total: ", genes_count)

            json_data = loads(dumps({'count': genes_count}))
            return json_data

        def get_gene_all(request):
            """Retrieves the name and ID of all genes in the gene collection in the database.

            Args:
                request: Not used.

            Returns:
                dict: A dictionary containing the gene names and IDs.
            """
            genes = Database.gene_collection.find(
                {}, {'_id': 0, 'name': 1, 'dataset_name': 1}
            )
            json_data = loads(dumps(genes))
            return json_data

        def get_gene_some(request):
            """Retrieves genes with the specified name and ID in the gene collection in the database.

            Args:
                request: contains the name and id of the genes to be returned

            Returns:
                dict: A dictionary containing the full gene information
            """
            data_request = json.loads(request['ctx'].body)

            genes_list = data_request['genes_request_list']

            gene_objs_list = [{}]

            if genes_list == None or len(genes_list) == 0:
                return loads(dumps([]))

            for i in range(len(genes_list)):
                cur_gene_name_datasetname = genes_list[i].split('/')
                cur_name = cur_gene_name_datasetname[0]
                cur_datasetname = cur_gene_name_datasetname[1]

                one_gene = Database.gene_collection.find_one(
                    {'name': cur_name, 'dataset_name': cur_datasetname},
                    {'_id': 0, 'patient_ids': 0, 'gene_values': 0},
                )

                gene_objs_list.append(one_gene)

            gene_objs_list = gene_objs_list[1:]

            json_data = loads(dumps(gene_objs_list))

            return json_data

        def get_search_gene(request):
            """Retrieves the name and ID of a particular number of genes in the gene collection in the database based on the keyword user input.

            Args:
                request: Contains the keyword user searched.

            Returns:
                dict: A dictionary containing the gene names, IDs, current page, and total pages.
            """

            search_word = request['search_word']
            page = int(request['page_id']) - 1

            numberofList = int(request['num_per_page'])

            doc_count = 0

            genes = []

            if search_word.strip() == '' or search_word == " ":
                doc_count = Database.gene_collection.count_documents({})
                genes_full = Database.gene_collection.find(
                    {}, {'_id': 0, 'name': 1, 'dataset_name': 1}
                )
                '''
                    .skip(numberofList * page)
                    .limit(numberofList)
                '''
                genes = [gene for gene in genes_full]
            else:
                # Perform fuzzy matching using the search_word
                fuzzy_results = []
                all_genes = Database.gene_collection.find(
                    {}, {'_id': 0, 'name': 1, 'dataset_name': 1}
                )
                for gene in all_genes:
                    ratio = fuzz.ratio(search_word, gene['name'])
                    if ratio >= 10:
                        fuzzy_results.append(
                            (gene, ratio)
                        )  # Store gene and ratio as a tuple

                fuzzy_results.sort(
                    key=operator.itemgetter(1), reverse=True
                )  # Sort by ratio in descending order
                doc_count = len(fuzzy_results)
                genes = [
                    gene[0] for gene in fuzzy_results
                ]  # Extract the genes from the sorted list

            genes = genes[(page * numberofList) : ((page + 1) * numberofList)]

            json_data = loads(dumps(genes))
            totalPages = math.ceil(doc_count / numberofList)

            response_data = {
                'genes': json_data,
                'current_page': page + 1,
                'total_pages': totalPages,
            }

            return response_data

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

        @staticmethod
        def get_genes_from_dataset(request):
            """Get all genes from a specified dataset.

            Args:
                request (dict): A dictionary containing the 'dataset_id' key.

            Returns:
                list: A list of gene data objects matching the query.
            """
            genes_found = Database.gene_collection.find(
                {'dataset_name': request['dataset_name']}, {'_id': 0}
            )

            genes_found_list = [{}]
            for doc in genes_found:
                genes_found_list.append(doc)

            if len(genes_found_list) > 0:
                genes_found_list = genes_found_list[1:]

            json_data = json.loads( json.dumps(genes_found_list) )

            #json_data = loads(dumps(genes_found_list))

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
        def get_row_type(request):
            dataset = Database.dataset_collection.find_one(
                {'name': request['dataset_name'] }
            )

            if dataset == None or 'rowType' not in dataset:
                return loads(dumps(""))

            return loads(dumps(dataset['rowType']))


        @staticmethod
        def get_dataset_one(request):
            """Get a single dataset with a given dataset name.

            Args:
                request (dict): A dictionary containing the 'dataset_id' key.

            Returns:
                dict: A serialized dataset object matching the query.
            """

            dataset = Database.dataset_collection.find_one(
                {'name': request['dataset_name'] }, {'_id': 0}
            )

            
            if dataset:
                serial = DatasetSerializer(dataset, many=False)

                json_data = loads(dumps(serial.data))
                return json_data
   
            return {}

        def get_dataset_count(request):
            """Retrieves the count of all datasets in the dataset collection in the database.

            Args:
                request: Not used.

            Returns:
                dict: The dataset count
            """
            datasets_count = Database.dataset_collection.count_documents({})

            # print("datasets count total: ", datasets_count)

            json_data = loads(dumps({'count': datasets_count}))
            return json_data

        def get_search_dataset(request):
            """Retrieves the name and ID of particular number of datasets in the dataset collection in the database based on the keyword user input.

            Args:
                request: Contains the keyword user searched.

            Returns:
                dict: A dictionary containing the dataset info
            """

            search_word = request['search_word']
            page = int(request['page_id']) - 1

            numberofList = int(request['num_per_page'])

            doc_count = 0

            datasets = []

            if search_word == " " or search_word.strip() == '':
                doc_count = Database.dataset_collection.count_documents({})
                datasets = Database.dataset_collection.find(
                    {},
                    {
                        '_id': 0,
                        'name': 1,
                        'description': 1,
                        'date_created': 1,
                        'rowType': 1,
                        'geneCode': 1,
                        'patientCode': 1,
                    },
                )
                '''.skip(numberofList * page)
                    .limit(numberofList)'''
            else:
                fuzzy_results = []
                all_datasets = Database.dataset_collection.find(
                    {},
                    {
                        '_id': 0,
                        'name': 1,
                        'description': 1,
                        'date_created': 1,
                        'rowType': 1,
                        'geneCode': 1,
                        'patientCode': 1,
                    },
                )
                for dataset in all_datasets:
                    ratio = fuzz.ratio(search_word, dataset['name'])
                    if ratio >= 10:
                        fuzzy_results.append(
                            (dataset, ratio)
                        )  # Store dataset and ratio as a tuple

                fuzzy_results.sort(
                    key=operator.itemgetter(1), reverse=True
                )  # Sort by ratio in descending order
                doc_count = len(fuzzy_results)
                datasets = [
                    dataset[0] for dataset in fuzzy_results
                ]  # Extract the datasets from the sorted list

                '''
                doc_count = Database.dataset_collection.count_documents(
                    {'name': {'$regex': search_word, '$options': 'i'}}
                )
                datasets = (
                    Database.dataset_collection.find(
                        {'name': {'$regex': search_word, '$options': 'i'}},
                        {
                            '_id': 0,
                            'name': 1,
                            'id': 1,
                            'description': 1,
                            'date_created': 1,
                            'rowType': 1,
                            'geneCode': 1,
                            'patientCode': 1,
                        },
                    )
                    .skip(numberofList * page)
                    .limit(numberofList)
                )'''

            datasets = datasets[
                (page * numberofList) : ((page + 1) * numberofList)
            ]

            json_data = loads(dumps(datasets))

            totalPages = math.ceil(doc_count / numberofList)

            response_data = {
                'datasets': json_data,
                'current_page': page + 1,
                'total_pages': totalPages,
            }

            # print(totalPages)
            return loads(dumps(response_data))

        def get_dataset_name_for_id(request):
            """Get the dataset name given dataset ID.

            Args:
                request (dict): A dictionary containing the 'dataset_id' key.

            Returns:
                dict: Just the dataset name
            """

            dataset = Database.dataset_collection.find_one(
                {'name': request['dataset_name']}
            )

            name_info = dataset['name']
            return loads(dumps(name_info))

        def get_dataset_some(request):
            """Retrieves datasets with the specified name and ID in the dataset collection in the database.

            Args:
                request: contains the name and id of the datasets to be returned

            Returns:
                dict: A dictionary containing the full dataset information
            """
            data_request = json.loads(request['ctx'].body)

            datasets_list = data_request['datasets_request_list']

            dataset_objs_list = [{}]

            if not datasets_list or len(datasets_list) == 0:
                return loads(dumps([]))

            for i in range(len(datasets_list)):
                cur_dataset_name_datasetname = datasets_list[i]

                one_dataset = Database.dataset_collection.find_one(
                    { 'name' : cur_dataset_name_datasetname },
                    {'_id': 0, 'patient_ids': 0, 'gene_ids': 0},
                )

                dataset_objs_list.append(one_dataset)

            dataset_objs_list = dataset_objs_list[1:]

            json_data = loads(dumps(dataset_objs_list))

            return json_data

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
            person_uploaded = request['ctx']['POST'].get('nameFull')
            date_created = request['ctx']['POST'].get('dateCreated')
            date_created = re.sub(
                r' GMT[+-]\d{4}\s*\([^)]*\)', '', date_created
            )
            date_created = datetime.datetime.strptime(
                date_created, '%a %b %d %Y %H:%M:%S'
            ).date()

            # check if dataset name already exist
            dataset_check_duplicate = Database.Datasets.get_dataset_one(
                {'dataset_name': str( list(request['ctx']['FILES'].values())[0].name ).lower() }
            )

            print(dataset_check_duplicate)
            # no result from find_one() is {}, so check this
            if dataset_check_duplicate == None or (dataset_check_duplicate != None and  len(dataset_check_duplicate.keys()) > 0 ):
                return loads(dumps(status.HTTP_409_CONFLICT))

            try:
                dataset = ParsedDataset(
                    in_txt=list(request['ctx']['FILES'].values())[0],
                    name=list(request['ctx']['FILES'].values())[0].name,
                    description=request['ctx']['POST'].get('description'),
                    url=request['ctx']['POST'].get('urltoFile'),
                    geneCode=request['ctx']['POST'].get('geneCode'),
                    patientCode=request['ctx']['POST'].get('patientCode'),
                    rowType=request['ctx']['POST'].get('rowType'),
                    date_created=date_created,
                    person_uploaded_dataset=person_uploaded,
                )

                # Serialize dataset, insert records into database, and increment counters
    
                serial = DatasetSerializer(dataset.get_dataset_info())

                if len(dataset.get_patients()) > 0:
                    Database.Patients.post_patient_many(dataset.get_patients())

                #cur_gene_cntr = Database.Counters.get_last_gene_counter()
                #list_new_genes = dataset.get_genes(cur_gene_cntr)
                list_new_genes = dataset.get_genes()
                if len(list_new_genes) > 0:
                    Database.Genes.post_gene_many(list_new_genes)
                    '''Database.Counters.update_gene_counter(
                        {'new_counter_value': (cur_gene_cntr + len(list_new_genes))}
                    )'''

                #Database.Counters.increment_gene_counter()

                Database.dataset_collection.insert_one(serial.data)

                #Database.Counters.increment_dataset_counter()
                return loads(dumps(status.HTTP_201_CREATED))
            except:
                return loads(dumps(status.HTTP_406_NOT_ACCEPTABLE))

        def delete_dataset_one(request):
            try:
                """
                Even if there is no one matching value(s), no error will be generated, nothing will be deleted and the function will reutrn
                Update counters but be careful of 0 case edge

                Returns:
                    json object: status of operation
                """

                request_data = json.loads(request['ctx'].body)

                genes_in_dataset = Database.Genes.get_genes_from_dataset(
                    {'dataset_name': str(request_data['dataset_name'])}
                )

                cur_dataset = Database.Datasets.get_dataset_one(
                    {'dataset_name': str(request_data['dataset_name'])}
                )

                cur_users = Database.user_collection.find({})

                full_users_list = [{}]
                for doc in cur_users:
                    full_users_list.append(doc)

                full_users_list = full_users_list[1:]

                for i in range(0, len(full_users_list)):
                    # need to delete bookmarks: genes and datasets, delete edits
                    cur_user = full_users_list[i]

                    need_to_update_bookmarks_gene = False
                    need_to_update_bookmarks_dataset = False
                    need_to_update_edits = False

                    for gene_cur in genes_in_dataset:
                        inner_code = (
                            str(gene_cur['name']) + '/' + str(gene_cur['dataset_name'])
                        )
                        if (
                            'bookmarked_genes' in cur_user
                            and inner_code in cur_user['bookmarked_genes']
                        ):
                            cur_user['bookmarked_genes'] = list(
                                cur_user['bookmarked_genes']
                            )
                            cur_user['bookmarked_genes'].remove(inner_code)
                            need_to_update_bookmarks_gene = True

                    inner_code = (
                        str(cur_dataset['name'])
                    )
                    if (
                        'bookmarked_datasets' in cur_user
                        and inner_code in cur_user['bookmarked_datasets']
                    ):
                        cur_user['bookmarked_datasets'] = list(
                            cur_user['bookmarked_datasets']
                        )
                        cur_user['bookmarked_datasets'].remove(inner_code)
                        need_to_update_bookmarks_dataset = True

                    # clear edit records for this dataset
                    if 'edits' in cur_user:
                        if str(cur_dataset['name']) in cur_user['edits']:
                            cur_user['edits'].pop(str(cur_dataset['name']), None)
                            need_to_update_edits = True

                    user_updated_obj = {}

                    if (
                        'bookmarked_genes' in cur_user
                        and need_to_update_bookmarks_gene
                    ):
                        user_updated_obj['bookmarked_genes'] = cur_user[
                            'bookmarked_genes'
                        ]
                    if (
                        'bookmarked_datasets' in cur_user
                        and need_to_update_bookmarks_dataset
                    ):
                        user_updated_obj['bookmarked_datasets'] = cur_user[
                            'bookmarked_datasets'
                        ]
                    if 'edits' in cur_user and need_to_update_edits:
                        user_updated_obj['edits'] = cur_user['edits']

                    if (
                        need_to_update_edits
                        or need_to_update_bookmarks_gene
                        or need_to_update_bookmarks_dataset
                    ):
                        # save updated values

                        Database.user_collection.update_one(
                            {'auth0_uid': cur_user['auth0_uid']},
                            {"$set": user_updated_obj},
                        )

                datasets_deleted = Database.dataset_collection.delete_one(
                    {'name': request_data['dataset_name'] }
                )
                genes_deleted = Database.gene_collection.delete_many(
                    {'dataset_name': request_data['dataset_name']}
                )
                patients_deleted = Database.patient_collection.delete_many(
                    {'dataset_name': request_data['dataset_name']}
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

            #date_created = request['ctx']['POST'].get('dateCreated')
            description = request['ctx']['POST'].get('description')
            '''geneCode = (request['ctx']['POST'].get('geneCode'),)
            patientCode = (request['ctx']['POST'].get('patientCode'),)
            rowType = (request['ctx']['POST'].get('rowType'),)'''
            url = request['ctx']['POST'].get('urltoFile')
            dataset_name = request['ctx']['POST'].get('datasetName')


            dataset_to_modify = Database.Datasets.get_dataset_one(
                {'dataset_name': str(dataset_name) }
            )
            # print("existing record:   ", dataset_to_modify)
            atleast_one_modified = False

            new_dataset = {}

            if (
                description != None
                and description != ""
                and 'description' in dataset_to_modify
                and description != dataset_to_modify['description']
            ):
                new_dataset["description"] = description
                atleast_one_modified = True

            if url != None and url != "" and 'url' in dataset_to_modify and url != dataset_to_modify['url']:
                new_dataset["url"] = url
                atleast_one_modified = True

            '''if (
                date_created != 'null'
                and date_created != None
                and date_created != ""
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
                        'name': dataset_name,
                        'description': "",
                        'gene_ids': json.dumps({'arr': []}),
                        'patient_ids': json.dumps({'arr': []}),
                        'gene_id_count': 0,
                        'patient_id_count': 0,
                        'date_created': date_created,
                        'url': url,
                        'rowType': 'patient',
                        'person_uploaded_dataset': "a"
                    }
                )

                new_dataset["date_created"] = serial_temp.data['date_created']'''

            # Extract data from request and create ParsedDataset object
            '''if (
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
                # print(patients_deleted.deleted_count)

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
                        #name=stuff_to_add_name,
                        name=dataset_name,
                        description="",
                        url="",
                        geneCode="",
                        patientCode="",
                        rowType="",
                        date_created=date_created
                    )

                    # insert gene records only
                    Database.Genes.post_gene_many(dataset.get_genes())

                if len(add_patient_ids) > 0:
                    subset_df_add = df[df['Sample name'].isin(add_patient_ids)]
                    subset_df_add.to_csv(stuff_to_add_txt_file)

                    dataset = ParsedDataset(
                        in_txt=stuff_to_add_txt_file,
                        #name=stuff_to_add_name,
                        name=dataset_name,
                        description="",
                        url="",
                        geneCode="",
                        patientCode="",
                        rowType="",
                        date_created=date_created
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
                new_dataset["patient_id_count"] = len(updated_patient_ids)'''

                # updated_new_gene_names_indices = [i for i, item in enumerate(diff_gene_names) if item in set(updated_gene_names)]

            Database.dataset_collection.update_one(
                {'name': dataset_name}, {"$set": new_dataset}
            )

            return loads(dumps(status.HTTP_201_CREATED))

    class Utils:
        def authorize_Email(request):
            email = json.loads(request['ctx'].body).get('email')
            email_query = {"email": email}
            isEmailRegistered = Database.authorized_email_collection.find_one(
                email_query
            )

            if isEmailRegistered:
                raise Exception("Email already exists")
                # response_data = {'success': False, 'message': 'Email already exists'}
            else:
                new_email = {"email": email}
                Database.authorized_email_collection.insert_one(new_email)
                response_data = {
                    'success': True,
                    'message': 'Email added successfully',
                }

            return response_data

        def check_Email(request):
            email = json.loads(request['ctx'].body).get('email')
            email_query = {"email": email}
            query_res = Database.authorized_email_collection.find_one(
                email_query
            )

            res = True if query_res else False

            return {"isExists": res}
