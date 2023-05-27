import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import "./GeneSearchPage.css";
import SampleList from "./SampleList";
import SliderGene from "./SliderGene";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

import DashboardSidebar from "./dashboardSidebar";

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "./bootstrap_gene_page/css/sb-admin-2.min.css";

import {clone} from "ramda";

function GeneSearchPage() {
  const [searchResult, setSearchResult] = useState([]);
  //   Space so that user can run "blank" search
  const [searchInput, setSearchInput] = useState(" ");
  const [listPage, setListPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { user } = useAuth0();

  useEffect(() => {
    if (isMounted) {
      handleSearch();
    } else {
      setIsMounted(true);
    }
  }, [listPage]);

  //   Url to search gene by keywords: 'api/gene/search/<str:search_word>/<str:page_id>'
  const handleSearch = async () => {
    try {
      let search_input_for_url = clone(searchInput)
      if( search_input_for_url === "" ){
        search_input_for_url = " ";
      }
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL
        }/api/gene_search/${search_input_for_url}/${listPage.toString()}`
      );
      setSearchResult(response.data);

      console.log("search gene results: ")
      console.log(response.data)

      setHasSearched(true);
    } catch (error) {
      console.error(error);
    }
    console.log(listPage)
  };

  const handleIncrementPage = async () => {
    console.log(user)
    setListPage(listPage + 1);
    handleSearch();
    // console.log(listPage)
  }

  const handleDecrementPage = () => {
    if (listPage > 1) {
      setListPage(listPage - 1);
      handleSearch();
    }
    // console.log(listPage)
  }

  return (
    <body id="page-top">
      <div id="wrapper">
        

        <div id="content-wrapper" class="d-flex flex-column">
          <div id="content">
            
            <div class="container-fluid" id="full_gene_search_page">
              
                <DashboardSidebar input_cur_active={"search_gene"} />
              
              <div id="gene_search_page_content">

                <div id="title_box_gene_search">
                  <h3 class="h3 text-gray-800">Gene Search</h3>
                </div>

                <div className="search" id="gene_search_input">
                  <TextField
                    id="input_text_box_gene"
                    onChange={(e) => setSearchInput(e.target.value)}
                    variant="outlined"
                    fullWidth
                    fullHeight
                    label="Search by gene names or dataset name"
                  />

                  <button type="submit" onClick={handleSearch} class="btn btn-primary" id="search_gene_button" aria-label="search">
                    <i  class="fas fa-search"></i>
                  </button>
                </div>

                <div id="gene_search_results_display_container">
                  <div class="card shadow" id="gene_search_results_display">
                    
                        <SampleList resultList={searchResult} />
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
                            { listPage > 1 ? <div className="float-left">
                              <button onClick={handleDecrementPage}>Prev Page</button>
                            </div> : <div></div> }
                          </div>
                        )}
                        {searchResult.length > 0 && (
                        <div>
                          { listPage > 1 ? <div className="float-left">
                              <button onClick={handleDecrementPage}>Prev Page</button>
                            </div> : <div></div> }
                          <div className="float-right">
                            <button onClick={handleIncrementPage}>Next Page</button>
                          </div>
                        </div>
                      )}
                   
                  </div>
                </div>
       
                <div id="bookmarked_genes_container" class="card">
          
                  <div class="card-header py-3" id="bookmark_genes_card_header">
                    <h5 id="bookmark_genes_card_header_text">Bookmarked Genes</h5>
                  </div>
                  <div class="card-body" id="bookmark_genes_card_body">
                        <SliderGene />
                  </div>
                  
                </div>
             


              </div>


            </div>
          
        </div>
      </div>
    </div>

      <script src="./bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
      <script src="./bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

      <script src="./bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>

      <script src="./bootstrap_gene_page/js/sb-admin-2.min.js"></script>

      <script src="./bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>

      <script src="./bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
      <script src="./bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>
    </body>
  );
}

export default GeneSearchPage;