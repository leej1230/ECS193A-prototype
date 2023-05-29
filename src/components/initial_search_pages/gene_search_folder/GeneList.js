import React from 'react';
import "./GeneList.css";
import { Box, Card , CardContent, CardActions, Typography } from '@mui/material';
import {Button} from "@mui/material";
import GeneCard from "./GeneCard"

import "../../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "../../bootstrap_gene_page/css/sb-admin-2.min.css"

function GeneList(props) {
  return (
    <div class="card" style={{margin: '0px', padding: '0px'}}>
      <div class="card-body">
        <div className="outer_grid">
          {props.genes_arr.map((data_set_single, index) => (
            <GeneCard curOuterWindowWidth={props.curWindowWidth} curOuterWindowHeight={props.curWindowHeight} gene={props.genes_arr[index]} />
          ))}
        </div>
      </div>

      <script src="../../bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
      <script src="../../bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

      <script src="../../bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>

      <script src="../../bootstrap_gene_page/js/sb-admin-2.min.js"></script>

      <script src="../../bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>

      <script src="../../bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
      <script src="../../bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>
    </div>
  );
}

export default GeneList;
