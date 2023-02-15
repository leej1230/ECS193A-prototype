from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status

# from pymongo import MongoClient
from . import pymongo_get_database

from bson.json_util import dumps,loads
import json
 
from genomics_browser_django_app_base.models import Patient_DB
from genomics_browser_django_app_base.serializers import PatientSerializer
from rest_framework.decorators import api_view

client = pymongo_get_database.get_connection()
patient_collection = client['patients']
gene_collection = client['genes']
dataset_collection = client['datasets']

@api_view(['POST'])
def test(request):
    # POST the given data to db
    if request.method == 'POST':
        patient_data = JSONParser().parse(request)
        serial = PatientSerializer(data=patient_data)
        if serial.is_valid():
            serial.save()
            return JsonResponse(serial.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serial.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def POST_Patient_Data(request):
    # POST the given data to db
    if request.method == 'POST':
        # Try to get all the patient_data and make a dictionary
        # If the data is not properly format return error code 406
        try:
            request_Parsed = JSONParser().parse(request)
            # patient_data = {
            #     'patient_id' : request.POST.get('patient_id'),
            #     'gene_ids' : request.POST.get('gene_ids'),
            #     'gene_values' : request.POST.get('gene_values'),
            #     'dataset_id' : request.POST.get('dataset_id')
            # }
            patient_data = {
                'patient_id' : request_Parsed['patient_id'],
                'gene_ids' : request_Parsed['gene_ids'],
                'gene_values' : request_Parsed['gene_values'],
                'dataset_id' : request_Parsed['dataset_id']
            }
        except:
            return JsonResponse(status=status.HTTP_406_NOT_ACCEPTABLE)
        
        # Try to send data to collection
        # If some error happened and couldn't insert, return error code 408
        try:
            patient_collection.insert_one(patient_data)
        except:
            return JsonResponse(status=status.HTTP_408_REQUEST_TIMEOUT)

        return JsonResponse({'status':'data sent'},status=status.HTTP_201_CREATED)

@api_view(['GET'])
def test_preview(request):
    # GET the all of the patient data when there is patient_id
    all_data = Patient_DB.objects.filter()

    if request.method == 'GET':
        serial = PatientSerializer(all_data, many=True)
        return JsonResponse(serial.data, safe=False)
    return JsonResponse(status=status.HTTP_418_IM_A_TEAPOT)

@api_view(['GET'])
def GET_patientall(request):
    if request.method == 'GET':
        item = patient_collection.find({})
        json_data = json.loads(dumps(item))
        return JsonResponse(json_data, safe=False)
        # return JsonResponse(item, safe=False)
    return JsonResponse(status=status.HTTP_418_IM_A_TEAPOT)

@api_view(['GET'])
def patientQuery(request,patientID):
    patient_data = Patient_DB.objects.get(patient_id=patientID)

    if request.method == 'GET':
        serial = PatientSerializer(patient_data)
        return JsonResponse(serial.data)
    return JsonResponse(status=status.HTTP_418_IM_A_TEAPOT)

@api_view(['GET'])
def GET_patientQuery(request,patientID):

    if request.method == 'GET':
        item = patient_collection.find_one({'patient_id':patientID})
        json_data = json.loads(dumps(item))
        return JsonResponse(json_data, safe=False)
        # return JsonResponse(item, safe=False)
    return JsonResponse(status=status.HTTP_418_IM_A_TEAPOT)