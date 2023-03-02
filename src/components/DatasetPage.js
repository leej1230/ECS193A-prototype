import React, { useEffect, useState } from 'react';
import "./DatasetPage.css";
import { Box, Card , CardContent, CardActions, Typography, Button, Table, TableRow, TableCell, TableContainer, TableBody } from '@mui/material';

import { Link } from 'react-router-dom';
import axios from 'axios';
import Dataset from "./Dataset"


export default class DatasetPage extends React.Component {

     state = {
        dataset: {"name": "None", "gene_ids": "0", "patient_ids": "0" },
        DATASET_ID : window.location.pathname.split("/").at(-1)
      }
      
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
          
          <div className="cardLayout">
                <h3 className='cardContent'>{this.state.dataset["name"]}</h3>
          </div>
          <div className="cardLayout">
            <div className='cardContent'>
              <h4>Description</h4>
              <p>{this.state.dataset["description"]}</p>  
            </div>
          </div>
          
          <Box className="cardLayout">
            <Card variant="outlined">
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
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
              </CardContent>
            </Card>
          </Box>
        </div>
      )
    }
}

/*

*/
