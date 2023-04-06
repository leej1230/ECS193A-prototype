# clean dataset in order to store information in the database

import pandas as pd
# import requests
import json

class ParsedDataset : 
    def __init__(self, in_txt_path, name, description, date_created, url, dataset_id) : 
        self.input_txt = in_txt_path
        self.name = name
        self.description = description
        self.date_created = date_created
        self.url = url
        self.dataset_id = dataset_id
        # self.output_csv = out_csv_path
        # self.df = pd.read_csv(self.input_txt, sep="\t")
        self.df = pd.read_csv(self.input_txt)
        self.remove_duplicate_samples()
        self.remove_duplicate_columns()

    def print_head(self) : 
        print(self.df.head())

    def write_to_csv(self) : 
        self.df.to_csv(self.output_csv)

    def remove_duplicate_samples(self) :
        self.df = self.df.drop_duplicates(subset=["Sample name"])

    def remove_duplicate_columns(self) : 
        self.df = self.df.T.drop_duplicates().T

    def get_patient_data(self, patient_id) :
        return self.df.loc[self.df["Sample name"] == patient_id]
    
    def get_patient_gene_data(self, patient_id) : 
        return self.get_patient_data(patient_id).filter(regex="ENSG*|Sample name")
    
    def insert_patients_into_db(self) : 
        pass

    def get_dataset_info(self) :
        gene_ids = [gene_id for gene_id in self.df.columns.to_list() if "ENSG" in gene_id]
        gene_ids_count = len(gene_ids)
        patient_ids = [patient_id for patient_id in self.df["Sample name"].values]
        patient_ids_count = len(patient_ids)
        return {
            'name': self.name,
            'description': self.description,
            'gene_ids': json.dumps({'arr': gene_ids}),
            'patient_ids': json.dumps({'arr': patient_ids}),
            'gene_id_count': gene_ids_count,
            'patient_id_count': patient_ids_count,
            'date_created': self.date_created,
            'url': self.url,
        }

    def get_genes(self) :
        gene_names = [gene_names for gene_names in self.df.columns if "ENSG" in gene_names]
        gene_values = self.df[gene_names].T
        patient_ids = [pid for pid in self.df["Sample name"]]
        return [{
            "id": 1,
            "name": gene_names[i],
            "dataset_id": self.dataset_id,
            "patient_ids": json.dumps({"arr": patient_ids}),
            "gene_values": json.dumps({"arr": gene_values.iloc[i].tolist()})
            # "gene_values": gene_values[j]
        } for i in range(len(gene_names))]

    def get_patients(self) :
        gene_ids = list(self.df.filter(regex="ENSG").columns)
        dataset_id = 1

        return [{
            'patient_id': self.df["Sample name"].iloc[i],
            'age': self.df["Age At Onset"].iloc[i],
            'diabete': self.df['Diabetes'].iloc[i],
            'final_diagnosis': self.df['Final Diagnosis'].iloc[i],
            'gender': self.df['Gender'].iloc[i],
            'hypercholesterolemia': self.df['Hypercholesterolemia'].iloc[i],
            'hypertension': self.df['Hypertension'].iloc[i],
            'race': self.df['Race'].iloc[i],
            'gene_ids': gene_ids,
            'dataset_id': dataset_id
        } for i in range(self.df.shape[0])]
        
        # print(a)
        # import os
        # import sys

        # log_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'log.txt')
        # print('--------')
        # print(log_path)
        # with open(log_path, 'w+') as f:
        #     sys.stdout = f
        #     print(a)
    
# input_file = "sample_data/WB_Time_Course_filtered_normalized_counts.txt"
# # csv_file = "sample_data/sample_csv.csv"
# ds = ParsedDataset(input_file)
# sample = ds.get_random_patient()
# pass

# import requests
# url = "http://127.0.0.1:8000/api/patientpost"
# df = ParsedDataset(input_file, csv_file).get_patient_data("UCDSS-1000")
# patient_id = list(df["Sample name"])
# gene_ids = list(df.filter(regex="ENSG*").columns)
# gene_values = df.filter(regex="ENSG*").to_numpy().tolist()[0]
# dataset_id = 1

# patient_data = {
#     'patient_id': patient_id,
#     'gene_ids': gene_ids,
#     'gene_values': gene_values,
#     'dataset_id': dataset_id
# }
# requests.post(url, json=patient_data)

# ds.print_head()
# ds.write_to_csv()

# # need some button mechanism to send file to django backend --> some way to connect react frontend to django backend

# # try to make sure that Month or year info not in gene name, try to verify gene name, maybe with some API
# # could create custom verification API

# # will all datasets have same format of columns and data types per column?
# # Is there some template?
# # What will the final size of the file be?
# # Will all genes start with ENSG?
# # What to do about duplicates, should only one be kept from each?
