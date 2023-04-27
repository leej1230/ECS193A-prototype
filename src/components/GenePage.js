import React, {useEffect,useState} from 'react';
import axios from 'axios';
import { Box, Card , CardContent, CardActions, Typography, CircularProgress, Button, Paper } from '@mui/material';
import "./GenePage.css";

import SampleGraph from './echartdemo';

//import { useTable } from "react-table";
import MaterialTable from 'material-table';

import ScrollBars from "react-custom-scrollbars";

import { flushSync } from 'react-dom';

import Multiselect from "multiselect-react-dropdown";
import filterFactory, { FILTER_TYPES, customFilter, textFilter , numberFilter, Comparator} from 'react-bootstrap-table2-filter';
import { PropTypes } from 'prop-types'; 
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import {default as ReactSelectDropDown} from 'react-select';

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

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

import { color } from 'echarts';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select  from '@mui/material/Select';

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "./bootstrap_gene_page/css/sb-admin-2.min.css"

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

const SAMPLE_ID = window.location.pathname.split("/").at(-1)

const columns = [ 
  {title: "Field Name" , field: "field_name"},
  {title: "Value" , field: "value"}
]
const SAMPLE_NAME = window.location.pathname.split("/").at(-2)
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/gene/${SAMPLE_NAME}/${SAMPLE_ID}`

const options =[{ 'title':"Animals", "cont_arr": ["fish", "horse", "turtle"]}, {'title':"Colors", "cont_arr":["Red", "Blue", "Green", "Yellow"]}, { 'title':"Places", "cont_arr": ["US", "Burma", "Latvia","US", "Burma", "Latvia"]}]

function createGeneFormatted( input_patient_data_arr) {
    // return formatted for table
    var init_arr = [];
    var data_input = input_patient_data_arr;
    data_input.forEach(function(key) {
      var val_input = "empty"
      init_arr.push( {field_name: key , value: val_input } )
    });

    //console.log( init_arr )

    return init_arr;
}

function breakUpCode(code_str){
  var list_str_code = []
  for(var i = 0; i < code_str.length; i += 5){
    var temp_str = "";
    if(i + 5 < code_str.length){
      temp_str = code_str.substring(i, i+5);
    } else {
      temp_str = code_str.substring(i, code_str.length);
    }
    list_str_code.push(temp_str);
  }

  return list_str_code;
}

function getColor(index_group){
  if(index_group % 4 == 0){
    // purple shade
    return '#f2a2f5'
  } else if (index_group % 4 == 1){
    // red shade
    return '#f56464';
  } else if( index_group % 4 == 2){
    // green shade
    return '#9ff595';
  } else {
    // blue shade
    return '#84a8f0';
  }
}

function GenePage() {
  // state = {samples: []}
  const [gene_data, setGene_data] =  useState();
  const [gene_external_data , setGeneExternalData] = useState({description: ""})
  const [ gene_table_input_format , set_gene_table_input_format ] = useState([{field_name : "" , value : ""}]);
  const [ patient_table_data, set_patient_table_data ] = useState([
    {patient_id: ""},
    {age: ""},
    {diabete: ""},
    {final_diagnosis: ""},
    {gender: ""},
    {hypercholesterolemia: ""},
    {hypertension: ""},
    {race: ""}
  ]);
  const [ patient_information_expanded, set_patient_information_expanded ] = useState([
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
  const [ dataset_info , set_dataset_info ] = useState({name : "" , patient_ids : {'arr':null}});
  const [ gene_code_info , set_gene_code_info ] = useState({code : ["mrna"]});
  const [graphType, setGraphType] = useState('bar');
  const [graph_table_filter_data, set_graph_table_filter_data] = useState();
  const [graph_table_node, set_graph_table_node] = useState();
  const [patient_columns, set_patient_columns] = useState([{
    dataField: 'id',
    text: ''
  }, {
    dataField: 'patient_id',
    text: 'Patient ID'
  },{
    dataField: 'age',
    text: 'Age'
  },{
    dataField: 'diabete',
    text: 'Diabetes'
  },{
    dataField: 'final_diagnosis',
    text: 'Final Diagnosis'
  },{
    dataField: 'gender',
    text: 'Gender'
  },{
    dataField: 'hypercholesterolemia',
    text: 'Hypercholesterolemia',
    filter: customFilter({
      delay: 1000,
      type: FILTER_TYPES.MULTISELECT
    }),
  
    filterRenderer: (onFilter, column) => {
      return(
        <ProductFilter onFilter={onFilter} column={column} optionsInput={selectOptions}/>
        )
    }
  },{
    dataField: 'hypertension',
    text: 'Hypertension',
    filter: customFilter({
      delay: 1000,
      type: FILTER_TYPES.MULTISELECT
    }),
  
    filterRenderer: (onFilter, column) => {
      return(
        <ProductFilter onFilter={onFilter} column={column} optionsInput={selectOptions}/>
        )
    }
  },{
    dataField: 'race',
    text: 'Race'
  }]);

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
        {compareValCode: compCode, inputVal1: input1, inputVal2: input2, colName: props.column.dataField}, patient_information_expanded
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
      
      console.log(data.filter(patient_one => patient_one[colName] < inputVal1));
      return data.filter(patient_one => patient_one[colName] < inputVal1);
    } else if (compareValCode == 2){
      // >
      console.log(data.filter(patient_one => patient_one[colName] > inputVal1));
      return data.filter(patient_one => patient_one[colName] > inputVal1);
    } else if (compareValCode == 3){
      // =
      console.log(data.filter(patient_one => patient_one[colName] == inputVal1));
      return data.filter(patient_one => patient_one[colName] == inputVal1);
    } else if(compareValCode == 4){
      // Between
      console.log(data.filter(patient_one => patient_one[colName] > inputVal1 && patient_one[colName] < inputVal2 ));
      return data.filter(patient_one => patient_one[colName] > inputVal1 && patient_one[colName] < inputVal2 );
    }

    
  }

  const generatePatientTable = (patients_info) => {
    if(patients_info == null){
      return;
    }

    for(let i = 0; i < patients_info.length; i++){
      var cur_patient = patients_info[i]
      // patient has no id, so this is fine
      cur_patient['id'] = i+1
    }

    // 'id' not need options
    var patient_columns_list = []

    var column_possibilities = ['patient_id', 'age', 'diabete', 'final_diagnosis', 'gender', 'hypercholesterolemia', 'hypertension', 'race']
    for(let i = 0; i < column_possibilities.length; i++){
      var unique = [...new Set(patients_info.flatMap(item => item[ column_possibilities[i] ] ))];

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
          filter: textFilter({
            comparator: Comparator.EQ
          })
        }
      }
      patient_columns_list.push(col_obj)
    }

    console.log(patient_columns_list);
    set_patient_columns(patient_columns_list);
  
    return patients_info;
  }

  // componentDidMount() {
  useEffect( () => {
    async function fetchGeneData() {
      //await console.log(URL);
      const res = await axios.get(URL);
      const gene_ext = await axios.get(`http://rest.ensembl.org/lookup/id/ENSG00000157764?expand=1;content-type=application/json`);
      setGeneExternalData(gene_ext.data);
      setGene_data(res.data);
      set_graph_table_filter_data(res.data);

      console.log("fetch gene function: ")
      console.log(gene_data);
      
      //set_patient_table_input_format( createPatientFormatted(patient_data) );
      // .then(res => {
      // })
      //console.log( patient_data['patient_id'] );
    }

    

    fetchGeneData();
    
    
  } , []);

  useEffect(() => {
    async function fetchPatientsData() {
      const patientsDataAPIURL = `${process.env.REACT_APP_BACKEND_URL}/api/patients/${SAMPLE_NAME}/${gene_data.dataset_id}`
      console.log(patientsDataAPIURL)
      const res = await axios.get(patientsDataAPIURL);
      console.log("line 172")
      console.log(res.data)
      set_patient_table_data(generatePatientTable(res.data));
      //set_patient_table_input_format( createPatientFormatted(patient_data) );
      // .then(res => {
      // })
      //console.log( patient_data['patient_id'] );
    }

    fetchPatientsData()
  }, [gene_data])

  useEffect(() => {
    set_patient_information_expanded(generatePatientTable(patient_table_data));
  }, [patient_table_data])

  useEffect( () => {
    // this side effect runs if gene data changes, so that dataset info for the gene can be updated
    async function fetchDatasetInfo() {
      const dataset_data = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dataset/${gene_data.dataset_id}`);
      set_dataset_info(dataset_data.data);
      if (dataset_data.data.patient_ids['arr'] != null) {
        set_gene_table_input_format(createGeneFormatted([dataset_info.patient_ids['arr']]));
      }

      console.log("dataset function")

    }
    fetchDatasetInfo()
 } , [gene_data] );

 useEffect( () => {
  async function fetchSeqName(){
    
    const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/seq/names`);
    console.log(resp);
    console.log("seq names");
    var data_code = resp.data;
    if( data_code.code.length > 1 ){
      // remove 'mrna' initial
      data_code.code = data_code.code.slice(1, data_code.code.length);
      // remove blanks at end
      while( data_code.code.length > 1 && data_code.code[data_code.code.length - 1] == ""){
        data_code.code.pop();
      }
    }
    set_gene_code_info( data_code );
    console.log(data_code);
  }
  fetchSeqName()
 } , [] );

  const graphDataFilter = (cur_filters) => {
    // filterType: "TEXT"
    // filterType: "NUMBER"
    // filterType: "MULTISELECT"

    let filter_columns = Object.keys(cur_filters);
    for(let i = 0; i < filter_columns.length; i++){
      let current_filter = cur_filters[filter_columns[i]];
      if(current_filter.filterType == "NUMBER"){
        console.log("num")
        console.log(current_filter.filterVal)
      } else if (current_filter.filterType == "TEXT"){
        console.log("text")
        console.log(current_filter.filterVal)
      } else if(current_filter.filterType == "MULTISELECT"){
        console.log("multis")
        console.log(current_filter.filterVal)
      }
    }
  }

  return (
    <body id="page-top">

      <div id="wrapper">

      <div id="content-wrapper" class="d-flex flex-column">


          <div id="content">

              <div class="container-fluid">

                  <div class="d-sm-flex align-items-center justify-content-between mb-4 mt-5">
                      <h1 class="h3 mb-0 text-gray-800">
                        {gene_data?(
                          <div>
                            <p className='gene_name'>{gene_data.name}</p>
                          </div>
                        ):(
                          <div>
                            <CircularProgress />
                          </div>
                        )}
                      </h1>
                      <div>
                        <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-1"><i
                                class="fas fa-download fa-sm text-white-50"></i>Generate Report</a>
                        <a href="#" class="d-none d-sm-inline-block btn btn-sm btn btn-danger shadow-sm mr-1"><i
                                class="fas fa-sm text-white-50"></i>Delete</a>
                      </div>
                  </div>

                  <div class="row">

                      <div class="col-xl-4 col-lg-5">
                          <div class="card shadow mb-4">
                              <div
                                  class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                  <h6 class="m-0 font-weight-bold text-primary">Gene Information</h6>
                                  <div class="dropdown no-arrow">
                                      <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                          <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                      </a>
                                      <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                          aria-labelledby="dropdownMenuLink">
                                          <div class="dropdown-header">Dropdown Header:</div>
                                          <a class="dropdown-item" href="#">Action</a>
                                          <a class="dropdown-item" href="#">Another action</a>
                                          <div class="dropdown-divider"></div>
                                          <a class="dropdown-item" href="#">Something else here</a>
                                      </div>
                                  </div>
                              </div>
                              <div class="card-body">
                                  {gene_data?(
                                    <div>
                                      <p>ID: {gene_data.id}</p>
                                      <br />
                                      <p>Description: {gene_external_data.description}</p>
                                      <br />
                                      <p>Dataset ID: {gene_data.dataset_id}</p>
                                      <br />
                                      <a href={"/dataset/" + gene_data.dataset_id} >Link to Dataset</a>
                                    </div>
                                  ):(
                                    <div>
                                      <CircularProgress />
                                    </div>
                                  )}
                                  
                              </div>
                          </div>
                      </div>

                      <div class="col-xl-8 col-lg-7">
                          <div class="card shadow mb-4">
                              <div
                                  class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                  <h6 class="m-0 font-weight-bold text-primary">Data Graph</h6>
                                  <div class="dropdown no-arrow">
                                      <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                          <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                      </a>
                                      <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                          aria-labelledby="dropdownMenuLink">
                                          <div class="dropdown-header">Dropdown Header:</div>
                                          <a class="dropdown-item" href="#">Action</a>
                                          <a class="dropdown-item" href="#">Another action</a>
                                          <div class="dropdown-divider"></div>
                                          <a class="dropdown-item" href="#">Something else here</a>
                                      </div>
                                  </div>
                              </div>
                              <div class="card-body">
                                  
                                {graph_table_filter_data?(
                                  <div>
                                    <SampleGraph categories={graph_table_filter_data.patient_ids["arr"]} data={graph_table_filter_data.gene_values["arr"]} type={graphType} />
                                    <div className='GraphType'>
                                      <FormControl margin='dense' fullWidth>
                                        <InputLabel id="GraphTypeLabel">Graph Type</InputLabel>
                                        <Select
                                          labelId="GraphTypeLabel"
                                          id="GraphTypeSelect"
                                          value={graphType}
                                          label="GraphType"
                                          onChange={(e)=>{setGraphType(e.target.value)}}
                                          >
                                          <MenuItem value={'bar'}>Bar</MenuItem>
                                          <MenuItem value={'line'}>Basic Line</MenuItem>
                                          <MenuItem value={'pie'}>Pie</MenuItem>
                                        </Select>
                                      </FormControl>
                                    </div>
                                  </div>
                                ):(
                                  <div>
                                    <CircularProgress />
                                  </div>
                                )}
                                
                              </div>
                              <div id='graph_filter'>
                                <BootstrapTable keyField='id' ref={ n => set_graph_table_node( n ) } remote={ { filter: true, pagination: false, sort: false, cellEdit: false } } data={ [] } columns={ patient_columns } filter={ filterFactory() } filterPosition="top" onTableChange={ (type, newState) => { graphDataFilter(graph_table_node.filterContext.currFilters) } } />
                              </div>
                          </div>
                      </div>

                      
                  </div>

                        <div class="card shadow mb-4">
                            <div class="card-header py-3">
                                <h6 class="m-0 font-weight-bold text-primary">Patient List</h6>
                            </div>

                            <div class="row" id="table_options_outer">
                              <div id="patient_table_area">
                                <BootstrapTable keyField='id' data={ patient_information_expanded } columns={ patient_columns } filter={ filterFactory() } pagination={ paginationFactory() } filterPosition="top" />
                              </div>
                            </div>
                      </div>


                  <div class="row">

                    <div class="col-xl mb-4">

                      
                        <div class="card shadow mb-4">
                            <div class="card-header py-3">
                                <h6 class="m-0 font-weight-bold text-primary">Stats</h6>
                            </div>
                            <div class="card-body">
                                <p>Number of Patients: </p>
                                <p>Avg Age of Patients: </p>
                                <p>Number of Missing Cells: </p>
                                <p>Patient Conditions: </p>
                            </div>
                        </div>
                  

             
                        <div class="card shadow mb-4">
                            <div class="card-header py-3">
                                <h6 class="m-0 font-weight-bold text-primary">Related Genes</h6>
                            </div>
                            <div class="card-body">
                                <p>Gene 1</p>
                                <p>Gene 2</p>
                                <p>Gene 3</p>
                            </div>
                        </div>
                    </div>
                    
                      <div class="col-xl">

                        <TableContainer style={{ width: '100%', height: '500px', overflow:'scroll' }}>
                    
                          <Table style={ { minWidth: 650}} aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                <TableCell>Code</TableCell>
                              </TableRow>
                            </TableHead>
                            
                            <TableBody>
                              {
                                gene_code_info.code.map(function(item, row_i){
                                  return <TableRow  key={row_i}>
                                          <TableCell>
                                              <div className="codeRow" >{breakUpCode(item).map(function(code_str, i){
                                              return <div className = "codeCard" style={{backgroundColor: getColor(i)}}>
                                                        {code_str}
                                                      </div>     
                                            })}</div>
                                          </TableCell>
                                    </TableRow>
                              
                              })
                            }
                            </TableBody>
                          </Table>
                          
                        </TableContainer>

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

export default GenePage

{/*
const columns = [ 
    {title: "Patient ID" , field: "patient_id"},
    {title: "Age" , field: "age"},
    {title: "Diabete" , field: "diabete"},
    {title: "Final Diagnosis" , field: "final_diagnosis"},
    {title: "Gender" , field: "gender"},
    {title: "Hypercholesterolemia" , field: "hypercholesterolemia"},
    {title: "Hypertension" , field: "hypertension"},
    {title: "Race" , field: "race"},
  ]
*/}

{/*<div class="col" id="table_content">
    <MaterialTable columns={columns}
    
      data={patient_table_data}
      icons={tableIcons}
      options={{
        pageSize: 5,
        pageSizeOptions: [5, 10, 15, 25, 50, 100],
        showTitle: false,
        search: false
      }}
      />
    </div>*/}

{/*<div class="col" id="checkbox_filter">

<div class="card shadow mb-4" >
      <div class="card-header py-3">
          <h6 class="m-0">Options</h6>
      </div>
      <div class="card-body">
        {options.map((options_category_list,j) => {

            return(
              <div>
                <h6 class="font-weight-bold">{options_category_list['title']}</h6>
                {options_category_list['cont_arr'].map((option, i) => {
                return (
                
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        id={option}
                        name={option}
                        value={option}
                        onChange={(e) => {
                          //setFilter(setFilteredParams(filterValue, e.target.value));
                        }}
                      ></input>
                      <label
                        htmlFor={option}
                        className="ml-1.5 font-medium text-gray-700"
                      >
                        {option}
                      </label>
                    </div>
                
                );
              })}
              </div>
            );
        })}
      </div>
  </div>

</div>*/}

{/*
const products = [{
  'id': 1,
  'name':"Spinach",
  'quality': "good"
},{
  'id': 2,
  'name':"Juice",
  'quality': "good"
},{
  'id': 3,
  'name':"Biscuits",
  'quality': "bad"
}
]
*/}
