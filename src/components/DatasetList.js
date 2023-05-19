import React from 'react';
import "./DatasetList.css";
import { Box, Card , CardContent, CardActions, Typography } from '@mui/material';
import {Button} from "@mui/material";
import Dataset from "./Dataset"

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "./bootstrap_gene_page/css/sb-admin-2.min.css"

function DatabaseList(props) {
  return (
    <div class="card shadow mb-4">
      <div class="card-body">
        <div className="outer_grid">
          {props.datasets_arr.map((data_set_single, index) => (
            <Dataset curOuterWindowWidth={props.curWindowWidth} curOuterWindowHeight={props.curWindowHeight} dataset={props.datasets_arr[index]} />
          ))}
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

export default DatabaseList;
