# clean dataset in order to store information in the database

import pandas as pd
# import requests
import json
import numpy as np

class ParsedDataset : 
    def __init__(self, *args, **kwargs) : 
        self.__dict__.update(kwargs)
        # self.output_csv = out_csv_path
        # self.df = pd.read_csv(self.input_txt, sep="\t")
        self.df = pd.read_csv(self.in_txt)
        self.remove_duplicate_samples()
        self.remove_duplicate_columns()

        for rowIndex, row in self.df.iterrows():
            for columnIndex, value in self.df.items():
                try:
                    self.df.at[rowIndex, columnIndex] = float(self.df[columnIndex].loc[rowIndex])
                    print("row,col: ", (rowIndex, columnIndex))
                    print( self.df.loc[rowIndex, columnIndex] )
                except:
                    {}

        """
        print(self.description)
        print(self.url)
        print(self.rowType)
        print(self.geneCode)
        print(self.patientCode)
        def __init__(self, input_csv):
            self.df = pd.read_csv(input_csv, delimiter='\t')
        """


    def print_head(self) : 
        print(self.df.head())

    def write_to_csv(self) : 
        self.df.to_csv(self.output_csv)

    def remove_duplicate_samples(self) :
        col_list = self.df.columns.values
        if self.rowType == "gene":
            col_list = [cur_col_name for cur_col_name in col_list if str(self.df[cur_col_name].values[0])[0:len( self.geneCode )] == self.geneCode ]
        else:
            col_list = [cur_col_name for cur_col_name in col_list if str(self.df[cur_col_name].values[0])[0:len( self.patientCode )] == self.patientCode ]
        
        # take first column with the name/code info
        # maybe possible multiple columns with that name/code, for a given row: all col names starting with that code will be the same
        if len(col_list) > 0:
            self.df = self.df.drop_duplicates(subset=[col_list[0]])

    def remove_duplicate_columns(self) : 
        self.df = self.df.loc[:,~self.df.columns.duplicated()]

    def get_header(self):
        return list(self.df.columns)
    
    def get_column_values(self, columns):
        return self.df[columns].values.tolist()
    
    def get_column_starting_with(self, start_string):
        cols_list = self.df.columns.values
        for col_val in cols_list:
            if str(self.df[col_val].iloc[0]).lower().startswith(start_string.lower()):
                return col_val
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

    def get_gene_values_for_patient(self, input_index, gene_values_df):
        # format: patient rows in subset gene values df
        if len(gene_values_df) > input_index:
            # ok to access
            return json.loads(json.dumps({"arr": gene_values_df.iloc[:,input_index].tolist()}))
        return None

    def get_dataset_info(self):
        col_list = self.df.columns.values

        if self.rowType == "gene":
            gene_ids = self.get_all_genes_data()
            gene_ids_count = len(gene_ids)
            patient_ids = [patient_name for patient_name in self.df.columns.values if str(patient_name)[0:len( self.patientCode )] == self.patientCode]
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
                'rowType': self.rowType,
                'person_uploaded_dataset': self.person_uploaded_dataset
            }
            if type(temp_dataset['patient_ids']) == str:
                temp_dataset['patient_ids'] = json.loads(temp_dataset['patient_ids'])
            if type(temp_dataset['gene_ids']) == str:
                temp_dataset['gene_ids'] = json.loads(temp_dataset['gene_ids'])
            return temp_dataset
        else:
            gene_ids = [gene_id for gene_id in col_list if str(gene_id)[0:len( self.geneCode )] == self.geneCode ]
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
                'rowType': self.rowType,
                'person_uploaded_dataset': self.person_uploaded_dataset
            }
            if type(temp_dataset['patient_ids']) == str:
                temp_dataset['patient_ids'] = json.loads(temp_dataset['patient_ids'])
            if type(temp_dataset['gene_ids']) == str:
                temp_dataset['gene_ids'] = json.loads(temp_dataset['gene_ids'])
            return temp_dataset

    def get_genes(self, starting_counter):

        col_list = self.df.columns.values

        if self.rowType == "patient":
            gene_names = [gene_id for gene_id in col_list if str(gene_id)[0:len( self.geneCode )] == self.geneCode ]
            gene_values = self.df[gene_names].T
            patient_ids = [pid for pid in self.df[self.get_column_starting_with(self.patientCode)]]
            return [{
                "id": int(starting_counter + i),
                "name": str(gene_names[i]).upper(),
                "dataset_id": int(self.dataset_id),
                "patient_ids": json.loads(json.dumps({"arr": patient_ids})),
                "gene_values": json.loads(json.dumps({"arr": gene_values.iloc[i].tolist()}))
            } for i in range(len(gene_names))]
        else:
            gene_names = self.get_all_genes_data()

            patient_columns = [patient_name for patient_name in self.df.columns.values if str(patient_name)[0:len( self.patientCode )] == self.patientCode]
            columns_to_exclude = [self.get_column_starting_with(self.geneCode)] + patient_columns
            gene_values = self.df[patient_columns].T 


            result = []
            for i in range(len(gene_names)):
                data = {
                        "id": int(starting_counter + i),
                        "name": str(gene_names[i]).upper(),
                        "dataset_id": int(self.dataset_id),
                        "patient_ids": json.loads(json.dumps({"arr": patient_columns})),
                        "gene_values": self.get_gene_values_for_patient(i,gene_values) 
                        # traverse through all columes excepet the patient and gene columns
                    }
                
                # Traverse through all columns except the patient and gene columns
                for column in self.df.columns.values:
                    if column not in columns_to_exclude:
                        data[column] = str(self.df[column].iloc[i]).lower()
                        # detect numeric values
                        try:
                            data[column] = float(data[column])
                        except:
                            {}
                
                result.append(data)

            return result

    def get_patients(self):
        col_list = self.df.columns.values

        if self.rowType == "patient":
            gene_ids = [gene_id for gene_id in col_list if str(gene_id)[0:len( self.geneCode )] == self.geneCode ]
            dataset_id = self.dataset_id

            #gene_columns = [column for column in self.df.columns if column.startswith(self.geneCode)]
            columns_to_exclude = [self.get_column_starting_with(self.patientCode)] + gene_ids            

            result = []
            for i in range(self.df.shape[0]):
                data = {
                    'patient_id': str(self.df[self.get_column_starting_with(self.patientCode)].iloc[i]).upper(),
                    'gene_ids': gene_ids,
                    'dataset_id': int(dataset_id)
                }
                
                # Traverse through all columns except the patient and gene columns
                for column in self.df.columns.values:
                    if column not in columns_to_exclude:
                        data[column] = str(self.df[column].iloc[i]).lower()
                        # detect numeric values
                        try:
                            data[column] = float(data[column])
                        except:
                            {}
                
                result.append(data)

            return result

        else:
            patient_names = [patient_name for patient_name in self.df.columns.values if str(patient_name)[0:len( self.patientCode )] == self.patientCode]
            gene_ids = self.get_all_genes_data()
            gene_values = self.df[patient_names].T
            
            # if genes are columns, then patients not have any info related
            return [{
                "id": 1,
                "patient_id": str(patient_names[i]).upper(),
                "dataset_id": int(self.dataset_id),
                "gene_ids": json.loads(json.dumps({"arr": gene_ids})),
                "gene_values": json.loads(json.dumps({"arr": gene_values.iloc[i].tolist()}))
            } for i in range(len(patient_names))]
        
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

'''**{
                column: str(self.df[column].iloc[i]).lower()
                for column in self.df.columns
                if column not in columns_to_exclude
                }'''