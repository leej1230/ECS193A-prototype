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