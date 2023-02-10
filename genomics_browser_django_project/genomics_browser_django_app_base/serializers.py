from rest_framework import serializers
from genomics_browser_django_app_base.models import Patient_DB

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