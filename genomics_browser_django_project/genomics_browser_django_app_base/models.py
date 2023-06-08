import datetime

from django.db import models


class BaseUserModel(models.Model):
    auth0_uid = models.CharField(max_length=200, null=False)
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=200, null=False)
    last_name = models.CharField(max_length=200, null=False)
    auth0_uid = models.CharField(max_length=200, null=False)
    date_created = models.DateTimeField(default=datetime.date.today, null=False)
    bookmarked_genes = models.JSONField(blank=True, null=True)
    bookmarked_datasets = models.JSONField(blank=True, null=True)


class UserModel(BaseUserModel):
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)


class SuperUserModel(BaseUserModel):
    is_admin = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)


class PatientModel(models.Model):
    id = models.PositiveBigIntegerField(blank=False, primary_key=True)
    patient_id = models.CharField(max_length=50, blank=False, default="")
    age = models.IntegerField(blank=False, default="")
    diabete = models.BooleanField(blank=False)
    final_diagnosis = models.CharField(max_length=512, blank=False, default="")
    # Wonder if gender can be written in boolean to save some space
    gender = models.CharField(max_length=50, blank=False, default="")
    hypercholesterolemia = models.BooleanField(blank=False)
    hypertension = models.BooleanField(blank=False)
    race = models.CharField(max_length=50, blank=False, default="")
    gene_ids = models.JSONField(blank=False)
    # gene_values = models.CharField(max_length=50, blank=False, default='')
    dataset_id = models.CharField(max_length=50, blank=False, default="")
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


class GeneModel(models.Model):
    # want all fields in all documents in datasets, can be "" but not omitted
    id = models.PositiveBigIntegerField(blank=False, primary_key=True)
    name = models.CharField(max_length=50, blank=False, default="")
    dataset_id = models.CharField(max_length=50, blank=False, default="")
    patient_ids = models.JSONField(blank=False, null=True)
    gene_values = models.JSONField(blank=False , null=True)


class DatasetModel(models.Model):
    # want all fields in all documents in datasets, can be "" but not omitted
    id = models.PositiveBigIntegerField(blank=False, primary_key=True)
    name = models.CharField(max_length=50, blank=False, default="")
    description = models.TextField(blank=True, default="", null=True)
    gene_ids = models.JSONField(blank=True, null=True)
    patient_ids = models.JSONField(blank=True, null=True)
    gene_id_count = models.CharField(max_length=50, blank=True, default="", null=True)
    patient_id_count = models.CharField(max_length=50, blank=True, default="", null=True)
    date_created = models.DateField(blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    rowType = models.TextField(blank=False, null=False)
    person_uploaded_dataset = models.TextField(blank=False, null=False)


class CounterModel(models.Model):
    # want all fields in all documents in datasets, can be "" but not omitted
    seq_val = models.PositiveBigIntegerField(blank=False)
    name_use = models.CharField(blank=False, max_length=50)
