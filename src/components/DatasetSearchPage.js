import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { IconButton, Select, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./DatasetSearchPage.css";
import SampleList from "./SampleList";
import Slider from "./Slider";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "./bootstrap_gene_page/css/sb-admin-2.min.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
const user_post_url = `${process.env.REACT_APP_BACKEND_URL}/api/registration`;

function DatasetSearchPage() {
  const [searchResult, setSearchResult] = useState([]);
  //   Space so that user can run "blank" search
  const [searchInput, setSearchInput] = useState(" ");
  const [searchFilter, setSearchFilter] = useState("gene");
  const [listPage, setListPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { user } = useAuth0();
  const userMetadata = user?.['https://unique.app.com/user_metadata'];

  useEffect(() => {
    if (isMounted) {
      handleSearch();
    } else {
      //handleUserSubmit();
      setIsMounted(true);
    }
  }, [listPage]);

  //   Url to search gene by keywords: 'api/gene/search/<str:search_word>/<str:page_id>'
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL
        }/api/${searchFilter}/search/${searchInput}/${listPage.toString()}`
      );
      setSearchResult(response.data);
      setHasSearched(true);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    console.log(listPage)
  };

  const handleIncrementPage = async () => {
    console.log(user)
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

  const handleUserSubmit = async () => {

    const email = user.email
    const first_name = userMetadata.given_name
    const last_name = userMetadata.family_name
    const auth0_uid = user.sub

    const formData = new FormData();
    formData.append("email", email);
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("auth0_uid", auth0_uid);

    axios
      .post(user_post_url, formData)
      .then(() => {
        console.log("Account information successfully submitted on backend.");
      })
      .catch((error) => {
        if (error.response.status === 409) {
          console.log("Account informaiton already registered in DB. No update needed.")
        }
      });
  };

  return (
    <body id="page-top">
      <div id="wrapper">
        

        <div id="content-wrapper" class="d-flex flex-column">
          <div id="content">
            
            <div class="container-fluid" id="full_dataset_search_page">
                <SideNav id="side_navigation_menu"
                  onSelect={(selected) => {
                      // Add your code here
                  }}>
                  <SideNav.Toggle />
                    <SideNav.Nav defaultSelected="search_dataset">
                        <NavItem eventKey="home">
                            <NavIcon>
                                <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em', color: 'white' }} />
                            </NavIcon>
                            <NavText style={{ color: 'white' }}>
                              <a href="/console" style={{textDecoration: 'None'}}>Home</a>
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="search_gene">
                            <NavIcon >
                                <FontAwesomeIcon id="gene_icon" icon={icon({name: 'dna', style: 'solid' })} />
                            </NavIcon>
                            <NavText style={{ color: 'white' }}>
                                <a href="/search_genes_page" style={{textDecoration: 'None'}}>Gene Search</a>
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="search_dataset" href="/search_datasets_page">
                            <NavIcon >
                                <FontAwesomeIcon id="dataset_search_icon" icon={icon({name: 'file', style: 'solid' })} />
                            </NavIcon>
                            <NavText style={{ color: 'white' }}>
                                Dataset Search
                            </NavText>
                        </NavItem>
                    </SideNav.Nav>
                  </SideNav>
                  
              
              <div id="dataset_search_page_content">

                <div  id="control_buttons_dataset_search">
                  <a
                    href="/upload"
                    class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                  >
                    <i class="fas fa-upload fa-sm text-white-50"></i>Upload
                  </a>
                </div>

                <div id="title_box">
                  <h3 class="h3 mb-5 text-gray-800">Dataset Search</h3>
                </div>

                <div className="search" id="dataset_search_input">
                  <TextField
                    id="input_text_box_dataset"
                    onChange={(e) => setSearchInput(e.target.value)}
                    variant="outlined"
                    fullWidth
                    label="Search by gene names or dataset name"
                  />

                  <button type="submit" onClick={handleSearch} class="btn btn-primary" id="search_dataset_button" aria-label="search">
                    <i  class="fas fa-search"></i>
                  </button>
                </div>

                <div id="dataset_search_results_display_container">
                  <div class="card shadow" id="dataset_search_results_display">
                    <div class="card-header py-3">
                      <div>
                        <SampleList resultList={searchResult} />
                        {!hasSearched && (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            Start Searching!
                          </div>
                        )}
                        {hasSearched && searchResult.length === 0 && (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            No results
                          </div>
                        )}
                      </div>
                      {searchResult.length > 0 && (
                        <div>
                          <div className="float-left">
                            <button onClick={handleDecrementPage}>Prev Page</button>
                          </div>
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