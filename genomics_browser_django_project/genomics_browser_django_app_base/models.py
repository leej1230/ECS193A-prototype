from django.db import models
from django.core.validators import int_list_validator

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
        )

        user.is_admin = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    email = models.EmailField(verbose_name='email address', max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

# Create your models here.
class PatientModel(models.Model):
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

class GeneModel(models.Model):
    # want all fields in all documents in datasets, can be "" but not omitted
    id = models.PositiveBigIntegerField(blank = False, primary_key=True)
    name = models.CharField(max_length=50, blank=False, default="")
    dataset_id = models.CharField(max_length=50, blank=False, default='')
    patient_ids = models.JSONField(blank=False)
    gene_values = models.JSONField(blank=False)

class DatasetModel(models.Model):
    # want all fields in all documents in datasets, can be "" but not omitted
    id = models.PositiveBigIntegerField(blank = False , primary_key=True)
    name = models.CharField(max_length=50, blank=False, default="")
    description = models.TextField( blank=False, default='' )
    gene_ids = models.JSONField(blank=False)
    patient_ids = models.JSONField(blank=False)
    gene_id_count = models.CharField(max_length=50, blank=False, default='')
    patient_id_count = models.CharField(max_length=50, blank=False, default='')
    date_created = models.DateField(blank = False)
    url = models.URLField(blank = False)

class CounterModel(models.Model):
    # want all fields in all documents in datasets, can be "" but not omitted
    seq_val = models.PositiveBigIntegerField( blank = False )
    name_use = models.CharField(blank = False , max_length=50 )
