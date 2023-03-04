import React, { useEffect, useState } from 'react';
import "./DatasetPage.css";
import { Box, Card , CardContent, CardActions, Typography, Button, Table, TableRow, TableCell, TableContainer, TableBody, Paper } from '@mui/material';

import { Link } from 'react-router-dom';
import axios from 'axios';
import Dataset from "./Dataset"

import ScrollBars from "react-custom-scrollbars";

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

export default class DatasetPage extends React.Component {

     state = {
        dataset: {"name": "None", "gene_ids": "0", "patient_ids": "0" },
        DATASET_ID : window.location.pathname.split("/").at(-1)
      }
    
    columns = [ 
      {title: "Name" , field: "name"},
      {title: "Email" , field: "email"},
      {title: "Phone Number" , field: "phone"},
      {title: "Age" , field: "age"},
      {title: "Gender" , field: "gender"},
      {title: "City" , field: "city"}
    ]

    tableData = [ {name: "Raj" , email: "Raj@gmail.com" , age: 25, phone: 789012334, gender: "Male" , city: "Davis" } ]
      
      componentDidMount() {
        const url = `http://127.0.0.1:8000/api/dataset/${this.state.DATASET_ID}`;
        axios.get(url)
        .then(result => {
          this.setState({
            dataset : result.data
          })
          
        })
      }
      
     
    render(){
        console.log(this.state.dataset)
      return (
        <div >

          <div className="headerGroup">
            <p className="textElement">Last Updated: 01-03-2023</p>
            <div className="buttonGroup">
              <button className="buttonElement"> Update </button>
              <button className="buttonElement"> Download </button>
              <button className="buttonElement"> Delete </button>
            </div>
          </div>
          
          <div className="titleLayout">
                <h3>{this.state.dataset["name"]}</h3>
          </div>
          <div className="cardLayout">
            <div className='cardContent'>
              <h4 className='cardTitle'>Description</h4>
              <p>{this.state.dataset["description"]}</p>  
            </div>
          </div>

          <MaterialTable columns={[
            { title: 'A', field: 'name' },
            { title: 'So', field: 'surname' },
            { title: 'Do', field: 'birthYear', type: 'numeric' },
            { title: 'DoYeri', field: 'birthCity', lookup: { 34: 'tanbul', 63: 'urfa' } }
          ]} icons={tableIcons}/>
          
          <Box className="cardLayout">
            <Card variant="outlined">
              <CardContent>
                <h4 className='cardTitle'>Basic Dataset Information</h4>
                
              </CardContent>
            </Card>
          </Box>

          <div className="bottomInfo">

            <Box className="bottomCard" >
              <Card variant="outlined">
                <CardContent>
                  <h4 className='cardTitle'>Dataset Stats</h4>
                </CardContent>
              </Card>
            </Box>

            <Box className="bottomCard">
              <Card variant="outlined">
                <CardContent>
                  <h4 className='cardTitle'>Recently Viewed Members</h4>
                </CardContent>
              </Card>
            </Box>

          </div>

          <Box className="cardLayout">
            <Card variant="outlined">
              <CardContent>
                <h4 className='cardTitle'>Dataset View</h4>
                
              </CardContent>
            </Card>
          </Box>

        </div>
      )
    }
}

/*
<TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow className="tableRow">
                        <TableCell>ID</TableCell>
                        <TableCell>{this.state.dataset["id"]}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Date Created</TableCell>
                        <TableCell>{this.state.dataset["date_created"]}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Gene IDs</TableCell>
                        
                          <TableCell>{this.state.dataset["gene_ids"]}</TableCell>
        
                      </TableRow>
                      <TableRow>
                        <TableCell>Patient IDs</TableCell>
                
                          <TableCell>{this.state.dataset["patient_ids"]}</TableCell>
                
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
*/
