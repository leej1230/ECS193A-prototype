import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import "./DatasetSearchPage.css";
import Slider from "./Slider";
import axios from "axios";
import "../../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "../../bootstrap_gene_page/css/sb-admin-2.min.css";

import { clone } from "ramda";

import DashboardSidebar from "../../dashboard_side/dashboardSidebar";

import DatasetSearchResultsHolder from "./DatasetSearchResultsHolder";

import '@trendmicro/react-sidenav/dist/react-sidenav.css';

function DatasetSearchPage() {
  //   Space so that user can run "blank" search
  const [searchInput, setSearchInput] = useState(" ");
  const [clickedSearch, setClickedSearch] = useState(false);

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

                  <button type="submit"  onClick={ (e) => { setClickedSearch(true) }} class="btn btn-primary" id="search_dataset_button" aria-label="search">
                    <i class="fas fa-search"></i>
                  </button>
                </div>

                <div id="dataset_search_results_display_container">
                  <div class="card shadow" id="dataset_search_results_display">

                    <DatasetSearchResultsHolder input_search_keyword={searchInput} performSearch={clickedSearch} setPerformSearch={setClickedSearch} />


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

  
  /*

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
  */