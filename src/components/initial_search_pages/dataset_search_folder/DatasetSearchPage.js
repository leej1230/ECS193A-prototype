import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import "./DatasetSearchPage.css";
import DatasetSampleList from "./DatasetSampleList";
import Slider from "./Slider";
import axios from "axios";
import "../../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "../../bootstrap_gene_page/css/sb-admin-2.min.css";

import { clone } from "ramda";

import DashboardSidebar from "../../dashboard_side/dashboardSidebar";

import '@trendmicro/react-sidenav/dist/react-sidenav.css';

function DatasetSearchPage() {
  const [searchResult, setSearchResult] = useState([]);
  //   Space so that user can run "blank" search
  const [searchInput, setSearchInput] = useState(" ");
  const [listPage, setListPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (isMounted) {
      handleSearch();
    } else {
      //handleUserSubmit();
      setIsMounted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listPage]);

  //   Url to search dataset by keywords: 'api/dataset_search/<str:search_word>/<str:page_id>'
  const handleSearch = async () => {
    try {
      let search_input_for_url = clone(searchInput)
      if (search_input_for_url === "") {
        search_input_for_url = " ";
      }
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL
        }/api/dataset_search/${search_input_for_url}/${listPage.toString()}`
      );
      setSearchResult(response.data);
      setHasSearched(true);
      console.log("dataset search line 56");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    console.log(listPage)
  };

  const handleIncrementPage = async () => {
    //console.log(user)
    setListPage(listPage + 1);
    // handleSearch();
    // console.log(listPage)
  }

  const handleDecrementPage = () => {
    if (listPage > 1) {
      setListPage(listPage - 1);
      // handleSearch();
    }
    // console.log(listPage)
  }

  return (
    <body id="page-top">
      <div id="wrapper">


        <div id="content-wrapper" class="d-flex flex-column">
          <div id="content">

            <div class="container-fluid" id="full_dataset_search_page">


              <DashboardSidebar input_cur_active={"search_dataset"} />

              <div id="dataset_search_page_content">

                <div id="control_buttons_dataset_search">
                  <a
                    href="/upload"
                    class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                  >
                    <i class="fas fa-upload fa-sm text-white-50"></i>Upload
                  </a>
                </div>

                <div id="title_box">
                  <h3 class="h3 text-gray-800">Dataset Search</h3>
                </div>

                <div className="search" id="dataset_search_input">
                  <TextField
                    id="input_text_box_dataset"
                    onChange={(e) => setSearchInput(e.target.value)}
                    variant="outlined"
                    fullWidth
                    label="Search by dataset name"
                  />

                  <button type="submit" onClick={handleSearch} class="btn btn-primary" id="search_dataset_button" aria-label="search">
                    <i class="fas fa-search"></i>
                  </button>
                </div>

                <div id="dataset_search_results_display_container">
                  <div class="card shadow" id="dataset_search_results_display">

                    <div>
                      <DatasetSampleList resultList={searchResult} />
                      {!hasSearched && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '100%', maxWidth: '100%' }}>
                          Start Searching!
                        </div>
                      )}
                      {hasSearched && searchResult.length === 0 && (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '100%', maxWidth: '100%' }}>
                            No results
                          </div>
                          {listPage > 1 ? <div className="float-left">
                            <button onClick={handleDecrementPage}>Prev Page</button>
                          </div> : <div></div>}
                        </div>
                      )}
                      {searchResult.length > 0 && (
                        <div>
                          {listPage > 1 ? <div className="float-left">
                            <button onClick={handleDecrementPage}>Prev Page</button>
                          </div> : <div></div>}
                          <div className="float-right">
                            <button onClick={handleIncrementPage}>Next Page</button>
                          </div>
                        </div>
                      )}
                    </div>


                  </div>
                </div>

                <div id="bookmarked_datasets_container" class="card">

                  <div class="card-header py-3" id="bookmark_datasets_card_header">
                    <h5 id="bookmark_datasets_card_header_text">Bookmarked Datasets</h5>
                  </div>
                  <div class="card-body" id="bookmark_datasets_card_body">
                    <Slider />
                  </div>

                </div>



              </div>


            </div>

          </div>
        </div>
      </div>

      <script src="../../bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
      <script src="../../bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

      <script src="../../bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>

      <script src="../../bootstrap_gene_page/js/sb-admin-2.min.js"></script>

      <script src="../../bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>

      <script src="../../bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
      <script src="../../bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>
    </body>
  );
}

export default DatasetSearchPage;

/*
<TextField
    value={searchFilter}
    label="Filter"
    select
    style={{ width: "10rem" }}
    onChange={(e) => {
      setSearchFilter(e.target.value);
    }}
  >
    <MenuItem value={"gene"}>Gene</MenuItem>
    <MenuItem value={"dataset"}>Dataset</MenuItem>
    <MenuItem value={"all"}>All</MenuItem>
  </TextField>
  */

/*
<IconButton
  type="submit"
  aria-label="search"
  onClick={handleSearch}
>
  <SearchIcon style={{ fill: "blue" }} />
</IconButton>
*/

/*
<div className="search-result">
                    <ul className="search-result">
                      <Slider />
                    </ul>
                  </div>
*/

/*

<div class="row justify-content-end">
                
              </div>

              <div class="row justify-content-center">
              
            

              <div className="row justify-content-center mt-5 mb-5">
                
              </div>

              <div className="row justify-content-center">
                
              </div>

  */