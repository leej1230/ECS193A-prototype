import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./home.css";

import "./components/bootstrap_gene_page/css/sb-admin-2.min.css";
import "./components/bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";

import { icon } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

const user_post_url = `${process.env.REACT_APP_BACKEND_URL}/api/registration`;


function Home() {

  const { user } = useAuth0();
  const userMetadata = user?.['https://unique.app.com/user_metadata'];

  const [gene_count, set_gene_count] = useState(0);
  const [dataset_count, set_dataset_count] = useState(0);
  const [height_link_cards, set_height_link_cards] = useState('300px');


  const getCountInfo = async () => {
    console.log("count information: ")
    const gene_count_url = `${process.env.REACT_APP_BACKEND_URL}/api/gene_count`
    const dataset_count_url = `${process.env.REACT_APP_BACKEND_URL}/api/dataset_count`

    let res = await axios.get(gene_count_url);
    set_gene_count(parseInt(res.data.count))
    console.log("line 39 gene count total: ", parseInt(res.data.count))

    res = await axios.get(dataset_count_url)
    set_dataset_count(parseInt(res.data.count))
    console.log("line 44 dataset count total: ", parseInt(res.data.count))

  }

  const handleUserSubmit = async () => {

    const email = user.email
    const first_name = userMetadata.given_name
    const last_name = userMetadata.family_name
    // ONLY STORE USER UID part
    const auth0_uid = user.sub.split("|")[1];

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

  useEffect(() => {
    getCountInfo();
    handleUserSubmit();
  }, []);

  return (
    <body id="page-top">
      <div id="wrapper">

        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">

            <div className="container-fluid" id="home_page_full">
              <SideNav id="side_navigation_menu"
                onSelect={(selected) => {
                  // Add your code here
                }}>
                <SideNav.Toggle />
                <SideNav.Nav defaultSelected="home">
                  <NavItem eventKey="home">
                    <NavIcon>
                      <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em', color: 'white' }} />
                    </NavIcon>
                    <NavText style={{ color: 'white' }}>
                      <a href="/console" style={{ textDecoration: 'None' }}>Home</a>
                    </NavText>
                  </NavItem>
                  <NavItem eventKey="search_gene">
                    <NavIcon >
                      <FontAwesomeIcon id="gene_icon" icon={icon({ name: 'dna', style: 'solid' })} />
                    </NavIcon>
                    <NavText style={{ color: 'white' }}>
                      <a href="/search_genes_page" style={{ textDecoration: 'None' }}>Gene Search</a>
                    </NavText>
                  </NavItem>
                  <NavItem eventKey="search_dataset">
                    <NavIcon >
                      <FontAwesomeIcon id="dataset_search_icon" icon={icon({ name: 'file', style: 'solid' })} />
                    </NavIcon>
                    <NavText style={{ color: 'white' }}>
                      <a href="/search_datasets_page" style={{ textDecoration: 'None' }}>Dataset Search</a>
                    </NavText>
                  </NavItem>
                </SideNav.Nav>
              </SideNav>
              <div className="row justify-content-end">
                <div className="col-md-12 bg-light text-right mr-5 mt-5">
                  <a
                    href="/upload"
                    className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                  >
                    <i className="fas fa-upload fa-sm text-white-50"></i>Upload
                  </a>
                </div>
              </div>

              <div className="row justify-content-center">
                <h3 className="h3 mb-5 text-gray-800">Human Genomics Search</h3>
              </div>

              <div className="row justify-content-center">
                <h3 className="h5 mb-4 text-gray-800">Welcome! You can search genes or datasets. </h3>
              </div>

              <div style={{ minWidth: '100%', left: 0, marginLeft: '40px', marginBottom: '40px', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', minWidth: '70%', maxWidth: '70%' }}>
                  <div className="justify-content-center" style={{ minWidth: '100%', maxWidth: '100%', display: 'flex' }}>

                    <div className="col" style={{ display: 'inline' }}>
                      <div className="card border-left-success shadow">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col">
                              <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                Total Genes Count</div>
                              <div className="h5 mb-0 font-weight-bold text-gray-800">{gene_count}</div>
                            </div>
                            <div className="col-auto">
                              <FontAwesomeIcon icon={icon({ name: 'dna', style: 'solid' })} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col" style={{ display: 'inline' }}>
                      <div className="card border-left-success shadow">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col">
                              <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                Total Datasets Count</div>
                              <div className="h5 mb-0 font-weight-bold text-gray-800">{dataset_count}</div>
                            </div>
                            <div className="col-auto">
                              <FontAwesomeIcon icon={icon({ name: 'file', style: 'solid' })} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div style={{ minWidth: '100%', minHeight: `${height_link_cards}`, maxHeight: `${height_link_cards}`, left: 0, marginLeft: '40px', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', minWidth: '70%', maxWidth: '70%', minHeight: `${height_link_cards}`, maxHeight: `${height_link_cards}` }}>
                  <div className="justify-content-center" style={{ minWidth: '100%', maxWidth: '100%', display: 'flex', minHeight: `${height_link_cards}`, maxHeight: `${height_link_cards}` }}>

                    <div className="col" style={{ display: 'inline', maxWidth: '50%', minWidth: '50%', minHeight: '100%', maxHeight: '100%' }}>
                      <div className="card shadow" style={{ maxHeight: '100%', minHeight: '100%', overflow: 'hidden' }}>
                        <div className="card-body">
                          <a href="/search_genes_page">
                            Genes Search
                            <img src="https://www.ukri.org/wp-content/uploads/2022/02/MRC-180222-DNASequencingDataGenomicAnalysis-GettyImages-1293619871-735x490.jpg"
                              style={{ maxWidth: '100%', minWidth: '100%', minHeight: '100%', maxHeight: '100%' }}>
                            </img>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="col" style={{ display: 'inline', maxWidth: '50%', minWidth: '50%', minHeight: '100%', maxHeight: '100%' }}>
                      <div className="card shadow" style={{ maxHeight: '100%', minHeight: '100%', overflow: 'hidden' }}>
                        <div className="card-body">
                          <a href="/search_datasets_page">
                            Datasets Search
                            <img src="https://www.shutterstock.com/image-vector/abstract-business-chart-uptrend-line-260nw-593939270.jpg"
                              style={{ maxWidth: '100%', minWidth: '100%', minHeight: '100%', maxHeight: '100%' }}>
                            </img>
                          </a>
                        </div>
                      </div>
                    </div>

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

export default Home;

/*
https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/512x512/chart_line.png
*/