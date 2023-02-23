# clean dataset in order to store information in the database

import pandas as pd
# import requests
# import json

class ParsedDataset : 
    def __init__(self, in_txt_path) : 
        self.input_txt = in_txt_path
        # self.output_csv = out_csv_path
        self.df = pd.read_csv(self.input_txt)
        # self.remove_duplicate_samples()
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

    def get_random_patient(self) :
        sample = self.df.sample()
        patient_id = list(sample["Sample name"])[0]
        gene_ids = list(sample.filter(regex="ENSG").columns)
        gene_values = sample.filter(regex="ENSG").to_numpy().tolist()[0]
        dataset_id = 1
        print(patient_id)
        return {
            'patient_id': patient_id,
            'gene_ids': gene_ids,
            'gene_values': gene_values,
            'dataset_id': dataset_id
        }
    
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
