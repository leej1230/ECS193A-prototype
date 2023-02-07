# clean dataset in order to store information in the database

import numpy as np
import pandas as pd
import csv

# need some button mechanism to send file to django backend --> some way to connect react frontend to django backend

input_file = "../../sample_data/WB_Time_Course_filtered_normalized_counts.txt"
csv_file = "../../sample_data/sample_csv.csv"

in_txt =  csv.reader( open(input_file, "rt") , delimiter = '\t' )
out_csv = csv.writer(open(csv_file, 'wt'))

out_csv.writerows(in_txt)

dataFrame = pd.read_csv(csv_file)
print( dataFrame.head() )

print("colum names")
cols_list = list(dataFrame.columns)
print( cols_list[:20] )
print( "num columns: ", len(cols_list) )

# data cleaning process: look for rows that have duplicate patients


# look for duplicate column names (genes, especially)


# try to make sure that Month or year info not in gene name, try to verify gene name, maybe with some API
# could create custom verification API

# will all datasets have same format of columns and data types per column?
# Is there some template?
# What will the final size of the file be?
# Will all genes start with ENSG?
