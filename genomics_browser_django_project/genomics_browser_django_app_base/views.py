from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status
 
from genomics_browser_django_app_base.models import Patient_DB
from genomics_browser_django_app_base.serializers import PatientSerializer
from rest_framework.decorators import api_view
# Create your views here.

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

@api_view(['GET'])
def test_preview(request):
    # GET the all of the patient data when there is patient_id
    all_data = Patient_DB.objects.filter()

    if request.method == 'GET':
        serial = PatientSerializer(all_data, many=True)
        return JsonResponse(serial.data, safe=False)
    return JsonResponse(serial.errors, status=status.HTTP_418_IM_A_TEAPOT)