
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./SampleListGeneResultDisplay.css";

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "./bootstrap_gene_page/css/sb-admin-2.min.css";

const URL = `${process.env.REACT_APP_BACKEND_URL}/api/patient/all`;
const GENE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/gene/all`;
// const GENE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/gene/25174`

function SampleListGeneResultDisplay(props) {
  

  return (
    <div>
        <div id="gene_display_result_single">
            <p id="search_gene_result_name_display">{props.gene && props.gene.name ? props.gene.name : ""} &nbsp; &nbsp; &nbsp; <a id="search_gene_result_link_display" href={props.gene && props.gene.name && props.gene.id ? "/gene/" + props.gene.name + "/" + props.gene.id : "#"}>Link to Gene Page</a> </p>
            <p id="search_gene_result_info_display">Gene ID: {props.gene && props.gene.id ? props.gene.id : '-'} &nbsp; &nbsp; &nbsp; Dataset Name: SOME_DATASET &nbsp; &nbsp; &nbsp; Dataset ID: 1 &nbsp; &nbsp; &nbsp; Gene Type: Protein Coding &nbsp; &nbsp; &nbsp; Other Name: ANKR1 &nbsp; &nbsp; &nbsp; </p>
            <p id="search_gene_result_info_display">Description: ghghg hghgh ghgh &nbsp; &nbsp; &nbsp;</p>
            <hr id="line_div_category_search_content" />
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

export default SampleListGeneResultDisplay;



