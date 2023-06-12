import React, { useEffect, useState } from 'react';
import "./DatasetPage.css";
import { Box, Card , CardContent, CircularProgress, CardActions, Typography, Button, Table, TableRow, TableCell, TableContainer, TableBody, Paper } from '@mui/material';

import { Link } from 'react-router-dom';
import axios from 'axios';
import Dataset from "./Dataset"

import ScrollBars from "react-custom-scrollbars";

//import { useTable } from "react-table";
import MaterialTable from 'material-table';

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

export default class DatasetPage extends React.Component {

     state = {
        dataset: {"name": "None", "gene_ids": "0", "patient_ids": "0" },
        DATASET_ID : window.location.pathname.split("/").at(-1),
        dataset_table_input_format: []
      }
    
    columns = [ 
      {title: "Field Name" , field: "field_name"},
      {title: "Value" , field: "value"}
    ]

    
    componentDidMount() {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/dataset/${this.state.DATASET_ID}`;
      axios.get(url)
      .then(result => {
        this.setState({
          dataset : result.data
        })
        
      }).then(  
        () =>{
          this.setState({
            dataset_table_input_format : this.createDatasetFormatted(),
            gene_ids : this.saveGeneIdArray(),
            patient_ids : this.savePatientIdArray(),
          })
        }
      )
    }

    createDatasetFormatted() {
      // return dataset formatted for table
      var init_arr = [];
      var data_input = this.state.dataset;
      Object.keys(data_input).forEach(function(key) {
        //console.log('Key : ' + key + ', Value : ' + this.state.dataset_table_input_format[key])
        //init_arr.push( {field_name: key , value: this.state.dataset[key] } )

        // Avoid showing list of ids
        if (key !== "gene_ids" && key !== "patient_ids"){
          var val_input = data_input[key]
          if (key === "url"){
            init_arr.push( {field_name: key , value: <a href={val_input}> {val_input} </a> } )
          }else{
            init_arr.push( {field_name: key , value: val_input } )
          }
        }
      });

      console.log( init_arr )

      return init_arr;
    }

    saveGeneIdArray() {
      var data_input = this.state.dataset;
      return data_input["gene_ids"]["arr"]
    }

    savePatientIdArray() {
      var data_input = this.state.dataset;
      return data_input["patient_ids"]["arr"]
    }  
     
    render(){
        //console.log(this.state.dataset)
      return (


        <body id="page-top">

      <div id="wrapper">

      <div id="content-wrapper" class="d-flex flex-column">


          <div id="content">

              <div class="container-fluid">

                  <div class="d-sm-flex align-items-center justify-content-between mb-4 mt-5">
                      <h1 class="h1 mb-0 text-gray-800">
                        {this.state.dataset["name"]}
                      </h1>
                      <div>
                      <a href="#" class="d-none d-sm-inline-block btn btn-sm btn btn-info shadow-sm mr-1"><i
                                class="fas fa-sm text-white-50"></i>Update</a>
                        <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-1"><i
                                class="fas fa-download fa-sm text-white-50"></i>Generate</a>
                        <a href="#" class="d-none d-sm-inline-block btn btn-sm btn btn-danger shadow-sm mr-1"><i
                                class="fas fa-sm text-white-50"></i>Delete</a>
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
                                <p>{this.state.dataset["description"]}</p> 
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
                            {this.state.dataset_table_input_format.length>3 ? (
                              <div>
                                {
                                  <MaterialTable columns={this.columns} 
                                  data={this.state.dataset_table_input_format}
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
                          {this.state.gene_ids ? (
                          <div>
                            {
                              this.state.gene_ids.map( (id) =>
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
}