import React from 'react';
import "./GeneCard.css";
import { useEffect, useState } from "react";
import { Box, Card , CardContent, CardActions, Typography } from '@mui/material';
import {Button} from "@mui/material";

import LimitedText from './LimitedText.js'

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "./bootstrap_gene_page/css/sb-admin-2.min.css"

function GeneCard(props) {

  return (
    <div> 
      <div class="card" style={{minWidth: `${parseInt( ((0.7 * props.curOuterWindowWidth) - 60) / 3)}px`, maxWidth: `${parseInt( ((0.7 * props.curOuterWindowWidth) - 60) / 3)}px`, minHeight: '175px', maxHeight: '175px', overflow:'hidden'}}>
        <div class="card-body">
          <h5 class="card-title"><a href={props.gene ? "/gene/" + props.gene.name + "/" + props.gene.id : "#"} onClick={() => {
            }} >{props.gene ? props.gene.name : ""}</a></h5>
          <p className="gene_content_card">Gene ID: 1  Dataset ID: 1 </p>
          <p className="gene_content_card">Gene Type: Protein Coding</p>
          <p className="gene_content_card">Other Name: ANKR1</p>
          <p className="gene_content_card">Dataset Name: SOME_DATASET</p>

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