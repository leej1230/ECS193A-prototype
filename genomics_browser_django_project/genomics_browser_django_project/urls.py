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
    re_path(r'^api/test$', views.test),
    re_path(r'^api/patientpost', views.POST_Patient_Data),
    re_path(r'^api/patient/all', views.GET_patientall),
    re_path(r'^api/test/preview', views.test_preview),
    path('api/preview/<slug:patientID>', views.patientQuery),
    path('api/patient/<slug:patientID>', views.GET_patientQuery),

    path('api/upload_dataset', views.POST_Dataset_Data),
    re_path(r'^api/datasetpost', views.POST_Dataset_Data),
    
    re_path(r'^api/dataset/all', views.GET_datasets_all),
    path('api/dataset/<slug:dataset_id>', views.GET_datasets_query ),
    re_path(r'^api/genepost', views.POST_Gene_Data),
    path('api/gene/<str:gene_name>/<slug:gene_id>', views.GET_gene_query),
    re_path(r'^api/gene/all', views.GET_gene_all),
<<<<<<< HEAD
    path('api/gene/<slug:gene_id>', views.GET_gene_query),
    re_path(r'^api/counter/all', views.GET_counter_all),
    re_path(r'^api/seq/names' , views.GET_SEQ_NAMES)
=======
    re_path(r'^api/counter/all', views.GET_counter_all),
    path('api/patients/<str:gene_id>/<slug:dataset_id>', views.GET_patients_info),
>>>>>>> alpha-version
]
