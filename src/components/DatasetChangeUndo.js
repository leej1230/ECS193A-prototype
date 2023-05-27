import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {default as TableBootstrap} from 'react-bootstrap/Table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import { useAuth0 } from '@auth0/auth0-react';

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "./bootstrap_gene_page/css/sb-admin-2.min.css";

import {clone} from "ramda";

function DatasetChangeUndo(props){

    const [edit_records_list, set_edit_records_list] = useState([]);
    const [collapse_array, set_collapse_array] = useState([])

    const { user } = useAuth0();

    useEffect(() => {

        const update_edit_collapse = () => {
          let new_collapse_array = []
          for(let i = 0; i < edit_records_list.length; i++ ){
            new_collapse_array.push(false);
          }
          set_collapse_array(clone(new_collapse_array));
        }
    
        update_edit_collapse();
    
      }, [edit_records_list])
    
    useEffect(() => {
    const edit_recs_url = `${process.env.REACT_APP_BACKEND_URL}/api/edits_dataset_user/all`;

    axios.post(edit_recs_url, {
        // Data to be sent to the server
        dataset_id: parseInt(props.input_dataset_id),
        user_id: user.sub.split("|")[1]
    }, { 'content-type': 'application/json' }).then((result) => {
        //console.log("post has been sent");
        //console.log(response);

        console.log("get edits all: ")

        console.log(result.data)

        set_edit_records_list(result.data)
        
    });

    }, [props.input_data])

    const handleCollapseClick = (input_index) => {
        let cur_collapse_arr = collapse_array;
        cur_collapse_arr[input_index] = !(cur_collapse_arr[input_index])
    
        set_collapse_array(clone(cur_collapse_arr));
      }

    return(
        <div id="history_display_container">
                {props.input_displayHistoryTable ? 
                  <div >
                    <p>Edit History</p>
                    
                      {edit_records_list.length > 0 ? 
                        <ul id="history_results_list">
                          {edit_records_list.map((single_edit_record, index) => {
                            
                              return <div id="edit_display_result_single">
                                        <button class="btn btn-danger undo_btn"
                                          onClick={async () => {
                                            //console.log("undo button clicked");

                                            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/update_many_patients`, {
                                              // Data to be sent to the server
                                              patient_modify_list: clone(single_edit_record["old_values"]),
                                              dataset_id: parseInt(props.input_dataset_id),
                                              user_id: user.sub.split("|")[1]
                                            }, { 'content-type': 'application/json' }).then((response) => {
                                              //console.log("post has been sent");
                                              //console.log(response);

                                              alert("Data Changes Undone");
                                              
                                            });

                                            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/delete_edit_record`, {
                                              // Data to be sent to the server
                                              edit_record_id: parseInt(single_edit_record.id),
                                              dataset_id: parseInt(props.input_dataset_id),
                                              user_id: user.sub.split("|")[1]
                                            }, { 'content-type': 'application/json' }).then((response) => {
                                             

                                              alert("Edit Record Deleted");
                                              
                                            });

                                            //axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/delete_edit_record/${single_edit_record.id}`)

                                          }}>Undo Change</button>
                                        <p style={{fontWeight: 'bold'}}>Edit Record Id: { ("id" in single_edit_record) ? single_edit_record.id : "NA"}</p>
                                        <div id="last_row_box">
                                          { ("edit_date" in single_edit_record) ? <p id="edit_date_display">Edit Date: {single_edit_record.edit_date.substring(0,single_edit_record.edit_date.indexOf('T'))} &nbsp; &nbsp; &nbsp; Edit Time: {single_edit_record.edit_date.substring(single_edit_record.edit_date.indexOf('T') + 1, single_edit_record.edit_date.indexOf('.'))}</p> : <p id="edit_date_display">"N/A"</p>}
                                          <button className="btn btn-primary down_btn" onClick={() => {
                                            handleCollapseClick(index)
                                            //console.log("edit record info: ")
                                            //console.log(single_edit_record)
                                          }}>
                                            <FontAwesomeIcon icon={icon({name: 'caret-down', style: 'solid' })} />
                                          </button>
                                        </div>
                                        
                                        { collapse_array && collapse_array.length > index && collapse_array[index] == true ? 
                                          <div>
                                            { (single_edit_record && single_edit_record.edit_info && Object.keys(single_edit_record.edit_info).length > 0) ?
                                                <TableBootstrap striped bordered hover>
                                                  <thead>
                                                    <tr>
                                                      <th>Patient</th>
                                                      <th>Column Key</th>
                                                      <th>Old Value</th>
                                                      <th>Editted New Value</th>
                                                    </tr>
                                                  </thead>
                                                   
                                                  {Object.keys(single_edit_record.edit_info).map((patient_key, patient_key_index) => {
                                                    // each patient modified

                                                      return <tbody>
                                                            <tr >
                                                              <td style={{fontWeight: 'bold'}}>Patient: {patient_key}</td>
                                                              <td></td>
                                                              <td></td>
                                                              <td></td>
                                                            </tr>
                                                        
                                                            {Object.keys(single_edit_record["edit_info"][patient_key]).map((editted_patient_info_key, info_index ) => {
                                                                // info for that particular patient
                                                                return <tr>
                                                                        <td></td>
                                                                        <td>{editted_patient_info_key}</td>
                                                                        <td>{single_edit_record["old_values"][patient_key][editted_patient_info_key]}</td>
                                                                        <td>{single_edit_record["edit_info"][patient_key][editted_patient_info_key]}</td>
                                                                      </tr>
                                                              })}
                                                          
                                                      </tbody>
                                                    })}
                                                   
                                                </TableBootstrap> 
                                            : <p>No Edits</p>}
                                          </div>
                                          : <></>}
                                        <hr id="line_div_category_search_content" />
                                      </div>
                              
                            
                          })}
                        </ul> 
                        : 
                        <p>Empty History</p>}
                  </div>
                  :
                  <div id="no_history_display_content">
                    <p>----- Edit History Hidden -----</p>
                  </div>  }
              </div>
    )
}

export default DatasetChangeUndo;