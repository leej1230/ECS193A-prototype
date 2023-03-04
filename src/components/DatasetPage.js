import React, { useEffect, useState } from 'react';
import "./Dataset.css";
import { Box, Card , CardContent, CardActions, Typography } from '@mui/material';
import {Button} from "@mui/material";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Dataset from "./Dataset"


export default class DatasetPage extends React.Component {

     state = {
        dataset: {"name": "None", "gene_ids": "0", "patient_ids": "0" },
        DATASET_ID : window.location.pathname.split("/").at(-1)
      }
      
      componentDidMount() {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/dataset/${this.state.DATASET_ID}`;
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
            <h3>Name: {this.state.dataset["name"]}</h3>
            <table>
              <tr>
                <td>ID</td>
                <td>{this.state.dataset["id"]}</td>
              </tr>
              <tr>
                <td>Description</td>
                <td>{this.state.dataset["description"]}</td>
              </tr>
              <tr>
                <td>Date Created</td>
                <td>{this.state.dataset["date_created"]}</td>
              </tr>
              <tr>
                <td>Gene IDs</td>
                <td>{this.state.dataset["gene_ids"]}</td>
              </tr>
              <tr>
                <td>Patient IDs</td>
                <td>{this.state.dataset["patient_ids"]}</td>
              </tr>
              <tr>
                <td>Link to File</td>
                <td>{this.state.dataset["url"]}</td>
              </tr>
            </table>
        </div>
      )
    }
}

/*

*/
