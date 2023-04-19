import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, CardActions, Typography } from '@mui/material';
import { Button } from "@mui/material";
import "./Slider.css"
import DatasetList from "./DatasetList"
import axios from 'axios';
import ScrollBars from "react-custom-scrollbars";

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "./bootstrap_gene_page/css/sb-admin-2.min.css"

function SliderItemsContainer(props) {
  const [index, setIndex] = useState(0);

  function dotClicked(e) {
    setIndex(parseInt(e.target.dataset.index, 10));
  };

  return (
    <div>
      <meta http-equiv='cache-control' content='no-cache' />
      <meta http-equiv='expires' content='0' />
      <meta http-equiv='pragma' content='no-cache' />

      <ScrollBars style={{ width: 1000, height: 400 }}>
        {props.dataset_groups_list.map((child, index) =>
          <div key={index}> <DatasetList datasets_arr={props.dataset_groups_list[index]} /> </div>
        )}
      </ScrollBars>

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

export default function Slider() {
  const [datasets_list, setDatasetsList] = useState([]);
  const [groupings, setGroupings] = useState([]);

  useEffect(() => {
    function createDatasetListGroups() {
      var num_datasets = datasets_list.length;
      var num_groups = Math.floor(num_datasets / 6);
      var last_group_num_datasets = num_datasets % 6;
      var groups_list = [];
      for (let index = 0; index <= num_groups; index++) {
        const start_dataset_index = index * 6;
        var end_dataset_index = start_dataset_index + 6;
        if (index === num_groups) {
          end_dataset_index = start_dataset_index + last_group_num_datasets;
        }
        var cur_group = [];
        for (let j = start_dataset_index; j < end_dataset_index; j++) {
          cur_group.push(datasets_list[j]);
        }
        groups_list.push(cur_group);
      }
      return groups_list;
    }

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/dataset/all/`)
      .then((result) => {
        setDatasetsList(result.data);
      })
      .then(() => {
        setGroupings(createDatasetListGroups());
      });
  }, [datasets_list]);

  return (
    <div>
      <SliderItemsContainer dataset_groups_list={groupings} />
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
