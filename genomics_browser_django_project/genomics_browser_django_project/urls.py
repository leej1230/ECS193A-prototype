"""genomics_browser_django_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
# # from django.conf.urls import url
from genomics_browser_django_app_base import views
from django.urls import path, re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('', views.index, name='index'),
#     re_path(r'^api/patientpost', views.BackendServer.POST_Patient_Data),

    path('api/patient/<slug:patient_id>',           views.BackendServer.as_view(), {"inner": "Patients", "callback": "get_patient_one"}),
    path('api/gene/<str:gene_name>/<slug:gene_id>', views.BackendServer.as_view(), {"inner": "Genes",    "callback": "get_gene_one"}),
    path('api/dataset/<slug:dataset_id>',           views.BackendServer.as_view(), {"inner": "Datasets", "callback": "get_dataset_one"}),
    
    re_path(r'^api/patient/all',                    views.BackendServer.as_view(), {"inner": "Patients", "callback": "get_patient_all"}),
    re_path(r'^api/gene/all',                       views.BackendServer.as_view(), {"inner": "Genes",    "callback": "get_gene_all"}),
    re_path(r'^api/dataset/all',                    views.BackendServer.as_view(), {"inner": "Datasets", "callback": "get_dataset_all"}),
    re_path(r'^api/counter/all',                    views.BackendServer.as_view(), {"inner": "Counters", "callback": "get_counter_all"}),

    path('api/registration',                        views.BackendServer.as_view(), {"inner": "Users",    "callback": "post_user_one"}), 
    path('api/login',                               views.BackendServer.as_view(), {"inner": "Users",    "callback": "get_user_one"}), 

    path('api/upload_dataset',                      views.BackendServer.as_view(), {"inner": "Datasets", "callback": "post_dataset_one"}),

    path('api/update_dataset',                      views.BackendServer.as_view(), {"inner": "Datasets", "callback": "update_dataset_one"}),
#     re_path(r'^api/datasetpost', views.BackendServer.POST_Dataset_Data),
#     re_path(r'^api/genepost', views.BackendServer.POST_Gene_Data),

#     re_path(r'^api/seq/names' , views.BackendServer.GET_SEQ_NAMES),

    re_path(r'^api/seq/names' ,                     views.BackendServer.as_view(), {"inner": "Genes", "callback": "get_seq_names"}),

    path('api/delete_dataset/<slug:dataset_id>',    views.BackendServer.as_view(), {"inner": "Datasets", "callback": "delete_dataset_one"}),

    path('api/patients/<str:gene_id>/<slug:dataset_id>', views.BackendServer.as_view(), {"inner": "Patients", "callback": "get_patients_with_gene_from_dataset"}),
    path('api/patients_in_dataset/<slug:dataset_id>', views.BackendServer.as_view(), {"inner": "Patients", "callback": "get_patients_from_dataset"}),
    path('api/genes_in_dataset/<slug:dataset_id>', views.BackendServer.as_view(), {"inner": "Genes", "callback": "get_genes_from_dataset"}),
    path('api/update_many_patients',                      views.BackendServer.as_view(), {"inner": "Patients", "callback": "update_patients_many_list"}),
    re_path(r".*", views.index, name='index'),
]