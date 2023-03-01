import React, { useEffect, useState } from 'react';
import "./Dataset.css";
import { Box, Card , CardContent, CardActions, Typography } from '@mui/material';
import {Button} from "@mui/material";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Dataset from "./Dataset"


export default class DatasetPage extends React.Component {

     state = {
        dataset: {"name": "None", "gene_ids": {"vals":[0,0]}, "patient_ids": {"vals":[0,0]} },
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
      return (
        <div >
            <h3>Name: {this.state.dataset["name"]}</h3>
            <table>
              <tr>
                <td>Description</td>
                <td>{this.state.dataset["description"]}</td>
              </tr>
              <tr>
                <td>Date Created</td>
                <td>{this.state.dataset["date_created"]}</td>
              </tr>
              <tr>
                <td>Source</td>
                <td><a href={this.state.dataset["url_link"]} target="_blank">{this.state.dataset["url_link"]}</a></td>
              </tr>
              <tr>
                <td>Genes</td>
                <td>{
                  this.state.dataset["gene_ids"]["vals"].map(
                    (gene_id_str , key) => {
                      return(
                        <p>{gene_id_str}</p>
                      )
                    }
                  )
                }</td>
              </tr>
              <tr>
                <td>Patients</td>
                <td>{
                  this.state.dataset["patient_ids"]["vals"].map(
                    (patient_id_str , key) => {
                      return(
                        <p>{patient_id_str}</p>
                      )
                    }
                  )
                }</td>
              </tr>
            </table>
        </div>
      )
    }
}

/*

*/
