# clean dataset in order to store information in the database

import pandas as pd

class ParsedDataset : 
    def __init__(self, in_txt_path, out_csv_path) : 
        self.input_txt = in_txt_path
        self.output_csv = out_csv_path
        self.df = pd.read_csv(self.input_txt, sep='\t')
        self.df.remove_duplicate_samples()
        self.df.remove_duplicate_columns()

    def print_head(self) : 
        print(self.df.head())

    def write_to_csv(self) : 
        self.df.to_csv(self.output_csv)

    def remove_duplicate_samples(self) :
        self.df = self.df.drop_duplicates(subset=["Sample name"])

    def remove_duplicate_columns(self) : 
        self.df = self.df.T.drop_duplicates().T

        
input_file = "sample_data/WB_Time_Course_filtered_normalized_counts.txt"
csv_file = "sample_data/sample_csv.csv"
ds = ParsedDataset(input_file, csv_file)
ds.print_head()
ds.write_to_csv()

# # need some button mechanism to send file to django backend --> some way to connect react frontend to django backend

# # try to make sure that Month or year info not in gene name, try to verify gene name, maybe with some API
# # could create custom verification API

# # will all datasets have same format of columns and data types per column?
# # Is there some template?
# # What will the final size of the file be?
# # Will all genes start with ENSG?
# # What to do about duplicates, should only one be kept from each?
