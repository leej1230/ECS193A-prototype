import React, { useEffect, useState, useRef } from 'react';
import "./DatasetPage.css";
import { Box, Card , CardContent, CircularProgress, CardActions, Typography, Button, Table, TableRow, TableCell, TableContainer, TableBody, Paper, cardActionAreaClasses } from '@mui/material';

import { Link } from 'react-router-dom';
import axios from 'axios';
import Dataset from "./Dataset"

import ScrollBars from "react-custom-scrollbars";

import { json } from 'react-router-dom';

import Multiselect from "multiselect-react-dropdown";
import filterFactory, { FILTER_TYPES, customFilter, textFilter , numberFilter, Comparator} from 'react-bootstrap-table2-filter';
import { PropTypes } from 'prop-types'; 
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import {default as ReactSelectDropDown} from 'react-select';

//import { useTable } from "react-table";
import MaterialTable from 'material-table';

import { useNavigate } from 'react-router-dom';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import {clone} from "ramda";

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "./bootstrap_gene_page/css/sb-admin-2.min.css";

//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

//import FontAwesomeIcon from 'react-fontawesome'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

//import { Tab, Tabs, TabList, TabPanel,  ReactTabsFunctionComponent, TabProps } from 'react-tabs';
//import 'react-tabs/style/react-tabs.css';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: FilterList,
  FirstPage: FirstPage,
  LastPage: LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: Clear,
  Search: Search,
  SortArrow: ArrowUpward,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn
};

function clickMe() {
  alert("You clicked me!");
}

function ProductFilter(props) {
  const propTypes = {
    column: PropTypes.object.isRequired,
    onFilter: PropTypes.func.isRequired,
    optionsInput: PropTypes.object.isRequired
  }
  
  const filter = (selectedList, selectedItem) => {
    props.onFilter(
      selectedList.map(x => [x.value])
    );
  }

    return (
          <Multiselect options={props.optionsInput} 
            displayValue="label" 
            showCheckbox 
            closeOnSelect={false}
            onSelect={filter} 
            onRemove={filter}/>
        )

}

const selectCompare = [
  {value: 0, label: 'None'},
  {value: 1, label: '<'},
  {value: 2, label: '>'},
  {value: 3, label: '='},
  {value: 4, label: 'between'}
];

const selectOptions = [
  {value: "Yes", label: 'yes'},
  {value: "No", label: 'no'},
  {value: "unknown", label: 'Unknown'}
];


function DatasetPage() {
  const [dataset, setDataset] = useState({ "name": "None", "gene_ids": "0", "patient_ids": "0" });
  const [bookmarked, setBookmarked] = useState(false);
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
  const [gene_list_filtered , set_gene_list_filtered] = useState([{'id':0,'gene_id': "ENT"}]);
  const [gene_columns, setGene_columns] = useState([{
    dataField: 'id',
    text: ''
  },{
    dataField: 'gene_id',
    text: 'gene_id'
  }]);
  const [together_data_columns, set_together_data_columns] = useState([{
    dataField: 'id',
    text: ''
  },{
    dataField: 'gene_id',
    text: 'gene_id'
  }]);
  const columns = [
    { title: "Field Name", field: "field_name" },
    { title: "Value", field: "value" }
  ];

  const gene_list_node = useRef(null);
  const dataset_matrix_node = useRef(null);

  var bookmarkStyle = `${bookmarked ? "solid" : "regular"}`;

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
      
    })
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
    let copy_obj = clone( object_information);
    set_gene_list_filtered(copy_obj);
  }, [geneIds])

  useEffect(() => {
    setGene_columns(generateGeneTable(gene_information_expanded));
  }, [gene_information_expanded]);

  useEffect(() => {
    const edit_recs_url = `${process.env.REACT_APP_BACKEND_URL}/api/edits/all`;
    
    axios.get(edit_recs_url).then( async (result) => {
      await set_edit_records_list(result.data);
    })
  }, [DATASET_ID])

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

    console.log("combined information: ");
    console.log(patient_information);
    console.log(gene_with_value_information);
    
    for (let i = 0; i < patient_information.length; i++){
      let existing_patient_info = clone(patient_information[i]);

      let gene_patient_subset_values = {};

      for(let j = 0; j < gene_with_value_information.length; j++){

        let patient_index = gene_with_value_information[j]["patient_ids"]["arr"].indexOf(existing_patient_info["patient_id"])
        
        gene_patient_subset_values[gene_with_value_information[j]["name"]] = parseFloat( gene_with_value_information[j]["gene_values"]["arr"][patient_index] );
      }
      combined_dataset_full_information.push({ ...existing_patient_info, ...gene_patient_subset_values })
    }

    
    console.log( combined_dataset_full_information );

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

  const TextFuzzyFilter = (props) => {
    const [inputStr, setInputStr] =  useState("");

    const propTypes = {
      column: PropTypes.object.isRequired,
      onFilter: PropTypes.func.isRequired
    }

    const reset_list = () => {
      props.onFilter(
        {input_string_value: "", colName: props.column.dataField, reset: true}, gene_information_expanded
      )
    }
    
    const filter = () => {
      props.onFilter(
        {input_string_value: inputStr, colName: props.column.dataField, reset: false}, gene_information_expanded
      );
    }
  
      return (
            <div id="column_gene_search_input">
              <div class="input-group" >
                <div class="form-outline gene_input_txt">
                  <input type="text" id="form1" class="form-control" placeholder="text" data-cy="genelistinputbox" onChange={(e) => { setInputStr( e.target.value ) }} />
                </div>
                <button type="button"  onClick={() => {filter()}} class="btn btn-primary gene_search_btn">
                  <i id="gene_list_search" class="fas fa-search"></i>
                </button>
                <button
                    id="gene_list_reset"
                    onClick={() => {reset_list()}}
                  >Reset</button>
              </div>

            </div>
          )
      }
    
    const hasLevenshteinDistanceLessThanEqualOne = (current_input_str, str_reference) => {
      if( Math.abs(current_input_str.length - str_reference.length) > 1 ){
        // rand number more than 1 to be discarded when filtered
        return 5;
      }else if( Math.abs(current_input_str.length - str_reference.length) == 1 ){
        // distance is 1, make sure no other diff, or else not dist 1

        let larger_str = current_input_str;
        let smaller_str = str_reference;
        if(current_input_str.length < str_reference.length){
          larger_str = str_reference;
          smaller_str = current_input_str;
        }


        let num_errors = 0;
        let smaller_index = 0;
        let larger_index = 0;

        for( ; smaller_index < smaller_str.length && larger_index < larger_str.length; ){
          if( smaller_str[smaller_index] == larger_str[larger_index]  ){
            smaller_index++;
            larger_index++;
          } else if( (larger_index+1) < larger_str.length && smaller_str[smaller_index] == larger_str[larger_index+1] ){
            larger_index = larger_index+2;
            smaller_index++;
            num_errors++;
          } else {
            larger_index++;
            smaller_index++;
            num_errors++;
          }
        }

        
        return num_errors;

      } else {
        // equal length

        let num_errors = 0;
        let first_index = 0;
        let second_index = 0;

        for( ; first_index < current_input_str.length && second_index < str_reference.length; ){
          if( current_input_str[first_index] == str_reference[second_index]  ){
            first_index++;
            second_index++;
          } else {
            second_index++;
            first_index++;
            num_errors++;
          }
        }

      
        return num_errors;
      }
      
    }

    const filterFuzzyText = (filterVals, data) => {
      let input_str = filterVals['input_string_value']
      let colName = filterVals['colName']

      if( filterVals['reset'] == true ){
        return data;
      }

      // not exact match or exact off by 1: need to be ok with includes

      // also discarding decimal in search important
      let removed_decimal_input = input_str
      if( removed_decimal_input.includes(".") ){
        removed_decimal_input = removed_decimal_input.substring(0, removed_decimal_input.indexOf("."))
      }
      
      // equals filter
      let filtered_list_genes = data.filter( patient_one => (hasLevenshteinDistanceLessThanEqualOne(patient_one[colName] , input_str) <= 1) || (patient_one[colName].includes(input_str)) || (patient_one[colName].includes(removed_decimal_input)) ).sort(
        (patient_object_a, patient_object_b) => {
          return hasLevenshteinDistanceLessThanEqualOne(patient_object_a[colName] , input_str) - hasLevenshteinDistanceLessThanEqualOne(patient_object_b[colName] , input_str);
        }
      );

      return filtered_list_genes;
      
    }

  const NumberFilter = (props) => {
    const [compCode, setCompCode] =  useState(0);
    const [input1, setInput1] =  useState(0);
    const [input2, setInput2] =  useState(0);

    const propTypes = {
      column: PropTypes.object.isRequired,
      onFilter: PropTypes.func.isRequired
    }

    useEffect(() => {
      async function changedNumberComparison() {
        filter();
      }
  
      changedNumberComparison()
    }, [compCode , input1 , input2 ])
    
    const filter = () => {
      props.onFilter(
        {compareValCode: compCode, inputVal1: input1, inputVal2: input2, colName: props.column.dataField}, gene_information_expanded
      );
    }
  
      return (
            <div>
              <ReactSelectDropDown options={selectCompare} 
                displayValue="label" 
                showCheckbox 
                onChange={(e) => {setCompCode( e.value) } }
                closeOnSelect={false}
                />
  
              <input
                key="input"
                type="text"
                placeholder="Value (or Min if between)"
                onChange={(e) => { setInput1( e.target.value)}}
              />
              <input
                key="input"
                type="text"
                placeholder="(Max if between selected or not used)"
                onChange={(e) => { setInput2( e.target.value)}}
              />
            </div>
          )
  
      }

  const filterNumber = (filterVals, data) => {
    let compareValCode = filterVals['compareValCode']
    let inputVal1 = filterVals['inputVal1']
    let inputVal2 = filterVals['inputVal2']
    let colName = filterVals['colName']
    
    if(compareValCode == 0){
      // no filter
      return data;
    }
    else if(compareValCode == 1){
      // <
      return data.filter(patient_one => patient_one[colName] < inputVal1);
    } else if (compareValCode == 2){
      // >
      return data.filter(patient_one => patient_one[colName] > inputVal1);
    } else if (compareValCode == 3){
      // =
      return data.filter(patient_one => patient_one[colName] == inputVal1);
    } else if(compareValCode == 4){
      // Between
      return data.filter(patient_one => patient_one[colName] > inputVal1 && patient_one[colName] < inputVal2 );
    }

    
  }

  const geneListFilter = (gene_list_filter_value) => {
    console.log("node method");
    console.log(gene_list_filter_value)

    let text_search = gene_list_filter_value.gene_id.filterVal.input_string_value ;
    let column_search = gene_list_filter_value.gene_id.filterVal.colName;
    let reset_value = gene_list_filter_value.gene_id.filterVal.reset;

    if(reset_value == true){
      set_gene_list_filtered(clone(gene_information_expanded));
      return;
    }

    let search_results_genes = filterFuzzyText({input_string_value: text_search, colName: column_search, reset: false}, gene_information_expanded);

    set_gene_list_filtered(clone(search_results_genes));
  }

  const generateGeneObjs = (gene_ids_info) => {
    if(gene_ids_info == null || gene_ids_info.length == 0){
      return [{'id':0,'gene_id': "ENT"}];
    }

    console.log(gene_ids_info)

    let gene_objs = []

    for(let i = 0; i < gene_ids_info.length; i++){
      gene_objs.push({'id': i+1, 'gene_id': gene_ids_info[i]})
    }

    console.log("gene obj:")
    console.log(gene_objs)

    return gene_objs;
  }

  const generateGeneTable = (gene_objs_information) => {

    // 'id' not need options
    let gene_columns_list = []

    if(gene_objs_information == null || gene_objs_information.length == 0){
      return [{
        dataField: 'id',
        text: ''
      },{
        dataField: 'gene_id',
        text: 'gene_id'
      }];
    }

    let column_possibilities = ['gene_id']
    for(let i = 0; i < column_possibilities.length; i++){
      let unique = [...new Set(gene_objs_information.flatMap(item => item[ column_possibilities[i] ] ))];

      let select_options_col = []

      for(let j = 0; j < unique.length; j++){
        select_options_col.push({value: unique[j], label: unique[j]})
      }

      let col_obj = {dataField: column_possibilities[i],
        text: column_possibilities[i]}
      if(unique.length > 0 && Number.isInteger(unique[0])){
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
      else if(unique.length < 5){
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
          formatter: (cell, row, rowIndex, extraData) => {
            return(
              <span>
                <a id="gene_list_single_link" href={"/gene/"+ cell +"/1"}>{cell}</a>
              </span>
            );
          },
          formatExtraData: gene_list_filtered,
          filter: customFilter({
            delay: 1000,
            onFilter:filterFuzzyText
          }),
          filterRenderer: (onFilter, column) => {
            return(
              <TextFuzzyFilter onFilter={ onFilter } column={column} />
              )
          }
        }
      }
      gene_columns_list.push(col_obj)
    }
    console.log("gene info:");
    console.log(gene_columns_list);
    console.log(gene_information_expanded);
    return gene_columns_list;
  }

  const generateDatasetMatrixTable = () => {
    let columns_list = [];

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
    console.log("together column info:");
    console.log(columns_list);
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
        console.log("text")
        console.log(current_filter.filterVal)

        isFiltered = true
        matrix_filtered = matrix_filtered.filter(patient_one => patient_one[filter_columns[i]] == current_filter.filterVal)
      } else if(current_filter.filterType == "MULTISELECT"){
        console.log("multis")
        console.log(current_filter.filterVal)

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
    
      console.log("update matrix: ")

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
        let new_patient_update = {'dataset_id': parseInt(DATASET_ID)  };
        
        if(type_str == "int"){
          new_patient_update[data_field_key] = parseInt(String(stateChangeInfo["cellEdit"]["newValue"]));
        } else if(type_str == "float") {
          new_patient_update[data_field_key] = parseFloat(String(stateChangeInfo["cellEdit"]["newValue"]));
        } else {
          new_patient_update[data_field_key] = String(stateChangeInfo["cellEdit"]["newValue"]).toLowerCase();
        }

        copy_modified_patients_list[stateChangeInfo["cellEdit"]["rowId"]] = new_patient_update;

        // store old value
        let new_patient_save_old_info = {'dataset_id': parseInt(DATASET_ID)  };
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

      console.log(col_unique)

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


              <div id="dataset_name_holder">
                <h5  class="h5 text-gray-800">
                  <div id="text_title">
                    <div class="d-sm-inline-block" id="title_tage">Dataset:</div>
                    &nbsp;
                    <div class="d-sm-inline-block" id="title_content">{dataset["name"]}</div>
                    &nbsp;
                    &nbsp;
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary m-2 ml-auto d-sm-inline-block"
                      onClick={ async () => {
                        if(bookmarked == true){
                            await setBookmarked( false )
                        } else {
                            await setBookmarked( true )
                        }
                      }}
                    >
                      {bookmarked ? <FontAwesomeIcon icon={icon({name: 'bookmark', style: 'solid' })} /> : <FontAwesomeIcon icon={icon({name: 'bookmark', style: 'regular' })} /> }
                    
                    </button>
                    
                  </div>
                  <div>
                    <p class="d-sm-inline-block subtitle_tag" >Dataset ID:</p>
                    &nbsp;
                    <p class="d-sm-inline-block subtitle_content" >{DATASET_ID}</p>
                  </div>
                </h5>
              </div>

              <div class="container-fluid" id="tabs_container" >
                  <Tabs
                      defaultActiveKey="basic_info"
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab eventKey="basic_info" title="Basic Info">
                          <div  id="dataset_basics">
                          
                            <div class="card shadow dataset_info_block" >
                            
                              <div class="card-body">
                              
                                <div >
                                  <h5 class="dataset_subheader">Description </h5>
                                  <hr class="line_div_category_header_content" />
                                  <p class="dataset_subcontent">{dataset["description"]}</p>
                                </div>

                              
                              {datasetTableInputFormat.length>3 ? (
                                <div>
                                  {datasetTableInputFormat.map((table_property) => {

                                    if(table_property.field_name != 'id' && table_property.field_name != 'name' && table_property.field_name != 'description'){
                                      console.log("info dataset table objs: !!!: ")
                                      console.log(table_property)
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
                      </Tab>
                      <Tab eventKey="genes_list" title="Genes List">
                        <div class="row" id="dataset_table_and_stats_row">
                            <div class="card shadow" id="dataset_genes_list">
                              <div class="card-header py-3">
                                <h6 class="m-0 font-weight-bold text-primary">Gene Ids</h6>
                              </div>
                              <div class="card-body">
                                  <div class="row" id="table_options_outer">
                                      <div id="gene_table_area">
                                        <BootstrapTable keyField='id' ref={ n => gene_list_node.current = n  } remote={ { filter: true, pagination: false, sort: false, cellEdit: false } } data={ gene_list_filtered } columns={ gene_columns } filter={ filterFactory() } pagination={ paginationFactory() } filterPosition="top" onTableChange={ (type, newState) => { geneListFilter(gene_list_node.current.filterContext.currFilters) } } />
                                      </div>
                                  </div>
                              </div>
                            </div>
                          </div>
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
                                        console.log("can click button for saving edit changes from table");
                                        console.log(modified_patients_list_to_update_back);
                                        console.log("old info: ", prev_patients_list_to_undo);

                                        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/update_many_patients`, {
                                          // Data to be sent to the server
                                          patient_modify_list: clone(modified_patients_list_to_update_back),
                                          patient_save_undo_list: clone(prev_patients_list_to_undo)
                                        }, { 'content-type': 'application/json' }).then((response) => {
                                          console.log("post has been sent");
                                          console.log(response);

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
                            
                              return <li>
                                  <div class="card shadow edit_single_display">
                                    <div class="card-body">
                                      <button class="btn btn-primary undo_btn"
                                        onClick={async () => {
                                          console.log("undo button clicked");

                                          axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/update_many_patients`, {
                                            // Data to be sent to the server
                                            patient_modify_list: clone(single_edit_record["old_values"])
                                          }, { 'content-type': 'application/json' }).then((response) => {
                                            console.log("post has been sent");
                                            console.log(response);
  
                                            alert("Data Changes Undone");
                                            
                                          });

                                          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/delete_edit_record/${single_edit_record.id}`)

                                        }} >Undo Change</button>
                                      <p>id: { ("id" in single_edit_record) ? single_edit_record.id : "NA"}</p>
                                      <p>edit date: { ("edit_date" in single_edit_record) ? single_edit_record.edit_date : "NA"}</p>
                                      {Object.keys(single_edit_record.edit_info).map((patient_key, patient_key_index) => {
                                        // each patient modified
                                        
                                        return <div >
                                          <p>Patient: {patient_key}</p>
                                          {Object.keys(single_edit_record["edit_info"][patient_key]).map((editted_patient_info_key, info_index ) => {
                                            // info for that particular patient
                                            return <p class="patient_editted_display">{editted_patient_info_key} : OLD VAL : {single_edit_record["old_values"][patient_key][editted_patient_info_key]} NEW VAL: {single_edit_record["edit_info"][patient_key][editted_patient_info_key]}</p>
                                          })}
                                        </div>
                                          
                                      })}
                                    </div>
                                  </div>
                                </li>
                            
                          })}
                        </ul> 
                        : 
                        <p>empty list</p>}
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

  {/*<footer class="sticky-footer bg-white">
    <div class="container my-auto">
        <div class="copyright text-center my-auto">
            <span>Copyright &copy; Your Website 2021</span>
        </div>
    </div>
  </footer>*/}

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

/*
<div class="card shadow">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary">Dataset Stats</h6>
                        </div>
                        <div class="card-body">
                          <p>Number of Genes: </p>
                          <p>Number of Patients: </p>
                          <p>Number of Missing Cells: </p>
                        </div>
                    </div> 
*/

/*

<div class="col-lg-3" id="dataset_statistics">
       
                    <div class="card shadow">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary">Related Datasets</h6>
                        </div>
                        <div class="card-body">
                            <p>Dataset 1</p>
                            <p>Dataset 2</p>
                            <p>Dataset 3</p>
                        </div>
                    </div>
                  </div>

                  */
/*
<div class="card shadow" >
    <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Basic Dataset Information</h6>
    </div>
    <div class="card-body">
    {datasetTableInputFormat.length>3 ? (
      <div>
        {
          <MaterialTable columns={columns} 
          data={datasetTableInputFormat}
          icons={tableIcons}
          options={{
            paging: false,
            showTitle: false
          }}
          />
        }
      </div>
      ):(
        <div>
          <CircularProgress />
        </div>
      )
    }
    </div>
  </div>
*/

/*
<input
    key="input"
    type="text"
    placeholder="text"
    data-cy="genelistinputbox"
    onChange={(e) => { setInputStr( e.target.value ) }}
  />
  <button
    id="gene_list_search"
    onClick={() => {filter()}}
  >Search</button>
  <button
    id="gene_list_reset"
    onClick={() => {reset_list()}}
  >Reset</button>
      */