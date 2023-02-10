# clean dataset in order to store information in the database

import numpy as np
import pandas as pd
import csv

class ParsedDataset : 
    # def __init__(self, in_txt_loc, out_csv_loc) :
    def __init__(self, in_txt_path, out_csv_path) : 
        self.input_txt = in_txt_path
        self.output_csv = out_csv_path
        self.df = pd.read_csv(self.input_txt, sep='\t')

    def print_head(self) : 
        print(self.df.head())

    def write_to_csv(self) : 
        self.df.to_csv(self.output_csv)

input_file = "sample_data/WB_Time_Course_filtered_normalized_counts.txt"
csv_file = "sample_data/sample_csv.csv"
ds = ParsedDataset(input_file, csv_file)
ds.print_head()
ds.write_to_csv()


# csv_file = "sample_data/sample_csv.csv"

# # need some button mechanism to send file to django backend --> some way to connect react frontend to django backend

# input_file = "sample_data/WB_Time_Course_filtered_normalized_counts.txt"
# csv_file = "sample_data/sample_csv.csv"

# in_txt =  csv.reader( open(input_file, "rt") , delimiter = '\t' )
# out_csv = csv.writer(open(csv_file, 'wt'))

# out_csv.writerows(in_txt)

# dataFrame = pd.read_csv(csv_file)
# # print( dataFrame.head() )

# # print("colum names")
# cols_list = list(dataFrame.columns)
# # print( cols_list[:20] )
# # print( "num columns: ", len(cols_list) )

# # print( "shape of data frame: " )
# # print( dataFrame.shape )

# # data cleaning process: look for rows that have duplicate patients
# # print( "unique number of names" )
# unique_names_number = pd.unique( dataFrame['Sample name'] ).shape 
# # print( unique_names_number )
# # print( "original number of names" )
# total_num_names = dataFrame['Sample name'].to_numpy().shape
# # print( total_num_names )

# # try to remove duplicate rows, just keep first one
# dataFrame.drop_duplicates( subset=['Sample name'] )
# # verify no changes
# # print( "unique number of names after drop duplicates" )
# unique_names_number = pd.unique( dataFrame['Sample name'] ).shape 
# # print( unique_names_number )
# # print( "original number of names after duplicates dropped" )
# total_num_names = dataFrame['Sample name'].to_numpy().shape
# # print( total_num_names )


# # look for duplicate column names (genes, especially)
# total_columns_number = len( cols_list )
# unique_num_columns = np.unique( np.array(cols_list) ).shape
# # print( "num columns: " )
# # print( total_columns_number )
# # print( "num unique columns: " )
# # print( unique_num_columns )

# # try to drop duplicate columns
# # source: https://sparkbyexamples.com/pandas/pandas-remove-duplicate-columns-from-dataframe/#:~:text=To%20drop%20duplicate%20columns%20from%20pandas%20DataFrame%20use%20df.,data%20regardless%20of%20column%20names.
# dataFrame = dataFrame.T.drop_duplicates().T
# total_columns_number = len( cols_list )
# unique_num_columns = np.unique( np.array(cols_list) ).shape
# # print( "num columns after dropping duplicates: " )
# # print( total_columns_number )
# # print( "num unique columns after dropping duplicates: " )
# # print( unique_num_columns )

# # try to make sure that Month or year info not in gene name, try to verify gene name, maybe with some API
# # could create custom verification API


# # save cleaned data frame to csv file
# dataFrame.to_csv( csv_file )

# # will all datasets have same format of columns and data types per column?
# # Is there some template?
# # What will the final size of the file be?
# # Will all genes start with ENSG?
# # What to do about duplicates, should only one be kept from each?
