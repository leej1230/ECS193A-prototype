from django.db import models
from django.core.validators import int_list_validator

'''
test = {
    "_id": "UCDSS_1000",
    "gene_ids": ["1","2"],
    "values": [1.50e-6, 0.90432],
    "dataset_id": [1]
}
'''

# Create your models here.
class Patient_DB(models.Model):
    id = models.PositiveBigIntegerField(blank = False , primary_key=True)
    patient_id = models.CharField(max_length=50, blank=False, default='')
    age = models.IntegerField(blank=False, default='')
    diabete = models.BooleanField(blank=False)
    final_diagnosis = models.CharField(max_length=512, blank=False, default='')
    # Wonder if gender can be written in boolean to save some space
    gender = models.CharField(max_length=50, blank=False, default='')
    hypercholesterolemia = models.BooleanField(blank=False)
    hypertension = models.BooleanField(blank=False)
    race = models.CharField(max_length=50, blank=False, default='')
    gene_ids = models.JSONField(blank=False)
    # gene_values = models.CharField(max_length=50, blank=False, default='')
    dataset_id = models.CharField(max_length=50, blank=False, default='')
    # gene_ids = models.CharField(validators=int_list_validator)
    # gene_values = models.CharField(validators=int_list_validator)
    # dataset_id = models.CharField(validators=int_list_validator)

    # Patient should contain:
    #   'id',
    #   'patient_id',
    #   'age',
    #   'diabete',
    #   'final-diagnosis',
    #   'gender',
    #   'hypercholesterolemia',
    #   'hypertension'
    #   'race'
    #   'gene_ids',
    #   'dataset_id'

class Gene_DB(models.Model):
    # want all fields in all documents in datasets, can be "" but not omitted
    id = models.PositiveBigIntegerField(blank = False, primary_key=True)
    name = models.CharField(max_length=50, blank=False, default="")
    dataset_id = models.CharField(max_length=50, blank=False, default='')
    gene_values = models.JSONField(blank=False)

class Dataset_DB(models.Model):
    # want all fields in all documents in datasets, can be "" but not omitted
    id = models.PositiveBigIntegerField(blank = False , primary_key=True)
    name = models.CharField(max_length=50, blank=False, default="")
    description = models.TextField( blank=False, default='' )
    gene_ids = models.CharField(max_length=50, blank=False, default='')
    patient_ids = models.CharField(max_length=50, blank=False, default='')
    date_created = models.DateField(blank = False)
    # There will be url field
    # url_link = models.URLField(blank = False, default="https://google.com")

class Counter_DB(models.Model):
    # want all fields in all documents in datasets, can be "" but not omitted
    seq_val = models.PositiveBigIntegerField( blank = False )
    name_use = models.CharField(blank = False , max_length=50 )
