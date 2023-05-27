import React from 'react';

import { CircularProgress } from '@mui/material';

import './DatasetBasicInfo.css'

function DatasetBasicInfo(props){
    return(
        <div >        
            <div class="card shadow dataset_info_block" >
            
                <div class="card-body">
                
                <div >
                    <h5 class="dataset_subheader">Description </h5>
                    <hr class="line_div_category_header_content" />
                    <p class="dataset_subcontent">{props.input_dataset["description"]}</p>
                </div>

                
                {props.input_datasetTableInputFormat.length > 3 ? (
                <div>
                    {props.input_datasetTableInputFormat.map((table_property) => {

                    if(table_property.field_name != 'id' && table_property.field_name != 'name' && table_property.field_name != 'description'){
                        //console.log("info dataset table objs: !!!: ")
                        //console.log(table_property)
                        return(<div >
                        <h5 class="dataset_subheader">{table_property.field_name} </h5>
                        <hr class="line_div_category_header_content" />
                        <p class="dataset_subcontent">{table_property.value}</p>
                        </div>)
                    }
                    })}
                </div>
                ):(
                    <div>
                    <CircularProgress />
                    </div>
                )
                }
                </div>
            </div>
            
            </div>
    )
}

export default DatasetBasicInfo
