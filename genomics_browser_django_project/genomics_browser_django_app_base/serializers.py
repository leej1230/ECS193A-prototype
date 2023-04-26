from rest_framework import serializers
from genomics_browser_django_app_base.models import PatientModel
from genomics_browser_django_app_base.models import GeneModel
from genomics_browser_django_app_base.models import DatasetModel
from genomics_browser_django_app_base.models import CounterModel
from genomics_browser_django_app_base.models import UserModel

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = (
            'id',
            'email',
            'password',
            'is_staff',
            'is_admin'
        )      

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientModel
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
        model = GeneModel
        fields = (
            'id',
            'name',
            'dataset_id',
            'patient_ids',
            'gene_values'
        )

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatasetModel
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
        model = CounterModel
        fields = (
            'seq_val',
            'name_use'
        )
