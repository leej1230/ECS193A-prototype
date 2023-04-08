import React, {useEffect,useState} from 'react';
import axios from 'axios';
import { Box, Card , CardContent, CardActions, Typography, CircularProgress, Button, Paper } from '@mui/material';
import "./GenePage.css";
import "../data.css";
import SampleGraph from './echartdemo';

//import { useTable } from "react-table";
import MaterialTable from 'material-table';

import ScrollBars from "react-custom-scrollbars";

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
import Select from '@mui/material/Select';

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


const SAMPLE_ID = window.location.pathname.split("/").at(-1)

const columns = [ 
  {title: "Field Name" , field: "field_name"},
  {title: "Value" , field: "value"}
]
const SAMPLE_NAME = window.location.pathname.split("/").at(-2)
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/gene/${SAMPLE_NAME}/${SAMPLE_ID}`
const patientsDataAPIURL = `${process.env.REACT_APP_BACKEND_URL}/api/patients/${SAMPLE_NAME}/${SAMPLE_ID}`

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

{/* <div>
  <CircularProgress />
  <h3>Fetching Data...</h3>
</div> */}

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
  const [ dataset_info , set_dataset_info ] = useState({name : "" , patient_ids : {'arr':null}});
  const [ gene_code_info , set_gene_code_info ] = useState({code : ["mrna"]});
  const [graphType, setGraphType] = useState('bar');

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

  // componentDidMount() {
  useEffect( () => {
    async function fetchGeneData() {
      //await console.log(URL);
      const res = await axios.get(URL);
      const gene_ext = await axios.get(`http://rest.ensembl.org/lookup/id/ENSG00000157764?expand=1;content-type=application/json`);
      setGeneExternalData(gene_ext.data);
      setGene_data(res.data);

      console.log("fetch gene function: ")
      console.log(gene_data);
      
      //set_patient_table_input_format( createPatientFormatted(patient_data) );
      // .then(res => {
      // })
      //console.log( patient_data['patient_id'] );
    }

    async function fetchPatientsData() {
      console.log(patientsDataAPIURL)
      const res = await axios.get(patientsDataAPIURL);
      set_patient_table_data(res.data);
      //set_patient_table_input_format( createPatientFormatted(patient_data) );
      // .then(res => {
      // })
      //console.log( patient_data['patient_id'] );
    }
    fetchPatientsData()
    fetchGeneData()
  } , []);

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

  return (
    <body id="page-top">

      <div id="wrapper">

      <div id="content-wrapper" class="d-flex flex-column">


          <div id="content">

              <div class="container-fluid">

                  <div class="d-sm-flex align-items-center justify-content-between mb-4">
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
                                      <p>Dataset: {gene_data.dataset_id}</p>
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
                                  
                                {gene_data?(
                                  <div>
                                    <SampleGraph categories={gene_data.patient_ids["arr"]} data={gene_data.gene_values["arr"]} type={graphType} />
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
                          </div>
                      </div>

                      
                  </div>

                  <div class="row">

                  <div class="col-xl-6 col-lg-7">
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
                  </div>

                  <div class="col-xl-6 col-lg-7">
                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary">Related Genes</h6>
                        </div>
                        <div class="card-body">
                            <p>Person 1</p>
                            <p>Person 2</p>
                            <p>Person 3</p>
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

export default GenePage

{/*<Box >
          <Card variant="outlined">
            <CardContent >
            </CardContent>
          </Card>
        </Box>*/}
{/*<div>
        <div className="titleLayout">
          {gene_data?(
              <div>
                <p className='gene_name'>{gene_data.name}</p>
              </div>
            ):(
              <div>
                <CircularProgress />
                <h3>Fetching Data...</h3>
              </div>
            )}
        </div>

      <div className="headerGroup">
        <div className="textElement"> <p className="text_label">Last Updated: &nbsp; </p> <p className="text_content">01-03-2023</p> </div>
        <div className="buttonGroup">
          <button className="buttonElement"> Download </button>
          <button className="buttonElement"> Delete </button>
        </div>
      </div>

      <hr style={{
            color: 'black',
            width: '98%',
            marginTop: '1%',
            marginBottom: '1%'
        }} />

        <div className="cardLayout">
          <div className='cardContent'>
            {gene_external_data["description"]?(
              <div>
                <p className='cardTitle'>Description</p>
                <p className='cardBody'>{gene_external_data["description"]}</p>  
              </div>
            ):(
              <div>
                <CircularProgress />
                <h3>Fetching Data...</h3>
              </div>
            )}
          </div>
        </div>

        

        <div className="cardLayout">
            <div className='cardContent'>

              <p className='cardTitle'>Gene Information</p>
              {gene_data?(
                <div className='cardBody'>
                  <p>ID: {gene_data.id}</p>
                  <p>Dataset: {gene_data.dataset_id}  <a href={"/dataset/" + gene_data.dataset_id} >Link to Dataset</a></p>
                </div>
              ):(
                <div>
                  <CircularProgress />
                  <h3>Fetching Data...</h3>
                </div>
              )}
            </div>
        </div>

      <div className="bottomInfo">

          <Box className="bottomCard" >
            <Card variant="outlined">
              <CardContent>
                <h4 className='cardTitle'>Stats</h4>
                <p>Number of Patients: </p>
                <p>Avg Age of Patients: </p>
                <p>Number of Missing Cells: </p>
                <p>Patient Conditions: </p>
              </CardContent>
            </Card>
          </Box>

          <Box className="bottomCard">
            <Card variant="outlined">
              <CardContent>
                <h4 className='cardTitle'>Recently Viewed Members</h4>
                <p>Person 1</p>
                <p>Person 2</p>
                <p>Person 3</p>
              </CardContent>
            </Card>
          </Box>

        </div>


        <Box className="cardLayout">
          <Card variant="outlined">
            <CardContent>
              <h4 className='cardTitle'>Data Graph</h4>
              {gene_data?(
                <div>
                  <SampleGraph categories={gene_data.patient_ids["arr"]} data={gene_data.gene_values["arr"]} type={graphType} />
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
                  <h3>Fetching Data...</h3>
                </div>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box className="cardLayout">
          <Card variant="outlined">
            <CardContent>
              <h4 className='cardTitle'>Patient List</h4>
              <MaterialTable columns={columns} 
              data={patient_table_data}
              icons={tableIcons}
              options={{
                paging: false,
                showTitle: false
              }}
              />
            </CardContent>
          </Card>
        </Box>

        <Box className="cardLayout">
          <Card variant="outlined">
            <CardContent>
              <div className="codeCardOuter">
                
                <h4 className='cardTitle'>Gene View</h4>
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
              
            </CardContent>
          </Card>
        </Box>
    </div> */}


    {/*
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                  <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                      <i class="fa fa-bars"></i>
                  </button>

                  <form
                      class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                      <div class="input-group">
                          <input type="text" class="form-control bg-light border-0 small" placeholder="Search for..."
                              aria-label="Search" aria-describedby="basic-addon2" />
                          <div class="input-group-append">
                              <button class="btn btn-primary" type="button">
                                  <i class="fas fa-search fa-sm"></i>
                              </button>
                          </div>
                      </div>
                  </form>

                  <ul class="navbar-nav ml-auto">

                      <li class="nav-item dropdown no-arrow d-sm-none">
                          <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <i class="fas fa-search fa-fw"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                              aria-labelledby="searchDropdown">
                              <form class="form-inline mr-auto w-100 navbar-search">
                                  <div class="input-group">
                                      <input type="text" class="form-control bg-light border-0 small"
                                          placeholder="Search for..." aria-label="Search"
                                          aria-describedby="basic-addon2" />
                                      <div class="input-group-append">
                                          <button class="btn btn-primary" type="button">
                                              <i class="fas fa-search fa-sm"></i>
                                          </button>
                                      </div>
                                  </div>
                              </form>
                          </div>
                      </li>

                      <li class="nav-item dropdown no-arrow mx-1">
                          <a class="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button"
                              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <i class="fas fa-bell fa-fw"></i>
        
                              <span class="badge badge-danger badge-counter">3+</span>
                          </a>
                  
                          <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                              aria-labelledby="alertsDropdown">
                              <h6 class="dropdown-header">
                                  Alerts Center
                              </h6>
                              <a class="dropdown-item d-flex align-items-center" href="#">
                                  <div class="mr-3">
                                      <div class="icon-circle bg-primary">
                                          <i class="fas fa-file-alt text-white"></i>
                                      </div>
                                  </div>
                                  <div>
                                      <div class="small text-gray-500">December 12, 2019</div>
                                      <span class="font-weight-bold">A new monthly report is ready to download!</span>
                                  </div>
                              </a>
                              <a class="dropdown-item d-flex align-items-center" href="#">
                                  <div class="mr-3">
                                      <div class="icon-circle bg-success">
                                          <i class="fas fa-donate text-white"></i>
                                      </div>
                                  </div>
                                  <div>
                                      <div class="small text-gray-500">December 7, 2019</div>
                                      $290.29 has been deposited into your account!
                                  </div>
                              </a>
                              <a class="dropdown-item d-flex align-items-center" href="#">
                                  <div class="mr-3">
                                      <div class="icon-circle bg-warning">
                                          <i class="fas fa-exclamation-triangle text-white"></i>
                                      </div>
                                  </div>
                                  <div>
                                      <div class="small text-gray-500">December 2, 2019</div>
                                      Spending Alert: We've noticed unusually high spending for your account.
                                  </div>
                              </a>
                              <a class="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
                          </div>
                      </li>


                      <li class="nav-item dropdown no-arrow mx-1">
                          <a class="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button"
                              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <i class="fas fa-envelope fa-fw"></i>
                    
                              <span class="badge badge-danger badge-counter">7</span>
                          </a>
            
                          <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                              aria-labelledby="messagesDropdown">
                              <h6 class="dropdown-header">
                                  Message Center
                              </h6>
                              <a class="dropdown-item d-flex align-items-center" href="#">
                                  <div class="dropdown-list-image mr-3">
                                      <img class="rounded-circle" src="img/undraw_profile_1.svg"
                                          alt="..." />
                                      <div class="status-indicator bg-success"></div>
                                  </div>
                                  <div class="font-weight-bold">
                                      <div class="text-truncate">Hi there! I am wondering if you can help me with a
                                          problem I've been having.</div>
                                      <div class="small text-gray-500">Emily Fowler · 58m</div>
                                  </div>
                              </a>
                              <a class="dropdown-item d-flex align-items-center" href="#">
                                  <div class="dropdown-list-image mr-3">
                                      <img class="rounded-circle" src="img/undraw_profile_2.svg"
                                          alt="..." />
                                      <div class="status-indicator"></div>
                                  </div>
                                  <div>
                                      <div class="text-truncate">I have the photos that you ordered last month, how
                                          would you like them sent to you?</div>
                                      <div class="small text-gray-500">Jae Chun · 1d</div>
                                  </div>
                              </a>
                              <a class="dropdown-item d-flex align-items-center" href="#">
                                  <div class="dropdown-list-image mr-3">
                                      <img class="rounded-circle" src="img/undraw_profile_3.svg"
                                          alt="..." />
                                      <div class="status-indicator bg-warning"></div>
                                  </div>
                                  <div>
                                      <div class="text-truncate">Last month's report looks great, I am very happy with
                                          the progress so far, keep up the good work!</div>
                                      <div class="small text-gray-500">Morgan Alvarez · 2d</div>
                                  </div>
                              </a>
                              <a class="dropdown-item d-flex align-items-center" href="#">
                                  <div class="dropdown-list-image mr-3">
                                      <img class="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60"
                                          alt="..." />
                                      <div class="status-indicator bg-success"></div>
                                  </div>
                                  <div>
                                      <div class="text-truncate">Am I a good boy? The reason I ask is because someone
                                          told me that people say this to all dogs, even if they aren't good...</div>
                                      <div class="small text-gray-500">Chicken the Dog · 2w</div>
                                  </div>
                              </a>
                              <a class="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
                          </div>
                      </li>

                      <div class="topbar-divider d-none d-sm-block"></div>

                      <li class="nav-item dropdown no-arrow">
                          <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <span class="mr-2 d-none d-lg-inline text-gray-600 small">Douglas McGee</span>
                              <img class="img-profile rounded-circle"
                                  src="img/undraw_profile.svg" />
                          </a>
              
                          <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                              aria-labelledby="userDropdown">
                              <a class="dropdown-item" href="#">
                                  <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                  Profile
                              </a>
                              <a class="dropdown-item" href="#">
                                  <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                  Settings
                              </a>
                              <a class="dropdown-item" href="#">
                                  <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                                  Activity Log
                              </a>
                              <div class="dropdown-divider"></div>
                              <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                  <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                  Logout
                              </a>
                          </div>
                      </li> 

                  </ul>

              </nav>
      */}