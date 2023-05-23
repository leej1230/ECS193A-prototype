
import React, { useEffect, useState } from "react";

import axios from "axios";

import CircularProgress from "@mui/material/CircularProgress";
import "./SampleListDatasetResultDisplay.css";

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "./bootstrap_gene_page/css/sb-admin-2.min.css";

const URL = `${process.env.REACT_APP_BACKEND_URL}/api/patient/all`;
const DATASET_URL = `${process.env.REACT_APP_BACKEND_URL}/api/dataset/all`;
// const GENE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/gene/25174`

function SampleListDatasetResultDisplay(props) {

    const [extended_dataset_information, set_extended_dataset_information] = useState(undefined);

  useEffect(() => {

    if(props.dataset){

      let temp_dataset_name = props.dataset.name
      let temp_dataset_id = props.dataset.id

      const external_url = `${process.env.REACT_APP_BACKEND_URL}/api/dataset/${temp_dataset_id}`;

      axios.get(external_url)
        .then(async (result) => {

          set_extended_dataset_information(result.data)

          console.log("dataset extended sample list info: ")
          console.log( result.data )
        }).catch(
          function (error) {
            console.log('failed external info fetch!')
            
          }
        )
      
    }
  }, [props]);

  return (
    <div>
        <div id="dataset_display_result_single">
            <p id="search_dataset_result_name_display">{props.dataset && props.dataset.name ? props.dataset.name : ""} &nbsp; &nbsp; &nbsp; <a id="search_dataset_result_link_display" href={props.dataset && props.dataset.id ? "/dataset/" + props.dataset.id : "#"}>Link to Dataset Page</a> </p>
            <p id="search_dataset_result_info_display">Dataset ID: {props.dataset && props.dataset.id ? props.dataset.id : '-'} &nbsp; &nbsp; &nbsp; Dataset Name: {props.dataset && props.dataset.name ? props.dataset.name : '-'} </p>
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

export default SampleListDatasetResultDisplay;


