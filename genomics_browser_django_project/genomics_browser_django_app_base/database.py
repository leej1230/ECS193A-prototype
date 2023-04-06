from bson.json_util import loads, dumps

from genomics_browser_django_app_base.pymongo_get_database import get_connection

from genomics_browser_django_app_base.models import PatientModel
from genomics_browser_django_app_base.models import DatasetModel 
from genomics_browser_django_app_base.models import GeneModel
from genomics_browser_django_app_base.models import CounterModel

from genomics_browser_django_app_base.serializers import PatientSerializer
from genomics_browser_django_app_base.serializers import DatasetSerializer
from genomics_browser_django_app_base.serializers import GeneSerializer
from genomics_browser_django_app_base.serializers import CounterSerializer

class Database(): 
    client = get_connection()
    patient_collection  = client['patients']
    gene_collection     = client['genes']
    dataset_collection  = client['datasets']
    counter_collection  = client['counters']

    class Counters:
        def get_last_dataset_counter():
            counter = Database.counter_collection.find_one({'name_use': 'dataset_counter'})
            if counter:
                serial = CounterSerializer(counter, many=False)
                counter = serial.data.get('seq_val')
            else:
                counter = 1
            return counter

        def increment_dataset_counter():
            counter = Database.Counters.get_last_dataset_counter()
            Database.counter_collection.update_one({"name_use": "dataset_counter"}, {"$set": {"seq_val": counter , "name_use": "dataset_counter"}}, upsert=False)
            return counter

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

    def post_dataset_one(kwargs):
        sample = kwargs['ctx'].POST.copy()
        sample.clear()
        in_txt          = list(kwargs['ctx'].FILES.values())[0]
        name            = in_txt.name
        description     = kwargs['ctx'].POST.get('description') 
        url             = kwargs['ctx'].POST.get('urltoFile')
        date_created    = kwargs['ctx'].POST.get('dateCreated')
        date_created = re.sub(r' GMT[+-]\d{4}\s*\([^)]*\)', '', date_created)
        date_created = datetime.datetime.strptime(date_created, '%a %b %d %Y %H:%M:%S').date()
        dataset = parsed_dataset.ParsedDataset(in_txt, name, description, date_created, url, new_dataset_counter)

        sample.update({'id': Database.Counters.get_last_dataset_counter() + 1})
        sample.update(dataset.get_dataset_info())
        return

