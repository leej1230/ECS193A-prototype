import React, { useEffect, useState } from "react";

import GeneList from "./GeneList"
import axios from 'axios';
import ScrollBars from "react-custom-scrollbars";

import { useAuth0 } from '@auth0/auth0-react';

import { clone } from "ramda";

import "../../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "../../bootstrap_gene_page/css/sb-admin-2.min.css"

const user_get_url = `${process.env.REACT_APP_BACKEND_URL}/api/login`;

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


function SliderGeneItemsContainer(props) {
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
        {props.gene_groups_list.map((child, index) =>
          <div key={index}> <GeneList curWindowWidth={dimensions.width} curWindowHeight={dimensions.height} genes_arr={props.gene_groups_list[index]} /> </div>)}
      </ScrollBars>

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

export default function SliderGene() {
  const [genes_list, setGenesList] = useState([]);
  const [groupings, setGroupings] = useState([]);

  const { user } = useAuth0();
  const [, setUserInfo] = useState();
  const [bookmarkedGenes, setBookmarkedGenes] = useState([]);

  const handleFetchUser = async () => {
    const userSub = user.sub.split("|")[1];
    try {
      const res = await axios.get(`${user_get_url}/${userSub}`);

      setUserInfo(res.data)
      setBookmarkedGenes(clone(res.data.bookmarked_genes));


    } catch (e) {
      console.log("Failed to fetch user Info.", e);
    }
  };

  useEffect(() => {
    handleFetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/genes_some`, {
      // Data to be sent to the server
      genes_request_list: clone(bookmarkedGenes)
    }, { 'content-type': 'application/json' }).then((response) => {
      console.log("post has been sent");
      console.log(response.data);

      let copy_resp_data = clone(response.data);

      for (let i = 0; i < copy_resp_data.length; i++) {
        if (copy_resp_data[i] === null) {
          copy_resp_data.splice(i, 1);
          i = i - 1;
        }
      }

      if (copy_resp_data && copy_resp_data.length === 1 && copy_resp_data[0] == null) {
        setGenesList([]);
      } else {
        setGenesList(copy_resp_data);
      }

    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarkedGenes]);

  useEffect(() => {

    function createGeneListGroups() {
      var num_genes = genes_list.length;
      var num_groups = Math.floor(num_genes / 6);
      var last_group_num_genes = num_genes % 6;

      if (num_genes === 0) {
        return []
      }

      if (last_group_num_genes > 0) {
        num_groups = num_groups + 1
      }

      var groups_list = [];
      for (let index = 0; index < num_groups; index++) {
        const start_gene_index = index * 6;
        let end_gene_index = start_gene_index + 6;
        if ((index + 1) === num_groups && num_genes % 6 > 0) {
          end_gene_index = start_gene_index + last_group_num_genes;
        }

        let cur_group = [];
        for (let j = start_gene_index; j < end_gene_index; j++) {
          cur_group.push(genes_list[j]);
        }
        groups_list.push(cur_group);
      }

      return groups_list;
    }

    setGroupings(createGeneListGroups());
  }, [genes_list]);

  return (
    <div>
      {genes_list.length > 0 ? <SliderGeneItemsContainer gene_groups_list={groupings} /> : <></>}
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

/*
axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/gene/all/`)
*/