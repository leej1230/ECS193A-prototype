import React, {useEffect,useState} from 'react';
import axios from 'axios';
import { Box, Card , CardContent, CardActions, Typography, Button, Table, TableRow, TableCell, TableContainer, TableBody, Paper } from '@mui/material';
import "./Sample.css";
import "../data.css";
import SampleGraph from './echartdemo';

//import { useTable } from "react-table";
import MaterialTable from 'material-table';

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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
const SAMPLE_NAME = window.location.pathname.split("/").at(-2)
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/gene/${SAMPLE_NAME}/${SAMPLE_ID}`
const patientsDataAPIURL = `${process.env.REACT_APP_BACKEND_URL}/api/patients/${SAMPLE_NAME}/${SAMPLE_ID}`

function createGeneFormatted( input_gene_data) {
    // return formatted for table
    var init_arr = [];
    var data_input = input_gene_data;
    Object.keys(data_input).forEach(function(key) {
      var val_input = data_input[key]
      init_arr.push( {field_name: key , value: val_input } )
    });

    console.log( init_arr )

    return init_arr;
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
      const res = await axios.get(URL);
      const gene_ext = await axios.get(`http://rest.ensembl.org/lookup/id/ENSG00000157764?expand=1;content-type=application/json`)
      setGene_data(res.data);
      console.log(res.data.gene_values["arr"]);
      setGeneExternalData(gene_ext.data);
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

    fetchGeneData()
    fetchPatientsData()
  }, []);


  return (
    <div>

      <div className="headerGroup">
        <p className="textElement">Last Updated: 01-03-2023</p>
        <div className="buttonGroup">
          <button className="buttonElement"> Download </button>
          <button className="buttonElement"> Delete </button>
        </div>
      </div>

      {gene_data ? (
        <div>
          <div className="titleLayout">
            <h3>{gene_data.name}</h3>
          </div>

          <div className="cardLayout">
            <div className='cardContent'>
              <h4 className='cardTitle'>Description</h4>
              <p>{gene_external_data["description"]}</p>  
            </div>
          </div>

          <Box className="cardLayout">
            <Card variant="outlined">
              <CardContent>
                <h4 className='cardTitle'>Gene Information</h4>
                <p>ID: {gene_data.id}</p>
                <p>Dataset: {gene_data.dataset_id}  <a href={"/dataset/" + gene_data.dataset_id} >Link to Dataset</a></p>
              </CardContent>
            </Card>
          </Box>

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
                <h4 className='cardTitle'>Gene View</h4>
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


      </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default GenePage
