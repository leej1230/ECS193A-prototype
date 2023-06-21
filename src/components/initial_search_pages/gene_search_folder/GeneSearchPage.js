import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import "./GeneSearchPage.css";

import SliderGene from "./SliderGene";

import DashboardSidebar from "../../dashboard_side/dashboardSidebar";
import GeneSearchResultsHolder from "./GeneSearchResultsHolder";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import {default as SelectDropDown} from "react-select";

import "../../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "../../bootstrap_gene_page/css/sb-admin-2.min.css";

const options_select = [{value: "Gene Name", label: "Gene Name"},{value: "Other Name", label: "Other Name"}]

function GeneSearchPage() {
  
  //   Space so that user can run "blank" search
  const [searchInput, setSearchInput] = useState(" ");
  const [clickedSearch, setClickedSearch] = useState(false);

  const [search_type, set_search_type] = useState({value: "Gene Name", label: "Gene Name"})
  const [ searchType , setSearchType ] = useState("Gene Name");

  const handleSelect = async (input_select_obj) => {
    set_search_type( input_select_obj )
  };

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

                <div className='SearchType search_type_select'>
                  <FormControl margin='dense' fullWidth id="search_type_form">
                    <InputLabel id="SearchTypeLabel">Search By</InputLabel>
                    <Select
                      labelId="SearchTypeLabel"
                      id="SearchTypeSelect"
                      className="select_dropdown_search_type"
                      value={searchType }
                      label="SearchType"
                      onChange={(e) => { setSearchType(e.target.value) }}
                    >
                      <MenuItem value={'Gene Name'}>Gene Name</MenuItem>
                      <MenuItem value={'Other Name'}>Other Name</MenuItem>
                    </Select>
                  </FormControl>
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

                  <button type="submit" onClick={ (e) => { setClickedSearch(true) }} class="btn btn-primary" id="search_gene_button" aria-label="search">
                    <i class="fas fa-search"></i>
                  </button>
                </div>

                <div id="gene_search_results_display_container">
                  <div class="card shadow" id="gene_search_results_display">

                    <GeneSearchResultsHolder input_search_keyword={searchInput} performSearch={clickedSearch} setPerformSearch={setClickedSearch} />

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

export default GeneSearchPage;