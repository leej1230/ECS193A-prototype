from rest_framework import serializers
from genomics_browser_django_app_base.models import Patient_DB
from genomics_browser_django_app_base.models import Gene_DB
from genomics_browser_django_app_base.models import Dataset_DB

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient_DB
        fields = (
            'id',
            'patient_id',
            'gene_ids',
            'gene_values',
            'dataset_id'
        )


class GeneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gene_DB
        fields = (
            'id',
            'name'
        )

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset_DB
        fields = (
            'id',
            'name',
            'description',
            'patient_ids',
            'gene_ids',
            'date_created',
            'url_link'
        )