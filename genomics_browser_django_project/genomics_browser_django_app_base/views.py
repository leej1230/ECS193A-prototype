from rest_framework.parsers import JSONParser 
from rest_framework import status

import json
import urllib.request
 
from rest_framework.decorators import api_view

import datetime
import re

from . import parsed_dataset
from . import database

import datetime

from django.views import View
from django.http import JsonResponse

class BackendServer(View):
    def get(self, response, **kwargs):
        callback = getattr(getattr(database.Database, kwargs['inner']), kwargs['callback'])
        return self.render_to_response(response, callback)

    def post(self, response, **kwargs):
        callback = getattr(database.Database, kwargs['callback'])
        self.kwargs.update({'ctx': response})
        return self.render_to_response(response, callback)

    def render_to_response(self, ctx, callback, **response_kwargs):
        return self.render_to_json_response(callback, **response_kwargs)
    
    def render_to_json_response(self, callback, **response_kwargs):
        data = callback(self.kwargs)
        return JsonResponse(data, **response_kwargs, safe=False)
        
# # external api
# @api_view(['GET'])
# def GET_SEQ_NAMES(request):
#         if request.method == 'GET':
#                 gene_ensembl_id = "ENSG00000157764"
#                 with urllib.request.urlopen('https://biodbnet.abcc.ncifcrf.gov/webServices/rest.php/biodbnetRestApi.json?method=db2db&input=ensemblgeneid&inputValues=' + gene_ensembl_id + '&outputs=refseqmrnaaccession,affyid&taxonId=9606&format=row') as url:
#                 s = json.loads(url.read())
#                 variant_names = s[0]['RefSeq mRNA Accession']
#                 variant_names_list = variant_names.split('//')

#                 # for sample just take one variant
#                 rfseq_accession = variant_names_list[0]

#                 url_seq = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=" + str(rfseq_accession) + "&rettype=fasta&retmode=text"

#                 with urllib.request.urlopen(url_seq) as url_seq_open:
#                 seq_resp = url_seq_open.read().decode('utf-8')
#                 lines_seq = seq_resp.split(',')
#                 mrna = lines_seq[-1].split('\n')
#                 return JsonResponse({'code' : mrna}, safe=False) 
#                 # JsonResponse(counter_serialized.errors, safe=False)

#         return JsonResponse(status=status.HTTP_418_IM_A_TEAPOT)

    
# @api_view(['POST'])
# def POST_Patient_Data(self, request):
#     # POST the given data to db
#     if request.method == 'POST':
#         # Try to get all the patient_data and make a dictionary
#         # If the data is not properly format return error code 406
#         try:
#             request_Parsed = JSONParser().parse(request)
#             # patient_data = {
#             #     'patient_id' : request.POST.get('patient_id'),
#             #     'gene_ids' : request.POST.get('gene_ids'),
#             #     'gene_values' : request.POST.get('gene_values'),
#             #     'dataset_id' : request.POST.get('dataset_id')
#             # }
#             patient_data = {
#                 'patient_id' : request_Parsed['patient_id'],
#                 'gene_ids' : request_Parsed['gene_ids'],
#                 'gene_values' : request_Parsed['gene_values'],
#                 'dataset_id' : request_Parsed['dataset_id']
#             }
#         except:
#             return JsonResponse(status=status.HTTP_406_NOT_ACCEPTABLE)
        
#         # Try to send data to collection
#         # If some error happened and couldn't insert, return error code 408
#         try:
#             self.patient_collection.insert_one(patient_data)
#         except:
#             return JsonResponse(status=status.HTTP_408_REQUEST_TIMEOUT)

#         return JsonResponse({'status':'data sent'},status=status.HTTP_201_CREATED)

# @api_view(['POST'])
# def POST_Gene_Data(request):
#     # POST the given data to db
#     if request.method == 'POST':
#         # Try to get dataset and make a dictionary
#         # If the data is not properly format return error code 406

#         updated_request = request.POST.copy()

#         gene_serialized = None

#         try:
#             #request_Parsed = request.data
#             request_Parsed = updated_request

#             # find next id
#             new_counter_seq = 0
#             counter_item = counter_collection.find_one({ "name_use": "gene_counter" })

#             if( counter_item ):
#                     counter_interpreted = CounterSerializer(data = counter_item, many=False)

#                     if counter_interpreted.is_valid():
#                         json_data = counter_interpreted.data
#                         new_counter_seq = int(json_data["seq_val"])
#                         temp_update_seq = new_counter_seq + 1
#                         counter_collection.update_one( {"name_use": "gene_counter" }, {"$set": {"seq_val" : temp_update_seq , "name_use":"gene_counter" } }, upsert=False )
#                     else:
#                         return JsonResponse(counter_interpreted.errors, safe=False)

#             else:
#                 # need to create a counter for gene
#                 new_counter_seq = 1
#                 counter_collection.insert_one( { "seq_val" : 2 , "name_use" : "gene_counter" } )

#             request_Parsed.update({'id': new_counter_seq})

#             gene_serialized = GeneSerializer(data = request_Parsed)

#         except:
#             return JsonResponse(status=status.HTTP_406_NOT_ACCEPTABLE)
        
#         # Try to send data to collection
#         # If some error happened and couldn't insert, return error code 408

#         # need to add checks to prevent duplicate dataset creation
#         try:
            
#             if gene_serialized.is_valid():
#                 gene_collection.insert_one(gene_serialized.data)

#                 return JsonResponse({'status':'data sent'},status=status.HTTP_201_CREATED)
#             else:
#                 return JsonResponse(gene_serialized.errors, status=status.HTTP_201_CREATED, safe=False)
            
#         except:
#             return JsonResponse(status=status.HTTP_408_REQUEST_TIMEOUT)

