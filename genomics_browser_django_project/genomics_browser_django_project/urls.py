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
from django.urls import path, re_path
from genomics_browser_django_app_base import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path(
        'api/patient/<slug:patient_id>',
        views.BackendServer.as_view(),
        {"inner": "Patients", "callback": "get_patient_one"},
    ),
    path(
        'api/gene/<str:gene_name>/<slug:gene_id>',
        views.BackendServer.as_view(),
        {"inner": "Genes", "callback": "get_gene_one"},
    ),
    path(
        'api/genes_some',
        views.BackendServer.as_view(),
        {"inner": "Genes", "callback": "get_gene_some"},
    ),
    path(
        'api/dataset_search/<str:search_word>/<str:page_id>',
        views.BackendServer.as_view(),
        {"inner": "Datasets", "callback": "get_search_dataset"},
    ),
    path(
        'api/dataset_name_from_dataset_id/<slug:dataset_id>',
        views.BackendServer.as_view(),
        {"inner": "Datasets", "callback": "get_dataset_name_for_id"},
    ),
    path(
        'api/dataset/<slug:dataset_id>',
        views.BackendServer.as_view(),
        {"inner": "Datasets", "callback": "get_dataset_one"},
    ),
    path(
        'api/gene/search/<str:search_word>/<str:page_id>',
        views.BackendServer.as_view(),
        {"inner": "Genes", "callback": "get_search_gene"},
    ),
    re_path(
        r'^api/patient/all',
        views.BackendServer.as_view(),
        {"inner": "Patients", "callback": "get_patient_all"},
    ),
    re_path(
        r'^api/gene_count',
        views.BackendServer.as_view(),
        {"inner": "Genes", "callback": "get_gene_count"},
    ),
    re_path(
        r'^api/dataset_count',
        views.BackendServer.as_view(),
        {"inner": "Datasets", "callback": "get_dataset_count"},
    ),
    re_path(
        r'^api/gene/all',
        views.BackendServer.as_view(),
        {"inner": "Genes", "callback": "get_gene_all"},
    ),
    re_path(
        r'^api/dataset/all',
        views.BackendServer.as_view(),
        {"inner": "Datasets", "callback": "get_dataset_all"},
    ),
    re_path(
        r'^api/counter/all',
        views.BackendServer.as_view(),
        {"inner": "Counters", "callback": "get_counter_all"},
    ),
    path(
        'api/registration',
        views.BackendServer.as_view(),
        {"inner": "Users", "callback": "post_user_one"},
    ),
    path(
        'api/login/<slug:user_id>',
        views.BackendServer.as_view(),
        {"inner": "Users", "callback": "get_user_one"},
    ),
    path(
        'api/get-user-all',
        views.BackendServer.as_view(),
        {"inner": "Users", "callback": "get_user_all"},
    ),
    path(
        'api/add-bookmark',
        views.BackendServer.as_view(),
        {"inner": "Users", "callback": "post_bookmarked_genes"},
    ),
    path(
        'api/remove-bookmark',
        views.BackendServer.as_view(),
        {"inner": "Users", "callback": "delete_bookmarked_genes"},
    ),
    path(
        'api/add-dataset-bookmark',
        views.BackendServer.as_view(),
        {"inner": "Users", "callback": "post_bookmarked_datasets"},
    ),
    path(
        'api/remove-dataset-bookmark',
        views.BackendServer.as_view(),
        {"inner": "Users", "callback": "delete_bookmarked_datasets"},
    ),
    path(
        'api/delete-user/<slug:user_id>/',
        views.BackendServer.as_view(),
        {"inner": "Users", "callback": "delete_user_one"},
    ),
    path(
        'api/datasets_some',
        views.BackendServer.as_view(),
        {"inner": "Datasets", "callback": "get_dataset_some"}
    ),
    path(
        'api/update-role',
        views.BackendServer.as_view(),
        {"inner": "Users", "callback": "update_role"},
    ),
    path(
        'api/upload_dataset',
        views.BackendServer.as_view(),
        {"inner": "Datasets", "callback": "post_dataset_one"},
    ),
    path(
        'api/update_dataset',
        views.BackendServer.as_view(),
        {"inner": "Datasets", "callback": "update_dataset_one"},
    ),
    re_path(
        r'^api/seq/names',
        views.BackendServer.as_view(),
        {"inner": "Genes", "callback": "get_seq_names"},
    ),
    path(
        'api/delete_dataset/<slug:dataset_id>',
        views.BackendServer.as_view(),
        {"inner": "Datasets", "callback": "delete_dataset_one"},
    ),
    path(
        'api/delete_dataset/<slug:dataset_id>',
        views.BackendServer.as_view(),
        {"inner": "Datasets", "callback": "delete_dataset_one"},
    ),
    path(
        'api/patients/<str:gene_id>/<slug:dataset_id>',
        views.BackendServer.as_view(),
        {
            "inner": "Patients",
            "callback": "get_patients_with_gene_from_dataset",
        },
    ),
    path(
        'api/patients_in_dataset/<slug:dataset_id>',
        views.BackendServer.as_view(),
        {"inner": "Patients", "callback": "get_patients_from_dataset"},
    ),
    path(
        'api/genes_in_dataset/<slug:dataset_id>',
        views.BackendServer.as_view(),
        {"inner": "Genes", "callback": "get_genes_from_dataset"},
    ),
    path(
        'api/update_many_patients',
        views.BackendServer.as_view(),
        {"inner": "Patients", "callback": "update_patients_many_list"},
    ),
    re_path(
        r'^api/edits_dataset_user/all',
        views.BackendServer.as_view(),
        {"inner": "Users", "callback": "get_edits_for_dataset"},
    ),
    path(
        'api/delete_edit_record',
        views.BackendServer.as_view(),
        {"inner": "Users", "callback": "delete_one_edit"},
    ),
    re_path(r".*", views.BackendServer.index, name='index'),
]
