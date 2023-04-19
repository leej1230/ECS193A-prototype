import React from 'react';
import "./Dataset.css";
import { Box, Card , CardContent, CardActions, Typography } from '@mui/material';
import {Button} from "@mui/material";

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "./bootstrap_gene_page/css/sb-admin-2.min.css"

function Dataset(props) {
  return (
    <div> 
      <div class="card shadow mb-4">
        <div class="card-body">
          <h5 class="card-title">{props.dataset.name}</h5>
          <p class="card-text">{props.dataset.description}</p>
          <br />
          <a href={"/dataset/" + props.dataset.id} class="btn btn-primary btn-sm"> Learn more </a>
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

export default Dataset;
