import React, { useEffect, useState } from 'react';
import "./DatasetPage.css";
import { Box, Card , CardContent, CircularProgress, CardActions, Typography, Button, Table, TableRow, TableCell, TableContainer, TableBody, Paper } from '@mui/material';

import { Link } from 'react-router-dom';
import axios from 'axios';
import Dataset from "./Dataset"

import ScrollBars from "react-custom-scrollbars";

//import { useTable } from "react-table";
import MaterialTable from 'material-table';

import { useNavigate } from 'react-router-dom';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "./bootstrap_gene_page/css/sb-admin-2.min.css";

const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: FilterList,
  FirstPage: FirstPage,
  LastPage: LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: Clear,
  Search: Search,
  SortArrow: ArrowUpward,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn
};

function clickMe() {
  alert("You clicked me!");
}

function DatasetPage() {
  const [dataset, setDataset] = useState({ "name": "None", "gene_ids": "0", "patient_ids": "0" });
  const [DATASET_ID, setDATASET_ID] = useState(window.location.pathname.split("/").at(-1));
  const [datasetTableInputFormat, setDatasetTableInputFormat] = useState([]);
  const [geneIds, setGeneIds] = useState([]);
  const [patientIds, setPatientIds] = useState([]);
  const columns = [
    { title: "Field Name", field: "field_name" },
    { title: "Value", field: "value" }
  ];

  

  useEffect(() => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/dataset/${DATASET_ID}`;
    axios.get(url).then((result) => {
      setDataset(result.data);
    });
  }, [DATASET_ID]);

  useEffect(() => {
    setDatasetTableInputFormat(createDatasetFormatted());
    setGeneIds(saveGeneIdArray());
    setPatientIds(savePatientIdArray());
  }, [dataset]);

  const createDatasetFormatted = () => {
    // return dataset formatted for table
    const initArr = [];
    const dataInput = dataset;
    Object.keys(dataInput).forEach((key) => {
      if (key !== "gene_ids" && key !== "patient_ids") {
        const valInput = dataInput[key];
        if (key === "url") {
          initArr.push({
            field_name: key,
            value: (
              <a href={valInput} target="_blank" rel="noopener noreferrer">
                {" "}
                {valInput}{" "}
              </a>
            ),
          });
        } else {
          initArr.push({ field_name: key, value: valInput });
        }
      }
    });

    return initArr;
  };

  const saveGeneIdArray = () => {
    const dataInput = dataset;
    return dataInput["gene_ids"]["arr"];
  };

  const savePatientIdArray = () => {
    const dataInput = dataset;
    return dataInput["patient_ids"]["arr"];
  };

  const navigate = useNavigate();

  return (


    <body id="page-top">

  <div id="wrapper">

  <div id="content-wrapper" class="d-flex flex-column">


      <div id="content">

          <div class="container-fluid">

              <div class="d-sm-flex align-items-center justify-content-between mb-4 mt-5">
                  <h1 class="h1 mb-0 text-gray-800">
                    {dataset["name"]}
                  </h1>
                  <div>
                  <a href="#" class="d-none d-sm-inline-block btn btn-sm btn btn-info shadow-sm mr-1"><i
                            class="fas fa-sm text-white-50"></i>Update</a>
                    <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-1"><i
                            class="fas fa-download fa-sm text-white-50"></i>Generate</a>
                    <button class="d-none d-sm-inline-block btn btn-sm btn btn-danger shadow-sm mr-1" onClick = {() => {
                            //axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/delete_dataset/${DATASET_ID}`)
                            navigate('/');

                          }} >
                          <i class="fas fa-sm text-white-50"></i>
                          Delete
                      </button>
                  </div>
              </div>

              <div class="row">

                <div class="col-xl-3 col-md-6 mb-4">
                  <div class="card shadow mb-4 border-left-primary">
                      <div class="card-body">
                          <div class="row no-gutters align-items-center">
                              <div class="col mr-2">
                                  <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Last Updated</div>
                                  <div class="text-xs mb-0 text-gray-800">01-03-2023</div>
                              </div>
                              <div class="col-auto">
                                  <i class="fas fa-calendar text-gray-300"></i>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>


                <div class="col-xl-8 col-lg-7">
                      <div class="card shadow mb-4">
                          <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                              <h5 class="m-0 font-weight-bold text-primary">Description</h5>
                          </div>
                          <div class="card-body">
                            <p>{dataset["description"]}</p> 
                          </div>
                      </div>
                  </div>
              </div>

              <div class="row">

                  <div class="col-xl-6 col-lg-5">

                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary">Basic Dataset Information</h6>
                        </div>
                        <div class="card-body">
                        {datasetTableInputFormat.length>3 ? (
                          <div>
                            {
                              <MaterialTable columns={columns} 
                              data={datasetTableInputFormat}
                              icons={tableIcons}
                              options={{
                                paging: false,
                                showTitle: false
                              }}
                              />
                            }
                          </div>
                          ):(
                            <div>
                              <CircularProgress />
                            </div>
                          )
                        }
                        </div>
                    </div>
                  </div>

                  <div class="card shadow mb-4">
                  <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Dataset View</h6>
                  </div>
                  <div class="card-body">
                      {geneIds? (
                      <div>
                        {
                          geneIds.map( (id) =>
                          <li><a href={'/gene/' + id + '/1'}> {id} </a></li>
                          )
                        }
                      </div>
                      ):(
                        <div>
                          <CircularProgress />
                        </div>
                      )
                    }
                  </div>
                </div>
           
                  <div class="col-lg-3 mb-4">
                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary">Dataset Stats</h6>
                        </div>
                        <div class="card-body">
                          <p>Number of Genes: </p>
                          <p>Number of Patients: </p>
                          <p>Number of Missing Cells: </p>
                        </div>
                    </div>
                 

             
                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary">Related Datasets</h6>
                        </div>
                        <div class="card-body">
                            <p>Dataset 1</p>
                            <p>Dataset 2</p>
                            <p>Dataset 3</p>
                        </div>
                    </div>
                  </div>
              

              </div>

          </div> 

      </div>

    </div>

  </div>

  <footer class="sticky-footer bg-white">
  <div class="container my-auto">
      <div class="copyright text-center my-auto">
          <span>Copyright &copy; Your Website 2021</span>
      </div>
  </div>
  </footer>

  <script src="./bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
  <script src="./bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <script src="./bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>

  <script src="./bootstrap_gene_page/js/sb-admin-2.min.js"></script>

  <script src="./bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>

  <script src="./bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
  <script src="./bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>

  </body>
  )
}

export default DatasetPage;