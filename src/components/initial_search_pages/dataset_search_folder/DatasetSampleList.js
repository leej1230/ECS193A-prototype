import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./DatasetSampleList.css";

import SampleListDatasetResultDisplay from "./SampleListDatasetResultDisplay";

import "../../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "../../bootstrap_gene_page/css/sb-admin-2.min.css";

const URL = `${process.env.REACT_APP_BACKEND_URL}/api/patient/all`;

function DatasetSampleList(props) {
  const [dataset_data, setDATASET_data] = useState();

  useEffect(() => {
    async function updateDatasetList() {
      setDATASET_data(props.resultList);
    }
    updateDatasetList();
  }, [props]);

  return (
    <div>

      {props.input_search_loaded ? (
        <div>
          {dataset_data &&
            dataset_data.map((dataset_val) => (
              <SampleListDatasetResultDisplay dataset={dataset_val} />
            ))}
        </div>
      ) : (
        <div>
          <CircularProgress />
        </div>
      )}

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

export default DatasetSampleList;

/*
<li class="gene-display">
    <a href={"/gene/" + gene_val.name + "/" + gene_val.id}>
      Gene Name: {gene_val.name} ID: {gene_val.id}
    </a>
  </li>
*/

/*
<div id="dataset_display_result_single">
    <p id="search_dataset_result_name_display">{dataset_val.name} &nbsp; &nbsp; &nbsp; <a id="search_dataset_result_link_display" href={"/dataset/" + dataset_val.id}>Link to Dataset Page</a> </p>
    <p id="search_dataset_result_info_display">Dataset ID: {dataset_val.id} &nbsp; &nbsp; &nbsp; Description: ghghg hghgh ghgh </p>
    <hr id="line_div_category_search_content" />
</div>
*/
