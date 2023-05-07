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

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "./bootstrap_gene_page/css/sb-admin-2.min.css";

const data_dummy = [{'id': 1, 'first_name': "John", 'last_name':"Doe", 'age': 32, 'ice_cream_type': "vanilla"},
                    {'id': 1, 'first_name': "Mary", 'last_name':"May", 'age': 32, 'ice_cream_type': "vanilla"},
                    {'id': 1, 'first_name': "Jeff", 'last_name':"Johnson", 'age': 32, 'ice_cream_type': "vanilla"},
                    {'id': 1, 'first_name': "Carl", 'last_name':"Lee", 'age': 32, 'ice_cream_type': "vanilla"},
                    {'id': 1, 'first_name': "Teresa", 'last_name':"Djocovik", 'age': 32, 'ice_cream_type': "vanilla"}  ];
const data_dummy_cols = [{
                          dataField: 'id',
                          text: 'id',
                          filter: numberFilter(),
                          editor: {
                            type: Type.NUMBER
                          }
                        },
                        {
                          dataField: 'first_name',
                          text: 'first_name',
                          filter: textFilter(),
                          editor: {
                            type: Type.TEXTAREA
                          }
                        },
                        {
                          dataField: 'last_name',
                          text: 'last_name',
                          filter: textFilter(),
                          editor: {
                            type: Type.TEXTAREA
                          }
                        },
                        {
                          dataField: 'age',
                          text: 'age',
                          filter: numberFilter(),
                          editor: {
                            type: Type.NUMBER
                          }
                        },
                        {
                          dataField: 'ice_cream_type',
                          text: 'ice_cream_type',
                          filter: textFilter(),
                          editor: {
                            type: Type.TEXTAREA
                          }
                        }];

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
  const [DATASET_ID, setDATASET_ID] = useState(window.location.pathname.split("/").at(-1));
  const [datasetTableInputFormat, setDatasetTableInputFormat] = useState([]);
  const [geneIds, setGeneIds] = useState([]);
  const [patientIds, setPatientIds] = useState([]);
  const [patient_information, set_patient_information] = useState([
    {patient_id: ""},
    {age: 0},
    {diabete: ""},
    {final_diagnosis: ""},
    {gender: ""},
    {hypercholesterolemia: ""},
    {hypertension: ""},
    {race: ""},
    {id: 0}
  ]);
  const [gene_information_expanded, setGene_information_expanded] = useState([{'id':0,'gene_id': "ENT"}]);
  const [gene_list_filtered , set_gene_list_filtered] = useState([{'id':0,'gene_id': "ENT"}])
  const [gene_columns, setGene_columns] = useState([{
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
      console.log("get patients in the dataset");
      console.log(result.data);
    })
  }, [dataset])

  useEffect(() => {
    setDatasetTableInputFormat(createDatasetFormatted());
    setGeneIds(saveGeneIdArray());
    setPatientIds(savePatientIdArray());
  }, [dataset]);

  useEffect(() => {
    let object_information = generateGeneObjs(geneIds);
    setGene_information_expanded(object_information);
    set_gene_list_filtered(object_information);
  }, [geneIds])

  useEffect(() => {
    setGene_columns(generateGeneTable(gene_information_expanded));
  }, [gene_information_expanded])

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
    const [inputStr, setInputStr] =  useState(0);

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
            <div>
              <input
                key="input"
                type="text"
                placeholder="text"
                onChange={(e) => { setInputStr( e.target.value ) }}
              />
              <button
                onClick={() => {filter()}}
              >Search</button>
              <button
                onClick={() => {reset_list()}}
              >Reset</button>
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
      
      // equals filter
      let filtered_list_genes = data.filter( patient_one => hasLevenshteinDistanceLessThanEqualOne(patient_one[colName] , input_str) <= 1 ).sort(
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
    }, [compCode])
    
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
      set_gene_list_filtered(gene_information_expanded);
      return;
    }

    let search_results_genes = filterFuzzyText({input_string_value: text_search, colName: column_search, reset: false}, gene_information_expanded);

    set_gene_list_filtered(search_results_genes);
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
    var gene_columns_list = []

    if(gene_objs_information == null || gene_objs_information.length == 0){
      return [{
        dataField: 'id',
        text: ''
      },{
        dataField: 'gene_id',
        text: 'gene_id'
      }];
    }

    var column_possibilities = ['gene_id']
    for(let i = 0; i < column_possibilities.length; i++){
      var unique = [...new Set(gene_objs_information.flatMap(item => item[ column_possibilities[i] ] ))];

      let select_options_col = []

      for(let j = 0; j < unique.length; j++){
        select_options_col.push({value: unique[j], label: unique[j]})
      }

      var col_obj = {dataField: column_possibilities[i],
        text: column_possibilities[i]}
      if(unique.length > 0 && Number.isInteger(unique[0])){
        col_obj = {
          dataField: column_possibilities[i],
          text: column_possibilities[i],
          filter: customFilter({
            delay: 1000,
            onFilter:filterNumber
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
          filter: customFilter({
            delay: 1000,
            type: FILTER_TYPES.MULTISELECT
          }),
        
          filterRenderer: (onFilter, column) => {
            return(
              <ProductFilter onFilter={onFilter} column={column} optionsInput={JSON.parse(JSON.stringify(select_options_col))}/>
              )
          }
        }
      } else {
        col_obj = {
          dataField: column_possibilities[i],
          text: column_possibilities[i],
          formatter: (cell, row, rowIndex, extraData) => {
            return(
              <span>
                <a href={"/gene/"+ cell +"/1"}>{cell}</a>
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

  return (


    <body id="page-top">

  <div id="wrapper">

  <div id="content-wrapper" class="d-flex flex-column">


      <div id="content">

          <div class="container-fluid">

              <div class="d-sm-flex align-items-center justify-content-between mb-4 mt-5">
                  <h1 class="h1 mb-0 text-gray-800">
                    {dataset["name"]}
                  </h1>
                  <div>
                  <a href="/update/dataset" class="d-none d-sm-inline-block btn btn-sm btn btn-info shadow-sm mr-1"><i
                            class="fas fa-sm text-white-50"></i>Update</a>
                    <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-1"><i
                            class="fas fa-download fa-sm text-white-50"></i>Generate</a>
                    <button class="d-none d-sm-inline-block btn btn-sm btn btn-danger shadow-sm mr-1" onClick = {() => {
                            
                            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/delete_dataset/${DATASET_ID}`)
                       
                            navigate('/');

                          }} >
                          <i class="fas fa-sm text-white-50"></i>
                          Delete
                      </button>
                  </div>
              </div>

              <div class="row">

                <div class="col-xl-3 col-md-6 mb-4">
                  <div class="card shadow mb-4 border-left-primary">
                      <div class="card-body">
                          <div class="row no-gutters align-items-center">
                              <div class="col mr-2">
                                  <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Last Updated</div>
                                  <div class="text-xs mb-0 text-gray-800">01-03-2023</div>
                              </div>
                              <div class="col-auto">
                                  <i class="fas fa-calendar text-gray-300"></i>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>


                <div class="col-xl-8 col-lg-7">
                      <div class="card shadow mb-4">
                          <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                              <h5 class="m-0 font-weight-bold text-primary">Description</h5>
                          </div>
                          <div class="card-body">
                            <p>{dataset["description"]}</p> 
                          </div>
                      </div>
                  </div>
              </div>

              <div class="row">

                  <div class="col-xl-6 col-lg-5">

                    <div class="card shadow mb-4">
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
                  </div>

                  <div class="card shadow mb-4">
                  <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Dataset View</h6>
                  </div>
                  <div class="card-body">
                      <div class="row" id="table_options_outer">
                          <div id="gene_table_area">
                            <BootstrapTable keyField='id' ref={ n => gene_list_node.current = n  } remote={ { filter: true, pagination: false, sort: false, cellEdit: false } } data={ gene_list_filtered } columns={ gene_columns } filter={ filterFactory() } pagination={ paginationFactory() } filterPosition="top" onTableChange={ (type, newState) => { geneListFilter(gene_list_node.current.filterContext.currFilters) } } />
                          </div>
                        </div>
                  </div>
                </div>
           
                  <div class="col-lg-3 mb-4">
                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary">Dataset Stats</h6>
                        </div>
                        <div class="card-body">
                          <p>Number of Genes: </p>
                          <p>Number of Patients: </p>
                          <p>Number of Missing Cells: </p>
                        </div>
                    </div>
                 

             
                    <div class="card shadow mb-4">
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

              </div>

              <div class="row">
                  <div class="col">
                    <div class="card shadow mb-4">
                      <div class="card-header py-3">
                          <h6 class="m-0 font-weight-bold text-primary">Dataset Viewer</h6>
                      </div>
                      <div class="card-body">
                        <BootstrapTable keyField='id' data={ data_dummy } columns={ data_dummy_cols } filter={ filterFactory() } pagination={ paginationFactory() } cellEdit={ cellEditFactory({ mode: 'click' }) } filterPosition="top" />
                      </div>
                    </div>
                  </div>
              </div>

          </div> 

      </div>

    </div>

  </div>

  <footer class="sticky-footer bg-white">
  <div class="container my-auto">
      <div class="copyright text-center my-auto">
          <span>Copyright &copy; Your Website 2021</span>
      </div>
  </div>
  </footer>

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

{/*
{geneIds? (
                      <div>
                        {
                          geneIds.map( (id) =>
                          <li><a href={'/gene/' + id + '/1'}> {id} </a></li>
                          )
                        }
                      </div>
                      ):(
                        <div>
                          <CircularProgress />
                        </div>
                      )
                    }
*/}