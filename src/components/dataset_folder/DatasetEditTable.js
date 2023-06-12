import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { clone } from "ramda";
import { useAuth0 } from '@auth0/auth0-react';
import filterFactory, { FILTER_TYPES, customFilter, textFilter, Comparator } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import StringFilter from '../filters/StringFilter';

import ProductFilter from '../filters/ProductFilter';
import NumberFilter from '../filters/NumberFilter';
import filterNumber from '../filters/filterNumber';

import {default as SelectDropDown} from "react-select";

import './DatasetEditTable.css'

const options_select = [{value: "text", label: "text"},{value: "number", label: "number"}];

function DatasetEditTable(props) {
  const [modified_objects_list_to_update_back, set_modified_objects_list_to_update_back] = useState({});
  const [prev_objects_list_to_undo, set_prev_objects_list_to_undo] = useState({});
  const [table_matrix_filtered, set_table_matrix_filtered] = useState([
    { patient_id: "", age: 0, diabete: "", final_diagnosis: "", gender: "", hypercholesterolemia: "", hypertension: "", race: "", ENSG: 3.2 }
  ]);
  const [together_data_columns, set_together_data_columns] = useState([{
    dataField: 'id',
    text: ''
  }, {
    dataField: 'gene_id',
    text: 'gene_id'
  }]);

  const [column_filter_types_arr, set_column_filter_types_arr] = useState({}); // { 'id': "text", 'age': "number" }
  const [ filter_types_states_arr , set_filter_types_states_arr ] = useState({}); // { 'id': {value: "text", label: "text"} }

  const { user } = useAuth0();
  const dataset_matrix_node = useRef(null);

  useEffect(() => {
    let together_data_columns_temp = generateDatasetMatrixTable();
    set_together_data_columns(clone(together_data_columns_temp));
  }, [column_filter_types_arr, filter_types_states_arr])

  const handleSelect = async (input_select_obj, input_col_name) => {
    let temp_var = clone(column_filter_types_arr);

    temp_var[input_col_name] = input_select_obj.value;
    
    set_column_filter_types_arr( temp_var );

    temp_var = clone(filter_types_states_arr);
    temp_var[input_col_name] = input_select_obj;
    set_filter_types_states_arr( temp_var )
  };

  useEffect(() => {
    const setup_table_filtered_initial = () => {
      set_table_matrix_filtered(clone(props.input_together_patient_gene_information));
    }

    // const inputPatientGeneInfo = props.input_together_patient_gene_information[0];

    setup_table_filtered_initial();
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [props.input_together_patient_gene_information])



  const generateDatasetMatrixTable = () => {
    let columns_list = [];

    if (props.input_together_patient_gene_information.length === 0) {
      return [
        { patient_id: "", age: 0, diabete: "", final_diagnosis: "", gender: "", hypercholesterolemia: "", hypertension: "", race: "", ENSG: 3.2 }
      ]
    }

    let column_possibilities = Object.keys(props.input_together_patient_gene_information[0]);

    let copy_column_filter_types_arr = clone(column_filter_types_arr);
    let copy_filter_types_states_arr = clone(filter_types_states_arr);

    /*if( copy_column_filter_types_arr.length !== column_possibilities.length ){
      // first loading of screen
      set_column_filter_types_arr(Array(column_possibilities.length).fill("text"));
      copy_column_filter_types_arr = Array(column_possibilities.length).fill("text")

      copy_filter_types_states_arr = []
      for(let temp_index = 0; temp_index < column_possibilities.length; temp_index++){
        copy_filter_types_states_arr.push({value: "text", label: "text"});
      }

      set_filter_types_states_arr(copy_filter_types_states_arr)

    }*/

    let have_modified_cols = false

    for (let i = 0; i < column_possibilities.length; i++) {

      let unique = [...new Set(props.input_together_patient_gene_information.flatMap(item => item[column_possibilities[i]]))];

      unique = unique.filter(x => x != "nan/na");

      let select_options_col = []

      for (let j = 0; j < unique.length; j++) {
        select_options_col.push({ value: unique[j], label: unique[j] })
      }

      let col_obj = {
        dataField: column_possibilities[i],
        text: column_possibilities[i]
      }


      if (props.input_together_patient_gene_information.length > 0) {
        let example_val = props.input_together_patient_gene_information[0][column_possibilities[i]]
        if (((typeof example_val === 'string' || example_val instanceof String) || (typeof example_val === 'number' && !isNaN(example_val))) && (column_possibilities[i] !== 'dataset_id')) {
          // only allow number and string types
          // dataset_id column not needed

          if( !(column_possibilities[i] in copy_column_filter_types_arr) ){
            // add column and column type
            copy_column_filter_types_arr[column_possibilities[i]] = "text"
            have_modified_cols = true
          }
    
          if( !(column_possibilities[i] in copy_filter_types_states_arr) ){
            // add column and column type
            copy_filter_types_states_arr[column_possibilities[i]] = {value: "text", label: "text"}
            have_modified_cols = true
          }

          if ( unique.length < 3 ) {
            col_obj = {
              dataField: column_possibilities[i],
              text: column_possibilities[i],
              headerStyle: { minWidth: '150px' },
              filter: customFilter({
                delay: 1000,
                type: FILTER_TYPES.MULTISELECT
              }),

              filterRenderer: (onFilter, column) => {
                return (
                  <>
                    <p className="float-center">Multiselect</p>
                    <ProductFilter onFilter={onFilter} column={column} optionsInput={clone(select_options_col)} />
                  </>
                )
              }
            }
          }
          else if( copy_column_filter_types_arr[column_possibilities[i]] == "number" ){
            col_obj = {
              dataField: column_possibilities[i],
              text: column_possibilities[i],
              headerStyle: { minWidth: '150px' },
              filter: customFilter({
                delay: 1000,
                onFilter: filterNumber,
                type: FILTER_TYPES.NUMBER
              }),
              filterRenderer: (onFilter, column) => {
                return (
                  <>
                    <SelectDropDown className="float-center"
                            options={options_select}
                            isLoading={!options_select}
                            closeMenuOnSelect={true}
                            onChange={(e) => {
                              //handleSelect(e, i);
                              handleSelect(e, column_possibilities[i]);
                              
                            }}
                            value={ copy_filter_types_states_arr[ column_possibilities[i] ] }
                            name={"filter_type"}
                          />
                    <br />
                    <NumberFilter onFilter={onFilter} column={column}  />
                  </>
                )
              }
            }
          }
           else {
            col_obj = {
              dataField: column_possibilities[i],
              text: column_possibilities[i],
              headerStyle: { minWidth: '150px' },
              filter: customFilter({
                delay: 1000,
                type: FILTER_TYPES.TEXT
              }),

              filterRenderer: (onFilter, column) => {
                return (
                  <>
                    <SelectDropDown className="float-center"
                            options={options_select}
                            isLoading={!options_select}
                            closeMenuOnSelect={true}
                            onChange={(e) => {
                              //handleSelect(e, i);
                              handleSelect(e, column_possibilities[i] );
                              
                            }}
                            value={copy_filter_types_states_arr[ column_possibilities[i] ]}
                            name={"filter_type"}
                          />
                    <br />
                    <StringFilter onFilter={onFilter} column={column} />
                  </>
                )
              }
            }
          }
          
          /*if (unique.length > 0 && typeof unique[0] === 'number') {
            col_obj = {
              dataField: column_possibilities[i],
              text: column_possibilities[i],
              headerStyle: { minWidth: '150px' },
              filter: customFilter({
                delay: 1000,
                onFilter: filterNumber,
                type: FILTER_TYPES.NUMBER
              }),
              filterRenderer: (onFilter, column) => {
                return (
                  <NumberFilter onFilter={onFilter} column={column} />
                )
              }
            }
          }
          else if (unique.length < 3) {
            col_obj = {
              dataField: column_possibilities[i],
              text: column_possibilities[i],
              headerStyle: { minWidth: '150px' },
              filter: customFilter({
                delay: 1000,
                type: FILTER_TYPES.MULTISELECT
              }),

              filterRenderer: (onFilter, column) => {
                return (
                  <ProductFilter onFilter={onFilter} column={column} optionsInput={clone(select_options_col)} />
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
          }*/


          columns_list.push(col_obj)
        }
      }
    }

    if( have_modified_cols ){
      set_column_filter_types_arr( copy_column_filter_types_arr )
      set_filter_types_states_arr( copy_filter_types_states_arr )
    }

    return columns_list;
  }

  useEffect(() => {
    const init_columns = async () => {
      let together_data_columns_temp = generateDatasetMatrixTable();
      set_together_data_columns(clone(together_data_columns_temp));
    }

    init_columns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table_matrix_filtered])

  const matrixFilter = (cur_filters) => {

    let filter_columns = Object.keys(cur_filters);

    let matrix_filtered = clone(props.input_together_patient_gene_information);
    let isFiltered = false;

    for (let i = 0; i < filter_columns.length; i++) {
      let current_filter = cur_filters[filter_columns[i]];

      if (current_filter.filterType === "NUMBER") {

        let first_num = current_filter.filterVal.inputVal1
        let second_num = current_filter.filterVal.inputVal2

        if (current_filter.filterVal.compareValCode === 1) {
          // <
          isFiltered = true
          matrix_filtered = matrix_filtered.filter(object_one => object_one[filter_columns[i]] < first_num)
        } else if (current_filter.filterVal.compareValCode === 2) {
          // >
          isFiltered = true
          matrix_filtered = matrix_filtered.filter(object_one => object_one[filter_columns[i]] > first_num)
        } else if (current_filter.filterVal.compareValCode === 3) {
          // =
          isFiltered = true
          matrix_filtered = matrix_filtered.filter(object_one => object_one[filter_columns[i]] === first_num)
        } else if (current_filter.filterVal.compareValCode === 4) {
          // between
          isFiltered = true
          matrix_filtered = matrix_filtered.filter(object_one => object_one[filter_columns[i]] > first_num && object_one[filter_columns[i]] < second_num)
        }

      } else if (current_filter.filterType === "TEXT") {
        //console.log("text")
        //console.log(current_filter.filterVal)

        isFiltered = true
        

        if ( current_filter.filterVal.compareValCode == 1 ){
          isFiltered = true
          matrix_filtered = matrix_filtered.filter(object_one => String(object_one[filter_columns[i]]) === String(current_filter.filterVal.inputVal1) );
        }
        
      } else if (current_filter.filterType === "MULTISELECT") {
        //console.log("multis")
        //console.log(current_filter.filterVal)

        // need to or through the filters selected for a column
        let mutliselect_filter_list = []
        isFiltered = true;

        for (let current_filter_index = 0; current_filter_index < current_filter.filterVal.length; current_filter_index++) {
          // each column: one value so will not overlap

          mutliselect_filter_list = mutliselect_filter_list.concat(matrix_filtered.filter(object_one => object_one[filter_columns[i]] === current_filter.filterVal[current_filter_index][0]))
        }

        // or the multiselect options and set to the patients filter
        matrix_filtered = mutliselect_filter_list;
      }
    }

    if (isFiltered === true) {

      set_table_matrix_filtered(clone(matrix_filtered))
    } else {
      set_table_matrix_filtered(clone(props.input_together_patient_gene_information))
    }

  }

  const updateCellEditMatrix = async (stateChangeInfo) => {

    console.log("updating of the cell result -> ");
    console.log( stateChangeInfo );

    let copy_matrix_filtered = table_matrix_filtered;
    let object_edited_index = -1
    if (props.row_type === "gene") {
      object_edited_index = copy_matrix_filtered.findIndex(element => element["name"] === stateChangeInfo["cellEdit"]["rowId"]);
    } else {
      object_edited_index = copy_matrix_filtered.findIndex(element => element["patient_id"] === stateChangeInfo["cellEdit"]["rowId"]);
    }

    let copy_modified_objects_list = modified_objects_list_to_update_back;

    let copy_prev_objects_undo_list = prev_objects_list_to_undo;

    let sample_val = String(stateChangeInfo["cellEdit"]["newValue"]).trim()
    let type_str = "str"

    if ( sample_val != "" && !isNaN( Number(sample_val) ) ) {
      // number
      if( Number.isInteger(Number(sample_val)) ){
        type_str = "int"
      } else {
        type_str = "float"
      }
    }

    if (!(stateChangeInfo["cellEdit"]["rowId"] in copy_modified_objects_list)) {

      let data_field_key = stateChangeInfo["cellEdit"]["dataField"]
      let new_object_update = {};

      if (type_str === "int") {
        new_object_update[data_field_key] = parseInt(String(stateChangeInfo["cellEdit"]["newValue"]));
      } else if (type_str === "float") {
        new_object_update[data_field_key] = parseFloat(String(stateChangeInfo["cellEdit"]["newValue"]));
      } else {
        new_object_update[data_field_key] = String(stateChangeInfo["cellEdit"]["newValue"]).toLowerCase();
      }

      copy_modified_objects_list[stateChangeInfo["cellEdit"]["rowId"]] = new_object_update;

      // store old value
      let new_object_save_old_info = {};
      if (type_str === "int") {
        new_object_save_old_info[data_field_key] = parseInt(String(table_matrix_filtered[object_edited_index][stateChangeInfo["cellEdit"]["dataField"]]));
      } else if (type_str === "float") {
        new_object_save_old_info[data_field_key] = parseFloat(String(table_matrix_filtered[object_edited_index][stateChangeInfo["cellEdit"]["dataField"]]));
      } else {
        new_object_save_old_info[data_field_key] = String(table_matrix_filtered[object_edited_index][stateChangeInfo["cellEdit"]["dataField"]]).toLowerCase();
      }
      copy_prev_objects_undo_list[stateChangeInfo["cellEdit"]["rowId"]] = new_object_save_old_info;

    } else {
      let existing_object_update_info = clone(copy_modified_objects_list[stateChangeInfo["cellEdit"]["rowId"]]);
      let data_field_key = stateChangeInfo["cellEdit"]["dataField"];

      if (type_str === "int") {
        existing_object_update_info[data_field_key] = parseInt(String(stateChangeInfo["cellEdit"]["newValue"]));
      } else if (type_str === "float") {
        existing_object_update_info[data_field_key] = parseFloat(String(stateChangeInfo["cellEdit"]["newValue"]));
      } else {
        existing_object_update_info[data_field_key] = String(stateChangeInfo["cellEdit"]["newValue"]).toLowerCase();
      }

      copy_modified_objects_list[stateChangeInfo["cellEdit"]["rowId"]] = existing_object_update_info;

      // store old value
      let existing_object_save_old_info = clone(copy_prev_objects_undo_list[stateChangeInfo["cellEdit"]["rowId"]]);
      if (type_str === "int") {
        existing_object_save_old_info[data_field_key] = parseInt(String(table_matrix_filtered[object_edited_index][stateChangeInfo["cellEdit"]["dataField"]]));
      } else if (type_str === "float") {
        existing_object_save_old_info[data_field_key] = parseFloat(String(table_matrix_filtered[object_edited_index][stateChangeInfo["cellEdit"]["dataField"]]));
      } else {
        existing_object_save_old_info[data_field_key] = String(table_matrix_filtered[object_edited_index][stateChangeInfo["cellEdit"]["dataField"]]).toLowerCase();
      }
      copy_prev_objects_undo_list[stateChangeInfo["cellEdit"]["rowId"]] = existing_object_save_old_info;
    }

    if (type_str === "int") {
      copy_matrix_filtered[object_edited_index][stateChangeInfo["cellEdit"]["dataField"]] = parseInt(String(stateChangeInfo["cellEdit"]["newValue"]));
    } else if (type_str === "float") {
      copy_matrix_filtered[object_edited_index][stateChangeInfo["cellEdit"]["dataField"]] = parseFloat(String(stateChangeInfo["cellEdit"]["newValue"]));
    } else {
      copy_matrix_filtered[object_edited_index][stateChangeInfo["cellEdit"]["dataField"]] = String(stateChangeInfo["cellEdit"]["newValue"]).toLowerCase();
    }

    await set_modified_objects_list_to_update_back(copy_modified_objects_list);

    await set_prev_objects_list_to_undo(copy_prev_objects_undo_list);

    await set_table_matrix_filtered(copy_matrix_filtered);
    await props.input_set_together_patient_gene_information(copy_matrix_filtered);

    // need to modify the column
    let column_obj_to_modify_index = together_data_columns.findIndex(column_element => column_element["dataField"] === stateChangeInfo["cellEdit"]["dataField"]);
    let column_obj_to_modify = clone(together_data_columns[column_obj_to_modify_index])

    // any type of the three -> see if can change: to or from multiselect to its own type
    // because of state -> possible to have or not updated by this time so consider rest of values and new one
    let map_col_values = props.input_together_patient_gene_information.flatMap(item => item[column_obj_to_modify["dataField"]]);
    map_col_values = map_col_values.slice(0, object_edited_index).concat(map_col_values.slice(object_edited_index + 1));
    let col_unique = [...new Set(map_col_values)];

    col_unique = col_unique.filter(x => x != "nan/na");

    let copy_together_cols = clone(together_data_columns);


    if (col_unique.includes(stateChangeInfo["cellEdit"]["newValue"]) === false) {
      if (type_str === 'number') {
        let converted_val = 0
        if (Number.isInteger()) {
          converted_val = parseInt(String(stateChangeInfo["cellEdit"]["newValue"]))
        } else {
          converted_val = parseFloat(String(stateChangeInfo["cellEdit"]["newValue"]))
        }

        if (col_unique.includes(converted_val) === false) {
          col_unique.push(converted_val)
        }


      } else {
        // string lowercase
        let converted_val = String(stateChangeInfo["cellEdit"]["newValue"]).toLowerCase();
        if (col_unique.includes(converted_val) === false) {
          col_unique.push(converted_val)
        }
      }

    }

    //console.log(col_unique)

    if (col_unique.length < 3) {

      let select_options_col = []

      for (let j = 0; j < col_unique.length; j++) {

        select_options_col.push({ value: col_unique[j] , label: col_unique[j] })
      }

      if(col_unique.length < 3){
        copy_together_cols[column_obj_to_modify_index] = {
          dataField: column_obj_to_modify["dataField"],
          text: column_obj_to_modify["dataField"],
          headerStyle: { minWidth: '150px' },
          filter: customFilter({
            delay: 1000,
            type: FILTER_TYPES.MULTISELECT
          }),

          filterRenderer: (onFilter, column) => {
            return (
              <>
                <p className="float-center">Multiselect</p>
                <ProductFilter onFilter={onFilter} column={column} optionsInput={clone(select_options_col)} />
              </>
            )
          }
        }
    } else if( column_filter_types_arr[stateChangeInfo["cellEdit"]["dataField"]] == "number" ){
      copy_together_cols[column_obj_to_modify_index] = {
        dataField: column_obj_to_modify["dataField"],
        text: column_obj_to_modify["dataField"],
        headerStyle: { minWidth: '150px' },
        filter: customFilter({
          delay: 1000,
          onFilter: filterNumber,
          type: FILTER_TYPES.NUMBER
        }),
        filterRenderer: (onFilter, column) => {
          return (
            <>
              <SelectDropDown className="float-center"
                      options={options_select}
                      isLoading={!options_select}
                      closeMenuOnSelect={true}
                      onChange={(e) => {
                        //handleSelect(e, i);
                        handleSelect(e, stateChangeInfo["cellEdit"]["dataField"]);
                        
                      }}
                      value={filter_types_states_arr[stateChangeInfo["cellEdit"]["dataField"]]}
                      name={"filter_type"}
                    />
              <br />
              <NumberFilter onFilter={onFilter} column={column}  />
            </>
          )
        }
      }
    }
     else {
      copy_together_cols[column_obj_to_modify_index] = {
        dataField: column_obj_to_modify["dataField"],
        text: column_obj_to_modify["dataField"],
        headerStyle: { minWidth: '150px' },
        filter: customFilter({
          delay: 1000,
          type: FILTER_TYPES.TEXT
        }),

        filterRenderer: (onFilter, column) => {
          return (
            <>
              <SelectDropDown className="float-center"
                      options={options_select}
                      isLoading={!options_select}
                      closeMenuOnSelect={true}
                      onChange={(e) => {
                        //handleSelect(e, i);
                        handleSelect(e, stateChangeInfo["cellEdit"]["dataField"] );
                      }}
                      value={filter_types_states_arr[stateChangeInfo["cellEdit"]["dataField"]]}
                      name={"filter_type"}
                    />
              <br />
              <StringFilter onFilter={onFilter} column={column} />
            </>
            )
          }
        }
      } 

      await set_together_data_columns(copy_together_cols);

    }
  }

  return (
    <div>
      <div id="dataset_view_table">
        <div class="row">
          <div class="col">
            <div class="card shadow">
              <div class="card-header py-3">
                <div id="table_edit_header">
                  <h5 class="m-0 font-weight-bold text-primary" id="table_edit_title">Dataset Matrix</h5>
                  <button class="btn btn-primary table_btn_content" onClick={async () => {
                    let new_val = !props.input_displayHistoryTable;
                    await props.input_set_displayHistoryTable(new_val);
                  }}>Toggle Show History and Undo</button>
                  <button class="btn btn-primary table_btn_content" onClick={async () => {

                    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/update_many_patients`, {
                      // Data to be sent to the server
                      modify_list: clone(modified_objects_list_to_update_back),
                      save_undo_list: clone(prev_objects_list_to_undo),
                      dataset_id: parseInt(props.input_dataset_id),
                      row_type_for_dataset: props.row_type,
                      user_id: user.sub.split("|")[1]
                    }, { 'content-type': 'application/json' }).then((response) => {
                      //console.log("post has been sent");
                      //console.log(response);

                      alert("Data Updated");
                      props.input_set_reload_history(true);

                    });

                    // each save is independent
                    set_prev_objects_list_to_undo({});
                    set_modified_objects_list_to_update_back({});

                    



                  }}>Save Changes</button>
                </div>
              </div>
              <div class="card-body" id="full_matrix_table">
                <BootstrapTable keyField={props.row_type === "gene" ? "name" : "patient_id"} data={table_matrix_filtered} columns={together_data_columns} filter={filterFactory()} pagination={paginationFactory()} ref={n => dataset_matrix_node.current = n} remote={{ filter: true, pagination: false, sort: false, cellEdit: true }} cellEdit={cellEditFactory({ mode: 'click' })} filterPosition="top" onTableChange={(type, newState) => {

                  if ('cellEdit' in newState) {
                    updateCellEditMatrix(newState);
                  } else {
                    matrixFilter(dataset_matrix_node.current.filterContext.currFilters);
                  }
                }} />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default DatasetEditTable;