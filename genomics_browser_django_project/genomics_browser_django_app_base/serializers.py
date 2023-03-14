from rest_framework import serializers
from genomics_browser_django_app_base.models import Patient_DB
from genomics_browser_django_app_base.models import Gene_DB
from genomics_browser_django_app_base.models import Dataset_DB
from genomics_browser_django_app_base.models import Counter_DB

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient_DB
        fields = (
            'id',
            'patient_id',
            'age',
            'diabete',
            'final_diagnosis',
            'gender',
            'hypercholesterolemia',
            'hypertension',
            'race',
            'gene_ids',
            # 'gene_values',
            'dataset_id'
        )


class GeneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gene_DB
        fields = (
            'id',
            'name',
            'dataset_id',
            'gene_values'
        )

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset_DB
        fields = (
            'id',
            'name',
            'description',
            'gene_ids',
            'patient_ids',
            'gene_id_count',
            'patient_id_count',
            'date_created',
            'url',
        )

class CounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Counter_DB
        fields = (
            'seq_val',
            'name_use'
        )
