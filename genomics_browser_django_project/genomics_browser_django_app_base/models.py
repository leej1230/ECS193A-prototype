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
    patient_id = models.CharField(max_length=50, blank=False, default='')
    gene_ids = models.CharField(max_length=50, blank=False, default='')
    gene_values = models.CharField(max_length=50, blank=False, default='')
    dataset_id = models.CharField(max_length=50, blank=False, default='')
    # gene_ids = models.CharField(validators=int_list_validator)
    # gene_values = models.CharField(validators=int_list_validator)
    # dataset_id = models.CharField(validators=int_list_validator)

class Gene_DB(models.Model):
    # want all fields in all documents in datasets, can be "" but not omitted
    id = models.AutoField(auto_created = True,
                  primary_key = True, serialize=True)
    name = models.CharField(max_length=50, blank=False, default="")

class Dataset_DB(models.Model):
    # want all fields in all documents in datasets, can be "" but not omitted
    id = models.AutoField(auto_created = True, primary_key = True, serialize=True)
    name = models.CharField(max_length=50, blank=False, default="")
    description = models.TextField( blank=False, default='' )
    gene_ids = models.JSONField(blank=False)
    patient_ids = models.JSONField(blank=False)
    date_created = models.DateField(auto_now=False, auto_now_add=True)
    url_link = models.URLField(blank = False, default="https://google.com")
