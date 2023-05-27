import React, { useEffect, useState, useRef } from 'react';
import "./DatasetPage.css";

import axios from 'axios';

import {default as TableBootstrap} from 'react-bootstrap/Table';

import filterFactory, { FILTER_TYPES, customFilter, textFilter , Comparator} from 'react-bootstrap-table2-filter';
import { PropTypes } from 'prop-types'; 
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import {default as ReactSelectDropDown} from 'react-select';

import { useNavigate } from 'react-router-dom';

import {clone} from "ramda";

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "./bootstrap_gene_page/css/sb-admin-2.min.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { useAuth0 } from '@auth0/auth0-react';

import ProductFilter from './ProductFilter';
import NumberFilter from './NumberFilter';
import DatasetNameHolder from './DatasetNameHolder';
import DatasetBasicInfo from './DatasetBasicInfo';
import DatasetGenesListTable from './DatasetGenesListTable';
import filterNumber from './filterNumber';

function DatasetPage() {
  const [dataset, setDataset] = useState({ "name": "None", "gene_ids": "0", "patient_ids": "0" });
  const [displayHistoryTable, setDisplayHistoryTable] = useState(false);
  const [DATASET_ID, setDATASET_ID] = useState(window.location.pathname.split("/").at(-1));
  const [edit_records_list, set_edit_records_list] = useState([]);
  const [datasetTableInputFormat, setDatasetTableInputFormat] = useState([]);
  const [geneIds, setGeneIds] = useState([]);
  const [patientIds, setPatientIds] = useState([]);
  const [table_matrix_filtered, set_table_matrix_filtered] = useState([
    {patient_id: "", age: 0, diabete: "", final_diagnosis: "", gender: "", hypercholesterolemia: "", hypertension: "", race: "", ENSG: 3.2}
  ]);
  const [together_patient_gene_information, set_together_patient_gene_information] = useState([
    {patient_id: "", age: 0, diabete: "", final_diagnosis: "", gender: "", hypercholesterolemia: "", hypertension: "", race: "", ENSG: 3.2}
  ]);
  const [patient_information, set_patient_information] = useState([
    {patient_id: "", age: 0, diabete: "", final_diagnosis: "", gender: "", hypercholesterolemia: "", hypertension: "", race: ""}
  ]);
  const [gene_with_value_information, set_gene_with_value_information] = useState([
    {id: 1 , name: "", dataset_id: 0, patient_ids: {arr: []}, gene_values: {arr: []}}
  ]);
  const [modified_patients_list_to_update_back, set_modified_patients_list_to_update_back] = useState({});
  const [prev_patients_list_to_undo, set_prev_patients_list_to_undo] = useState({});
  const [gene_information_expanded, setGene_information_expanded] = useState([{'id':0,'gene_id': "ENT"}]);
  
  const [together_data_columns, set_together_data_columns] = useState([{
    dataField: 'id',
    text: ''
  },{
    dataField: 'gene_id',
    text: 'gene_id'
  }]);

  const [collapse_array, set_collapse_array] = useState([])

  const dataset_matrix_node = useRef(null);

  const { user } = useAuth0();

  useEffect(() => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/dataset/${DATASET_ID}`;
    axios.get(url).then((result) => {
      setDataset(result.data);
    });
  }, [DATASET_ID]);

  useEffect(() => {
    // get all patients of a dataset
    const patients_url = `${process.env.REACT_APP_BACKEND_URL}/api/patients_in_dataset/${DATASET_ID}`;
    // patient_information
    axios.get(patients_url).then((result) => {
      set_patient_information(result.data);
    });
  }, [dataset])

  useEffect(() => {
    const gene_full_url = `${process.env.REACT_APP_BACKEND_URL}/api/genes_in_dataset/${DATASET_ID}`;
    
    axios.get(gene_full_url).then((result) => {
      set_gene_with_value_information(result.data)
    })
  },  [patient_information])

  useEffect(() => {

    const setTogetherData = async () => {
      let combined_patients_gene_data = get_combined_patients_genes_data();
      await set_together_patient_gene_information(combined_patients_gene_data);
      // need to use "let" to make copy or else same object in both states will lead change in one to affect other
      let copy_obj =  clone(combined_patients_gene_data);
      await set_table_matrix_filtered(copy_obj);
      let together_data_columns = generateDatasetMatrixTable();
      await set_together_data_columns(clone(together_data_columns));
    }
    

    setTogetherData();

  }, [gene_with_value_information]);


  useEffect(() => {
    setDatasetTableInputFormat(createDatasetFormatted());
    setGeneIds(saveGeneIdArray());
    setPatientIds(savePatientIdArray());
  }, [dataset]);

  useEffect(() => {
    let object_information = generateGeneObjs(geneIds);
    setGene_information_expanded(object_information);
  }, [geneIds])

  useEffect(() => {
    const edit_recs_url = `${process.env.REACT_APP_BACKEND_URL}/api/edits_dataset_user/all`;

    axios.post(edit_recs_url, {
      // Data to be sent to the server
      dataset_id: parseInt(DATASET_ID),
      user_id: user.sub.split("|")[1]
    }, { 'content-type': 'application/json' }).then((result) => {
      //console.log("post has been sent");
      //console.log(response);

      console.log("get edits all: ")

      console.log(result.data)

      set_edit_records_list(result.data)
      
    });

  }, [DATASET_ID])

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

  const createDatasetFormatted = () => {
    // return dataset formatted for table
    const initArr = [];
    const dataInput = dataset;
    Object.keys(dataInput).forEach((key) => {
      if (key !== "gene_ids" && key !== "patient_ids") {
        const valInput = dataInput[key];
        if (key === "url") {
          initArr.push({
            field_name: key,
            value: (
              <a href={valInput} target="_blank" rel="noopener noreferrer">
                {" "}
                {valInput}{" "}
              </a>
            ),
          });
        } else {
          initArr.push({ field_name: key, value: valInput });
        }
      }
    });

    return initArr;
  };

  const get_combined_patients_genes_data = () => {
    let combined_dataset_full_information = []

    if(patient_information.length == 1 && patient_information[0]["patient_id"] == ""){
      // not set yet
      return [
        {patient_id: "", age: 0, diabete: "", final_diagnosis: "", gender: "", hypercholesterolemia: "", hypertension: "", race: "", ENSG: 3.2}
      ]
    }
    
    for (let i = 0; i < patient_information.length; i++){
      let existing_patient_info = clone(patient_information[i]);

      let gene_patient_subset_values = {};

      for(let j = 0; j < gene_with_value_information.length; j++){

        let patient_index = gene_with_value_information[j]["patient_ids"]["arr"].indexOf(existing_patient_info["patient_id"])
        
        gene_patient_subset_values[gene_with_value_information[j]["name"]] = parseFloat( gene_with_value_information[j]["gene_values"]["arr"][patient_index] );
      }
      combined_dataset_full_information.push({ ...existing_patient_info, ...gene_patient_subset_values })
    }

    return combined_dataset_full_information;
      
  }

  const saveGeneIdArray = () => {
    const dataInput = dataset;
    return dataInput["gene_ids"]["arr"];
  };

  const savePatientIdArray = () => {
    const dataInput = dataset;
    return dataInput["patient_ids"]["arr"];
  };

  const navigate = useNavigate();


  const generateGeneObjs = (gene_ids_info) => {
    if(gene_ids_info == null || gene_ids_info.length == 0){
      return [{'id':0,'gene_id': "ENT"}];
    }

    //console.log(gene_ids_info)

    let gene_objs = []

    for(let i = 0; i < gene_ids_info.length; i++){
      gene_objs.push({'id': i+1, 'gene_id': gene_ids_info[i]})
    }

    //console.log("gene obj:")
    //console.log(gene_objs)

    return gene_objs;
  }

  const generateDatasetMatrixTable = () => {
    let columns_list = [];

    if(together_patient_gene_information.length < 1){
      return [
        {patient_id: "", age: 0, diabete: "", final_diagnosis: "", gender: "", hypercholesterolemia: "", hypertension: "", race: "", ENSG: 3.2}
      ]
    }

    let column_possibilities = Object.keys(together_patient_gene_information[0]);

    for(let i = 0; i < column_possibilities.length; i++){
      let unique = [...new Set(together_patient_gene_information.flatMap(item => item[ column_possibilities[i] ] ))];

      let select_options_col = []

      for(let j = 0; j < unique.length; j++){
        select_options_col.push({value: unique[j], label: unique[j]})
      }

      let col_obj = {dataField: column_possibilities[i],
        text: column_possibilities[i]}


      if( together_patient_gene_information.length > 0){ 
        let example_val = together_patient_gene_information[0][ column_possibilities[i] ]
        if( ((typeof example_val === 'string' || example_val instanceof String) || (typeof example_val == 'number' && !isNaN(example_val))) && (column_possibilities[i] != 'dataset_id') ){
          // only allow number and string types
          // dataset_id column not needed

          if(unique.length > 0 && typeof unique[0] == 'number'){
            col_obj = {
              dataField: column_possibilities[i],
              text: column_possibilities[i],
              headerStyle: { minWidth: '150px' },
              filter: customFilter({
                delay: 1000,
                onFilter:filterNumber,
                type: FILTER_TYPES.NUMBER
              }),
              filterRenderer: (onFilter, column) => {
                return(
                  <NumberFilter onFilter={ onFilter } column={column} />
                  )
              }
            }
          }
          else if(unique.length < 3){
            col_obj = {
              dataField: column_possibilities[i],
              text: column_possibilities[i],
              headerStyle: { minWidth: '150px' },
              filter: customFilter({
                delay: 1000,
                type: FILTER_TYPES.MULTISELECT
              }),
            
              filterRenderer: (onFilter, column) => {
                return(
                  <ProductFilter onFilter={onFilter} column={column} optionsInput={clone(select_options_col)}/>
                  )
              }
            }
          } else {
            col_obj = {
              dataField: column_possibilities[i],
              text: column_possibilities[i],
              headerStyle: { minWidth: '150px' },
              filter: textFilter({
                comparator: Comparator.EQ
              })
            }
          }
          columns_list.push(col_obj)
        }
      }
    }
    //console.log("together column info:");
    //console.log(columns_list);
    return columns_list;
  }

  const matrixFilter = (cur_filters) => {

    let filter_columns = Object.keys(cur_filters);

    let matrix_filtered = clone(together_patient_gene_information);
    let isFiltered = false;

    for(let i = 0; i < filter_columns.length; i++){
      let current_filter = cur_filters[filter_columns[i]];

      if(current_filter.filterType == "NUMBER"){

        let first_num = current_filter.filterVal.inputVal1
        let second_num = current_filter.filterVal.inputVal2

        if(current_filter.filterVal.compareValCode == 1){
          // <
          isFiltered = true
          matrix_filtered = matrix_filtered.filter(patient_one => patient_one[filter_columns[i]] < first_num)
        } else if(current_filter.filterVal.compareValCode == 2){
          // >
          isFiltered = true
          matrix_filtered = matrix_filtered.filter(patient_one => patient_one[filter_columns[i]] > first_num)
        } else if(current_filter.filterVal.compareValCode == 3){
          // =
          isFiltered = true
          matrix_filtered = matrix_filtered.filter(patient_one => patient_one[filter_columns[i]] == first_num)
        } else if(current_filter.filterVal.compareValCode == 4){
          // between
          isFiltered = true
          matrix_filtered = matrix_filtered.filter(patient_one => patient_one[filter_columns[i]] > first_num && patient_one[filter_columns[i]] < second_num )
        }

      } else if (current_filter.filterType == "TEXT"){
        //console.log("text")
        //console.log(current_filter.filterVal)

        isFiltered = true
        matrix_filtered = matrix_filtered.filter(patient_one => patient_one[filter_columns[i]] == current_filter.filterVal)
      } else if(current_filter.filterType == "MULTISELECT"){
        //console.log("multis")
        //console.log(current_filter.filterVal)

        // need to or through the filters selected for a column
        let mutliselect_filter_list = []
        isFiltered = true;

        for(let current_filter_index = 0; current_filter_index < current_filter.filterVal.length; current_filter_index++){
          // each column: one value so will not overlap

          mutliselect_filter_list = mutliselect_filter_list.concat( matrix_filtered.filter(patient_one => patient_one[filter_columns[i]] == current_filter.filterVal[current_filter_index][0]) )
        }

        // or the multiselect options and set to the patients filter
        matrix_filtered = mutliselect_filter_list;
      }
    }

    if(isFiltered == true){
  
      set_table_matrix_filtered( clone(matrix_filtered) )
    } else {
      set_table_matrix_filtered( clone(together_patient_gene_information) )
    }

  }

  const updateCellEditMatrix = async (stateChangeInfo) => {
    
      //console.log("update matrix: ")

      let copy_matrix_filtered = table_matrix_filtered;
      let patient_edited_index = copy_matrix_filtered.findIndex(element => element["patient_id"] == stateChangeInfo["cellEdit"]["rowId"]);

      let copy_modified_patients_list = modified_patients_list_to_update_back;

      let copy_prev_patients_undo_list = prev_patients_list_to_undo;

      let sample_val = together_patient_gene_information[0][stateChangeInfo["cellEdit"]["dataField"]]
      let type_str = "str"


      if(Number.isInteger(sample_val)){
        type_str = "int"
      }else if(typeof sample_val == 'number'){
        type_str = "float"
      }

      if( !(stateChangeInfo["cellEdit"]["rowId"] in copy_modified_patients_list) ){
        
        let data_field_key = stateChangeInfo["cellEdit"]["dataField"]
        let new_patient_update = {  };
        
        if(type_str == "int"){
          new_patient_update[data_field_key] = parseInt(String(stateChangeInfo["cellEdit"]["newValue"]));
        } else if(type_str == "float") {
          new_patient_update[data_field_key] = parseFloat(String(stateChangeInfo["cellEdit"]["newValue"]));
        } else {
          new_patient_update[data_field_key] = String(stateChangeInfo["cellEdit"]["newValue"]).toLowerCase();
        }

        copy_modified_patients_list[stateChangeInfo["cellEdit"]["rowId"]] = new_patient_update;

        // store old value
        let new_patient_save_old_info = {  };
        if(type_str == "int"){
          new_patient_save_old_info[data_field_key] = parseInt(String(table_matrix_filtered[patient_edited_index][stateChangeInfo["cellEdit"]["dataField"]]));
        } else if(type_str == "float") {
          new_patient_save_old_info[data_field_key] = parseFloat(String(table_matrix_filtered[patient_edited_index][stateChangeInfo["cellEdit"]["dataField"]]));
        } else {
          new_patient_save_old_info[data_field_key] = String(table_matrix_filtered[patient_edited_index][stateChangeInfo["cellEdit"]["dataField"]]).toLowerCase();
        }
        copy_prev_patients_undo_list[stateChangeInfo["cellEdit"]["rowId"]] = new_patient_save_old_info;

      }else{
        let existing_patient_update_info = clone( copy_modified_patients_list[stateChangeInfo["cellEdit"]["rowId"]] );
        let data_field_key = stateChangeInfo["cellEdit"]["dataField"];

        if(type_str == "int"){
          existing_patient_update_info[data_field_key] = parseInt(String(stateChangeInfo["cellEdit"]["newValue"]));
        }else if(type_str == "float"){
          existing_patient_update_info[data_field_key] = parseFloat(String(stateChangeInfo["cellEdit"]["newValue"]));
        } else {
          existing_patient_update_info[data_field_key] = String(stateChangeInfo["cellEdit"]["newValue"]).toLowerCase();
        }

        copy_modified_patients_list[stateChangeInfo["cellEdit"]["rowId"]] = existing_patient_update_info;

        // store old value
        let existing_patient_save_old_info = clone( copy_prev_patients_undo_list[stateChangeInfo["cellEdit"]["rowId"]]);
        if(type_str == "int"){
          existing_patient_save_old_info[data_field_key] = parseInt(String(table_matrix_filtered[patient_edited_index][stateChangeInfo["cellEdit"]["dataField"]]));
        } else if(type_str == "float") {
          existing_patient_save_old_info[data_field_key] = parseFloat(String(table_matrix_filtered[patient_edited_index][stateChangeInfo["cellEdit"]["dataField"]]));
        } else {
          existing_patient_save_old_info[data_field_key] = String(table_matrix_filtered[patient_edited_index][stateChangeInfo["cellEdit"]["dataField"]]).toLowerCase();
        }
        copy_prev_patients_undo_list[stateChangeInfo["cellEdit"]["rowId"]] = existing_patient_save_old_info;
      }

      if(type_str == "int"){
        copy_matrix_filtered[patient_edited_index][stateChangeInfo["cellEdit"]["dataField"]] = parseInt(String(stateChangeInfo["cellEdit"]["newValue"]));
      }else if(type_str == "float"){
        copy_matrix_filtered[patient_edited_index][stateChangeInfo["cellEdit"]["dataField"]] = parseFloat(String(stateChangeInfo["cellEdit"]["newValue"]));
      } else {
        copy_matrix_filtered[patient_edited_index][stateChangeInfo["cellEdit"]["dataField"]] = String(stateChangeInfo["cellEdit"]["newValue"]).toLowerCase();
      }

      await set_modified_patients_list_to_update_back(copy_modified_patients_list);

      await set_prev_patients_list_to_undo(copy_prev_patients_undo_list);

      await set_table_matrix_filtered(copy_matrix_filtered);
      await set_together_patient_gene_information(copy_matrix_filtered);

      // need to modify the column
      let column_obj_to_modify_index = together_data_columns.findIndex(column_element => column_element["dataField"] == stateChangeInfo["cellEdit"]["dataField"]);
      let column_obj_to_modify = clone(together_data_columns[column_obj_to_modify_index])

      // any type of the three -> see if can change: to or from multiselect to its own type
      // because of state -> possible to have or not updated by this time so consider rest of values and new one
      let map_col_values = together_patient_gene_information.flatMap(item => item[ column_obj_to_modify["dataField"] ] );
      map_col_values = map_col_values.slice(0, patient_edited_index).concat(map_col_values.slice(patient_edited_index+1));
      let col_unique = [...new Set(map_col_values)];

      let copy_together_cols = clone(together_data_columns);


      if(col_unique.includes(stateChangeInfo["cellEdit"]["newValue"]) == false){
        if(typeof col_unique[0] == 'number'){
          let converted_val = 0
          if(Number.isInteger(col_unique[0])){
            converted_val = parseInt(String(stateChangeInfo["cellEdit"]["newValue"]))
          }else{
            converted_val = parseFloat(String(stateChangeInfo["cellEdit"]["newValue"]))
          }

          if(col_unique.includes(converted_val) == false){
            col_unique.push(converted_val)
          }

          
        }else {
          // string lowercase
          let converted_val = String(stateChangeInfo["cellEdit"]["newValue"]).toLowerCase();
          if(col_unique.includes(converted_val) == false){
            col_unique.push(converted_val)
          }
        }
        
      }

      //console.log(col_unique)

      if( col_unique.length < 3 ){

        let select_options_col = []

        for(let j = 0; j < col_unique.length; j++){
          
          select_options_col.push({value: col_unique[j], label: col_unique[j]})
        }

        copy_together_cols[column_obj_to_modify_index] = {
          dataField: column_obj_to_modify["dataField"],
          text: column_obj_to_modify["dataField"],
          headerStyle: { minWidth: '150px' },
          filter: customFilter({
            delay: 1000,
            type: FILTER_TYPES.MULTISELECT
          }),
        
          filterRenderer: (onFilter, column) => {
            return(
              <ProductFilter onFilter={onFilter} column={column} optionsInput={(select_options_col)}/>
              )
          }
        }
      } else if(typeof col_unique[0] == 'number'){
        copy_together_cols[column_obj_to_modify_index] = {
          dataField: column_obj_to_modify["dataField"],
          text: column_obj_to_modify["dataField"],
          headerStyle: { minWidth: '150px' },
          filter: customFilter({
            delay: 1000,
            onFilter:filterNumber,
            type: FILTER_TYPES.NUMBER
          }),
          filterRenderer: (onFilter, column) => {
            return(
              <NumberFilter onFilter={ onFilter } column={column} />
              )
          }
        }
      } else {
        copy_together_cols[column_obj_to_modify_index] = {
          dataField: column_obj_to_modify["dataField"],
          text: column_obj_to_modify["dataField"],
          headerStyle: { minWidth: '150px' },
          filter: textFilter({
            comparator: Comparator.EQ
          })
        }
      }

      await set_together_data_columns(copy_together_cols);



  }

  const handleCollapseClick = (input_index) => {
    let cur_collapse_arr = collapse_array;
    cur_collapse_arr[input_index] = !(cur_collapse_arr[input_index])

    set_collapse_array(clone(cur_collapse_arr));
  }

  return (

    <body id="page-top" >

      <div id="wrapper">

      <div id="content-wrapper" class="d-flex flex-column">


      <div id="content">

          <div class="container-fluid" id="dataset_full_page" >
              <div  id="control_buttons_dataset">
                  <div>
                    <a href="/update/dataset" class="d-none d-sm-inline-block btn btn-sm btn btn-info shadow-sm mr-1"><i
                              class="fas fa-sm text-white-50"></i>Update</a>
                      <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-1"><i
                              class="fas fa-download fa-sm text-white-50"></i>Generate</a>
                        <button class="d-none d-sm-inline-block btn btn-sm btn btn-danger shadow-sm mr-1" onClick = {() => {
                              
                              axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/delete_dataset/${DATASET_ID}`);
                        
                              navigate('/');

                            }} >
                            <i class="fas fa-sm text-white-50"></i>
                            Delete
                        </button>
                  </div>

              </div>

              <DatasetNameHolder input_dataset_id={DATASET_ID} input_dataset={dataset} />

              <div class="container-fluid" id="tabs_container" >
                  <Tabs
                      defaultActiveKey="basic_info"
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab eventKey="basic_info" title="Basic Info">
                          <DatasetBasicInfo input_datasetTableInputFormat={datasetTableInputFormat} input_dataset={dataset}/>
                      </Tab>
                      <Tab eventKey="genes_list" title="Genes List">
                        <DatasetGenesListTable input_expanded_gene_info={gene_information_expanded} />
                      </Tab>
                      <Tab eventKey="edit_dataset" title="Edit Dataset">
                        <div id="dataset_view_table"></div>
                          <div class="row">
                              <div class="col">
                                <div class="card shadow">
                                  <div class="card-header py-3">
                                    <div id="table_edit_header">
                                      <h5 class="m-0 font-weight-bold text-primary" id="table_edit_title">Dataset Matrix</h5>
                                      <button class="btn btn-primary table_btn_content"  onClick={async () => {
                                        let new_val = !displayHistoryTable;
                                        await setDisplayHistoryTable(new_val);
                                      }}>Toggle Show History and Undo</button>
                                      <button class="btn btn-primary table_btn_content"  onClick={async () => {
                                        //console.log("can click button for saving edit changes from table");
                                        //console.log(modified_patients_list_to_update_back);
                                        //console.log("old info: ", prev_patients_list_to_undo);

                                        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/update_many_patients`, {
                                          // Data to be sent to the server
                                          patient_modify_list: clone(modified_patients_list_to_update_back),
                                          patient_save_undo_list: clone(prev_patients_list_to_undo),
                                          dataset_id: parseInt(DATASET_ID),
                                          user_id: user.sub.split("|")[1]
                                        }, { 'content-type': 'application/json' }).then((response) => {
                                          //console.log("post has been sent");
                                          //console.log(response);

                                          alert("Data Updated");
                                          
                                        });

                                        // each save is independent
                                        await set_prev_patients_list_to_undo({});
                                        await set_modified_patients_list_to_update_back({});
                                        
                                      }}>Save Changes</button>
                                    </div>
                                  </div>
                                  <div class="card-body" id="full_matrix_table">
                                    <BootstrapTable keyField='patient_id' data={ table_matrix_filtered } columns={ together_data_columns } filter={ filterFactory() } pagination={ paginationFactory() } ref={ n => dataset_matrix_node.current = n  } remote={ { filter: true, pagination: false, sort: false, cellEdit: true } } cellEdit={ cellEditFactory({ mode: 'click' }) } filterPosition="top" onTableChange={ (type, newState) => { 
                                      if( 'cellEdit' in newState){
                                        updateCellEditMatrix(newState);
                                      } else{
                                        matrixFilter(dataset_matrix_node.current.filterContext.currFilters);
                                      }
                                    } } />
                                  </div>
                                </div>
                              </div>
                        </div>
                      </Tab>
                    </Tabs>
              </div>

              <div id="history_display_container">
                {displayHistoryTable ? 
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
                                              dataset_id: parseInt(DATASET_ID),
                                              user_id: user.sub.split("|")[1]
                                            }, { 'content-type': 'application/json' }).then((response) => {
                                              //console.log("post has been sent");
                                              //console.log(response);

                                              alert("Data Changes Undone");
                                              
                                            });

                                            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/delete_edit_record`, {
                                              // Data to be sent to the server
                                              edit_record_id: parseInt(single_edit_record.id),
                                              dataset_id: parseInt(DATASET_ID),
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

          </div> 

      </div>

    </div>

  </div>

  <script src="./bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
  <script src="./bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <script src="./bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>

  <script src="./bootstrap_gene_page/js/sb-admin-2.min.js"></script>

  <script src="./bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>

  <script src="./bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
  <script src="./bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>

  </body>

  )
}

export default DatasetPage;
