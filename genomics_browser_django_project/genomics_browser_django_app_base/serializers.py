from genomics_browser_django_app_base.models import (
    BaseUserModel,
    CounterModel,
    DatasetModel,
    GeneModel,
    PatientModel,
    UserModel,
)
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = (
            'email',
            'first_name',
            'last_name',
            'auth0_uid',
            'date_created',
            'bookmarked_genes',
            'bookmarked_datasets',
            'is_staff',
            'is_admin',
        )


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientModel
        fields = (
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
            'dataset_name',
        )


class GeneSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneModel
        fields = ( 'name', 'dataset_name', 'patient_ids', 'gene_values')


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatasetModel
        fields = (
            'name',
            'description',
            'gene_ids',
            'patient_ids',
            'gene_id_count',
            'patient_id_count',
            'date_created',
            'url',
            'rowType',
            'person_uploaded_dataset',
            'patientCode',
            'geneCode'
        )


class CounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CounterModel
        fields = ('seq_val', 'name_use')
