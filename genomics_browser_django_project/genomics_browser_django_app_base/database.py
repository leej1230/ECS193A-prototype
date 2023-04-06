from bson.json_util import loads, dumps

from . import pymongo_get_database

from genomics_browser_django_app_base.models import PatientModel
from genomics_browser_django_app_base.models import DatasetModel 
from genomics_browser_django_app_base.models import GeneModel
from genomics_browser_django_app_base.models import CounterModel

from genomics_browser_django_app_base.serializers import PatientSerializer
from genomics_browser_django_app_base.serializers import DatasetSerializer
from genomics_browser_django_app_base.serializers import GeneSerializer
from genomics_browser_django_app_base.serializers import CounterSerializer

class Database: 
    client = pymongo_get_database.get_connection()
    patient_collection  = client['patients']
    gene_collection     = client['genes']
    dataset_collection  = client['datasets']
    counter_collection  = client['counters']

    def get_patient_one(kwargs):
        patient = Database.patient_collection.find_one({'patient_id': kwargs['patient_id']})
        json_data = loads(dumps(patient))
        return json_data

    def get_gene_one(kwargs):
        gene = Database.gene_collection.find_one({'id': int(kwargs['gene_id']), 'name': str(kwargs['gene_name'])})
        serial = GeneSerializer(gene, many=False)
        json_data = serial.data
        json_data['patient_ids'] = loads(json_data['patient_ids'])
        json_data['gene_values'] = loads(json_data['gene_values'])
        return json_data
    
    def get_dataset_one(kwargs):
        dataset = Database.dataset_collection.find_one({'id': int(kwargs['dataset_id'])})
        serial = DatasetSerializer(dataset, many=False)
        return serial.data

    def get_patient_all(kwargs):
        patients = Database.patient_collection.find({}, {'_id': 0, 'patient_id': 1})
        json_data = loads(dumps(patients))
        return json_data

    def get_gene_all(kwargs):
        genes = Database.gene_collection.find({}, {'_id': 0, 'name': 1, 'id': 1})
        json_data = loads(dumps(genes))
        return json_data
    
    def get_dataset_all(kwargs):
        datasets = Database.dataset_collection.find({}, {'_id': 0})
        json_data = loads(dumps(datasets))
        return json_data

    def get_counter_all(kwargs):
        counters = Database.counter_collection.find({})
        serial = CounterSerializer(list(counters), many=True)
        return serial.data

    def get_patients_with_gene_from_dataset(kwargs):
        patients = Database.patient_collection.find({'$and': [{'gene_ids': str(kwargs['gene_id'])}, {'dataset_id': int(kwargs['dataset_id'])}]}, {'_id': 0, 'gene_ids': 0, 'dataset_id': 0})
        json_data = loads(dumps(patients))
        return json_data 