import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./SampleList.css";

import SampleListGeneResultDisplay from "./SampleListGeneResultDisplay"

import "../../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "../../bootstrap_gene_page/css/sb-admin-2.min.css";

const URL = `${process.env.REACT_APP_BACKEND_URL}/api/patient/all`;

function SampleList(props) {
  const [gene_data, setGENE_data] = useState(undefined);

  useEffect(() => {
    async function updateGeneList() {
      setGENE_data(props.resultList);
    }
    updateGeneList();
  }, [props]);

  return (
    <div>

      {gene_data ? (
        <div>
          {gene_data &&
            gene_data.map((gene_val) => (
              <SampleListGeneResultDisplay gene={gene_val} />
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

export default SampleList;

/*
<li class="gene-display">
    <a href={"/gene/" + gene_val.name + "/" + gene_val.id}>
      Gene Name: {gene_val.name} ID: {gene_val.id}
    </a>
  </li>
*/
