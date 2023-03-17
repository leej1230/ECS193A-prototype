import React, {useEffect,useState} from 'react';
import axios from 'axios';
import { Box, Card , CardContent, CardActions, Typography, Button, Paper } from '@mui/material';
import "./GenePage.css";
import "../data.css";
import SampleGraph from './echartdemo';

//import { useTable } from "react-table";
import MaterialTable from 'material-table';

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
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/gene/${SAMPLE_ID}`

const columns = [ 
  {title: "Field Name" , field: "field_name"},
  {title: "Value" , field: "value"}
]

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
  const [gene_data, setGene_data] =  useState({id : 3 , name : "unknown" , dataset_id : 1});
  const [gene_external_data , setGeneExternalData] = useState({description: ""})
  const [ gene_table_input_format , set_gene_table_input_format ] = useState([{field_name : "" , value : ""}]);
  const [ dataset_info , set_dataset_info ] = useState({name : "" , patient_ids : {'arr':null}});
  const [ gene_code_info , set_gene_code_info ] = useState({code : ["mrna"]});

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

          <nav className="nav_index">
            <ul className="nav_index_ul">
              <li className="nav_index_li">{gene_data.name}</li>
            </ul>
          </nav>
          <Box className="cardLayout_outer">
            <Card variant="outlined">
              <CardContent>

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
                      <MaterialTable columns={columns} 
                        data={gene_table_input_format}
                        icons={tableIcons}
                        options={{
                          showTitle: false
                        }}
                      />  
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
                      <div className="codeCardOuter">
                        <h4 className='cardTitle'>Gene View</h4>
                        <TableContainer style={{ width: '100%' }}>
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
