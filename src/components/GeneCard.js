import React from 'react';
import "./GeneCard.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Card , CardContent, CardActions, Typography } from '@mui/material';
import {Button} from "@mui/material";

import LimitedText from './LimitedText.js'

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "./bootstrap_gene_page/css/sb-admin-2.min.css"

function GeneCard(props) {

  const [extended_gene_information, set_extended_gene_information] = useState(undefined);
  const [dataset_name, set_dataset_name] = useState("SOME DATASET");
  
  useEffect(() => {
    if(props.gene){
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/dataset_name_from_dataset_id/${props.gene.dataset_id}`)
        .then(async (result) => {
          set_dataset_name(result.data)
        })
    }
  }, [props]);

  useEffect(() => {

    if(props.gene){

      let temp_gene_name = props.gene.name
      let end_index = temp_gene_name.indexOf( "." )
      if( end_index >= 0 -1 ){
        // present
        temp_gene_name = temp_gene_name.substring(0, end_index )
      }

      const external_url = `https://rest.ensembl.org/lookup/id/${temp_gene_name}?expand=1;content-type=application/json`;

      axios.get(external_url)
        .then(async (result) => {
          console.log(result)
          set_extended_gene_information({ display_name: result.data["display_name"] , biotype: result.data["biotype"] , description: result.data["description"], assembly_name: result.data["assembly_name"] })
        }).catch(
          function (error) {
            console.log('failed external info fetch!')
            
          }
        )
      
    }
  }, [props]);

  return (
    <div> 
      <div class="card" style={{minWidth: `${parseInt( ((0.7 * props.curOuterWindowWidth) - 60) / 3)}px`, maxWidth: `${parseInt( ((0.7 * props.curOuterWindowWidth) - 60) / 3)}px`, minHeight: '175px', maxHeight: '175px', overflow:'hidden'}}>
        <div class="card-body">
          <h5 class="card-title"><a href={props.gene ? "/gene/" + props.gene.name + "/" + props.gene.id : "#"} onClick={() => {
            }} >{props.gene ? props.gene.name : ""}</a></h5>
          <p className="gene_content_card">Gene ID: {props.gene && props.gene.id ? props.gene.id : "1"}  Dataset ID: {props.gene && props.gene.dataset_id ? props.gene.dataset_id : "1"} </p>
          <p className="gene_content_card">Gene Type: {extended_gene_information ? extended_gene_information.biotype : "Protein Coding"}</p>
          <p className="gene_content_card">Other Name: {extended_gene_information ? extended_gene_information.display_name : "" } </p>
          <p className="gene_content_card">Dataset Name: {dataset_name}</p>

          {/*<LimitedText text={props.gene ? props.gene.description : ""} />*/}
          
          {/*<p >{props.gene.description}</p>*/}
          <br />
          
        </div>
      </div>

      <script src="./bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
      <script src="./bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="./bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>
      <script src="./bootstrap_gene_page/js/sb-admin-2.min.js"></script>
      <script src="./bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>
      <script src="./bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
      <script src="./bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>
    </div>
  );
}

export default GeneCard;

/*
class="btn btn-primary btn-sm"
*/