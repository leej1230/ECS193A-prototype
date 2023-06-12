
import React, { useEffect, useState } from "react";

import axios from "axios";

import CircularProgress from "@mui/material/CircularProgress";
import "./SampleListDatasetResultDisplay.css";

import "../../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "../../bootstrap_gene_page/css/sb-admin-2.min.css";

import LimitedText from '../../filters/LimitedText'

const URL = `${process.env.REACT_APP_BACKEND_URL}/api/patient/all`;
const DATASET_URL = `${process.env.REACT_APP_BACKEND_URL}/api/dataset_by_name/all`;
// const GENE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/gene/25174`

function SampleListDatasetResultDisplay(props) {

  return (
    <div>
        <div id="dataset_display_result_single">
            <p id="search_dataset_result_name_display">{props.dataset && props.dataset.name ? props.dataset.name : ""} &nbsp; &nbsp; &nbsp; <a id="search_dataset_result_link_display" href={props.dataset && props.dataset.name ? "/dataset/" + props.dataset.name : "#"}>Link to Dataset Page</a> </p>
            <p id="search_dataset_result_info_display">Date Uploaded: {props.dataset && props.dataset.date_created ? props.dataset.date_created : '-'} </p>
            <LimitedText numLines='1' text={`Description: ${props.dataset && props.dataset.description ? props.dataset.description : '-'}`} />
            <hr id="line_div_category_search_content" />
        </div>

        {/* Dataset ID: {props.dataset && props.dataset.id ? props.dataset.id : '-'}, &nbsp; &nbsp; &nbsp; */}
      

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

export default SampleListDatasetResultDisplay;


