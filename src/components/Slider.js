import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, CardActions, Typography } from '@mui/material';
import { Button } from "@mui/material";
import "./Slider.css"
import DatasetList from "./DatasetList"
import axios from 'axios';
import ScrollBars from "react-custom-scrollbars";

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "./bootstrap_gene_page/css/sb-admin-2.min.css"

function debounce(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}

function SliderItemsContainer(props) {
  const [index, setIndex] = useState(0);

  const [dimensions, setDimensions] = React.useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  })

  React.useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }, 1000)

    window.addEventListener('resize', debouncedHandleResize)

      return _ => {
        window.removeEventListener('resize', debouncedHandleResize)

      }
    })

  return (
    <div>

      <ScrollBars
       style={{ width: parseInt(0.7 * dimensions.width), height: '405px', margin: '0px', padding: '0px' }}  >
        {props.dataset_groups_list.map((child, index) =>
        <div key={index}> <DatasetList curWindowWidth={dimensions.width} curWindowHeight={dimensions.height} datasets_arr={props.dataset_groups_list[index]} /> </div>)}
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

      if(num_groups == 0){
        return []
      }

      if(last_group_num_datasets > 0){
        num_groups = num_groups + 1
      }

      var groups_list = [];
      for (let index = 0; index < num_groups; index++) {
        const start_dataset_index = index * 6;
        let end_dataset_index = start_dataset_index + 6;
        if ((index+1) === num_groups && num_datasets % 6 > 0 ) {
          end_dataset_index = start_dataset_index + last_group_num_datasets;
        }

        let cur_group = [];
        for (let j = start_dataset_index; j < end_dataset_index; j++) {
          cur_group.push(datasets_list[j]);
        }
        groups_list.push(cur_group);
      }

      console.log("groups: ", groups_list)

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
