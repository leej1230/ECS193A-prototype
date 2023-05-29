# clean dataset in order to store information in the database

import pandas as pd
# import requests
import json

class ParsedDataset : 
    def __init__(self, *args, **kwargs) : 
        self.__dict__.update(kwargs)
        # self.output_csv = out_csv_path
        # self.df = pd.read_csv(self.input_txt, sep="\t")
        self.df = pd.read_csv(self.in_txt)
        self.remove_duplicate_samples()
        self.remove_duplicate_columns()

        """
        print(self.description)
        print(self.url)
        print(self.rowType)
        print(self.geneCode)
        print(self.patientCode)
        """


    def print_head(self) : 
        print(self.df.head())

    def write_to_csv(self) : 
        self.df.to_csv(self.output_csv)

    def remove_duplicate_samples(self) :
        self.df = self.df.drop_duplicates(subset=["Sample name"])

    def remove_duplicate_columns(self) : 
        self.df = self.df.loc[:,~self.df.columns.duplicated()]

    def get_header(self):
        return list(self.df.columns)
    
    def get_column_values(self, columns):
        return self.df[columns].values.tolist()
    
    def get_column_starting_with(self, start_string):
        for column in self.df.columns:
            if str(self.df[column].iloc[0]).lower().startswith(start_string.lower()):
                return column
        return None
    
    def get_all_genes_data(self):
        column_name = self.get_column_starting_with(self.geneCode)
        if column_name is None:
            return []
        return self.get_column_values(column_name)
    
    def get_all_patients_data(self):
        column_name = self.get_column_starting_with(self.patientCode)
        if column_name is None:
            return []
        return self.get_column_values(column_name)

    def get_patient_data(self, patient_id) :
        return self.df.loc[self.df[self.get_column_starting_with(self.patientCode)] == patient_id]
    
    def get_patient_gene_data(self, patient_id) : 
        return self.get_patient_data(patient_id).filter(regex = self.geneCode + "|" + self.get_column_starting_with(self.patientCode))
    
    
    def insert_patients_into_db(self) : 
        pass

    def get_dataset_info(self):
        if self.rowType == "gene":
            gene_ids = [gene_id for gene_id in self.df.columns.to_list() if self.geneCode in gene_id]
            gene_ids_count = len(gene_ids)
            temp_dataset = {
                'id': int(self.dataset_id),
                'name': str(self.name).lower(),
                'description': str(self.description).lower(),
                'gene_ids': json.dumps({'arr': gene_ids}),
                'gene_id_count': int(gene_ids_count),
                'date_created': self.date_created,
                'url': self.url,
            }
            if type(temp_dataset['gene_ids']) == str:
                temp_dataset['gene_ids'] = json.loads(temp_dataset['gene_ids'])
        else:
            gene_ids = [gene_id for gene_id in self.df.columns.to_list() if self.geneCode in gene_id]
            gene_ids_count = len(gene_ids)
            patient_ids = [patient_id for patient_id in self.df[self.get_column_starting_with(self.patientCode)].values]
            patient_ids_count = len(patient_ids)
            temp_dataset = {
                'id': int(self.dataset_id),
                'name': str(self.name).lower(),
                'description': str(self.description).lower(),
                'gene_ids': json.dumps({'arr': gene_ids}),
                'patient_ids': json.dumps({'arr': patient_ids}),
                'gene_id_count': int(gene_ids_count),
                'patient_id_count': int(patient_ids_count),
                'date_created': self.date_created,
                'url': self.url,
            }
            if type(temp_dataset['patient_ids']) == str:
                temp_dataset['patient_ids'] = json.loads(temp_dataset['patient_ids'])
            if type(temp_dataset['gene_ids']) == str:
                temp_dataset['gene_ids'] = json.loads(temp_dataset['gene_ids'])
        return json.dumps(temp_dataset, indent=10)

    def get_genes(self):
        if self.rowType == "patient":
            gene_names = [gene_names for gene_names in self.df.columns if self.geneCode in gene_names]
            gene_values = self.df[gene_names].T
            patient_ids = [pid for pid in self.df[self.get_column_starting_with(self.patientCode)]]
            return [{
                "id": 1,
                "name": str(gene_names[i]).upper(),
                #"dataset_id": int(self.dataset_id),
                "patient_ids": json.loads(json.dumps({"arr": patient_ids})),
                "gene_values": json.loads(json.dumps({"arr": gene_values.iloc[i].tolist()}))
            } for i in range(len(gene_names))]
        else:
            gene_names = self.get_all_genes_data()
            gene_values = self.df.loc[:, self.df.columns != self.get_column_starting_with(self.geneCode)]
            return [{
                "id": 1,
                "name": str(gene_names[i]).upper(),
                #"dataset_id": int(self.dataset_id),
                "gene_values": json.loads(json.dumps({"arr": gene_values.iloc[i].tolist()}))
            } for i in range(len(gene_names))]

    def get_patients(self) :
        if self.rowType == "patient":
            gene_ids = [gene_id for gene_id in self.df.columns.to_list() if self.geneCode in gene_id]
            #dataset_id = self.dataset_id

            print("in parsed dataset")

            return [{
                'patient_id': str(self.df[self.get_column_starting_with(self.patientCode)].iloc[i]).upper(),
                'age': int(self.df["Age At Onset"].iloc[i]),
                'diabete': str(self.df['Diabetes'].iloc[i]).lower(),
                'final_diagnosis': str(self.df['Final Diagnosis'].iloc[i]).lower(),
                'gender': str(self.df['Gender'].iloc[i]).lower(),
                'hypercholesterolemia': str(self.df['Hypercholesterolemia'].iloc[i]).lower(),
                'hypertension': str(self.df['Hypertension'].iloc[i]).lower(),
                'race': str(self.df['Race'].iloc[i]).lower(),
                'gene_ids': gene_ids,
                #'dataset_id': int(dataset_id)
            } for i in range(self.df.shape[0])]
        else:
            return None
        
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
