import React, { useEffect, useState, useRef } from 'react';
import "./DatasetPage.css";

import axios from 'axios';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import { useNavigate } from 'react-router-dom';

import {clone} from "ramda";

import { CircularProgress } from '@mui/material';

import LoadingSpinner from "../spinner/spinner";

import "../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "../bootstrap_gene_page/css/sb-admin-2.min.css";

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { useAuth0 } from '@auth0/auth0-react';


import DatasetNameHolder from './DatasetNameHolder';
import DatasetBasicInfo from './DatasetBasicInfo';
import DatasetGenesListTable from './DatasetGenesListTable';
import DatasetEditTable from './DatasetEditTable'
import DatasetChangeUndo from './DatasetChangeUndo';

function DatasetPage() {
  const [dataset, setDataset] = useState({  gene_ids: "0", patient_ids: "0" });
  const [DATASET_ID, setDATASET_ID] = useState(window.location.pathname.split("/").at(-1));
  const [datasetTableInputFormat, setDatasetTableInputFormat] = useState([]);
  const [geneIds, setGeneIds] = useState([]);
  const [patientIds, setPatientIds] = useState([]);
  const [together_patient_gene_information, set_together_patient_gene_information] = useState([
    {patient_id: "", age: 0, diabete: "", final_diagnosis: "", gender: "", hypercholesterolemia: "", hypertension: "", race: "", ENSG: 3.2}
  ]);
  const [patient_information, set_patient_information] = useState([
    {patient_id: "", age: 0, diabete: "", final_diagnosis: "", gender: "", hypercholesterolemia: "", hypertension: "", race: ""}
  ]);
  const [gene_with_value_information, set_gene_with_value_information] = useState([
    {id: 1 , name: "", dataset_id: 0, patient_ids: {arr: []}, gene_values: {arr: []}}
  ]);

  const [gene_information_expanded, setGene_information_expanded] = useState([{'id':0,'gene_id': "NONE"}]);
  const [displayHistoryTable, setDisplayHistoryTable] = useState(false);

  const [gotPatientInfo, set_gotPatientInfo] = useState(false)
  const [gotGeneInfo, set_gotGeneInfo] = useState(true);

    const { user } = useAuth0();

  useEffect(() => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/dataset/${DATASET_ID}`;
    axios.get(url).then((result) => {
      setDataset(result.data);
    });
  }, [DATASET_ID]);

  useEffect(() => {
    // get all patients of a dataset
    const patients_url = `${process.env.REACT_APP_BACKEND_URL}/api/patients_in_dataset/${DATASET_ID}`;
    // patient_information
    axios.get(patients_url).then((result) => {
      set_patient_information(result.data);
      set_gotPatientInfo(true);
    });
  }, [DATASET_ID])

  useEffect(() => {
    const gene_full_url = `${process.env.REACT_APP_BACKEND_URL}/api/genes_in_dataset/${DATASET_ID}`;
    
    axios.get(gene_full_url).then((result) => {
      set_gene_with_value_information(result.data);
      set_gotGeneInfo(true);
    })
  },  [DATASET_ID])

  useEffect(() => {

    const setTogetherData = () => {
      let combined_patients_gene_data = get_combined_patients_genes_data();
      set_together_patient_gene_information(combined_patients_gene_data);
      // need to use "let" to make copy or else same object in both states will lead change in one to affect other
      //let copy_obj =  clone(combined_patients_gene_data);

    }
    

    setTogetherData();

  }, [gotGeneInfo, gotPatientInfo, gene_with_value_information, patient_information]);

    useEffect(() => {
        setDatasetTableInputFormat(createDatasetFormatted());
        setGeneIds(saveGeneIdArray());
        setPatientIds(savePatientIdArray());
    }, [dataset]);

  useEffect(() => {
    let object_information = generateGeneObjs(geneIds);
    setGene_information_expanded(object_information);
  }, [geneIds])

    const createDatasetFormatted = () => {
        // return dataset formatted for table
        const initArr = [];
        const dataInput = dataset;

        console.log("in the process of creating a formatted dataset")
        console.log(dataset)

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

    const get_combined_patients_genes_data = () => {
        let combined_dataset_full_information = []

        if(!(gotPatientInfo && gotGeneInfo)){
          // not set yet
          return [
              { patient_id: "", age: 0, diabete: "", final_diagnosis: "", gender: "", hypercholesterolemia: "", hypertension: "", race: "", ENSG: 3.2 }
          ]
        }

        // find if row is genes or row is patients
        if( (patient_information.length == 1 && patient_information[0]["patient_id"] == "") || patient_information.length == 0 ){
          // rows are genes

          for (let i = 0; i < gene_with_value_information.length; i++) {
              let existing_gene_info = clone(gene_with_value_information[i]);

              let gene_patient_subset_values = {};

              if( gene_with_value_information[i]["patient_ids"] && gene_with_value_information[i]["patient_ids"]["arr"] ){

                let temp_patient_arr = gene_with_value_information[i]["patient_ids"]["arr"]

                for (let j = 0; j < temp_patient_arr.length; j++) {

                  gene_patient_subset_values[temp_patient_arr[j]] = parseFloat(gene_with_value_information[i]["gene_values"]["arr"][j]);
                }
              }
              
              combined_dataset_full_information.push({ ...existing_gene_info, ...gene_patient_subset_values })
          }
        } else {
          // patients are rows
          for (let i = 0; i < patient_information.length; i++) {
              let existing_patient_info = clone(patient_information[i]);

              let gene_patient_subset_values = {};

              for (let j = 0; j < gene_with_value_information.length; j++) {

                  let patient_index = gene_with_value_information[j]["patient_ids"]["arr"].indexOf(existing_patient_info["patient_id"])

                  gene_patient_subset_values[gene_with_value_information[j]["name"]] = parseFloat(gene_with_value_information[j]["gene_values"]["arr"][patient_index]);
              }
              combined_dataset_full_information.push({ ...existing_patient_info, ...gene_patient_subset_values })
          }

        }

        console.log("inside the combined info function")
        console.log(gene_with_value_information)
        console.log( combined_dataset_full_information );

        return combined_dataset_full_information;

    }

    const saveGeneIdArray = () => {
        const dataInput = dataset;
        if(dataInput && dataInput["gene_ids"]){
          return dataInput["gene_ids"]["arr"];
        }
        return []
    };


  const savePatientIdArray = () => {
    const dataInput = dataset;
    if(dataInput && dataInput["patient_ids"]){
      return dataInput["patient_ids"]["arr"];
    }
    return []
  };

  const navigate = useNavigate();


  const generateGeneObjs = (gene_ids_info) => {
    if(gene_ids_info == null || gene_ids_info.length == 0){
      return [{'id':0,'gene_id': "NONE"}];
    }

    //console.log(gene_ids_info)

    let gene_objs = []

    for(let i = 0; i < gene_ids_info.length; i++){
      gene_objs.push({'id': i+1, 'gene_id': gene_ids_info[i]})
    }

    //console.log("gene obj:")
    //console.log(gene_objs)

    return gene_objs;
  }

  return !dataset["name"] ? (
    <body id="page-top" >

        <div id="wrapper">

            <div id="content-wrapper" class="d-flex flex-column">


                <div id="content">
                            <div id="loading_element">
                                <LoadingSpinner />
                            </div>
             
                </div>
            </div>
        </div>
    </body>
  ) : (

    <body id="page-top" >

      <div id="wrapper">

      <div id="content-wrapper" class="d-flex flex-column">


      <div id="content">

          <div class="container-fluid" id="dataset_full_page" >
              <div  id="control_buttons_dataset">
                  <div>
                    <a href="/update/dataset" class="d-none d-sm-inline-block btn btn-sm btn btn-info shadow-sm mr-1"><i
                              class="fas fa-sm text-white-50"></i>Update</a>
                      <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-1"><i
                              class="fas fa-download fa-sm text-white-50"></i>Generate</a>
                        <button class="d-none d-sm-inline-block btn btn-sm btn btn-danger shadow-sm mr-1" onClick = {() => {
                              
                              axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/delete_dataset/${DATASET_ID}`);
                        
                              navigate('/');

                            }} >
                            <i class="fas fa-sm text-white-50"></i>
                            Delete
                        </button>
                  </div>

              </div>

              <DatasetNameHolder input_dataset_id={DATASET_ID} input_dataset={dataset} />

              <div class="container-fluid" id="tabs_container" >
                  <Tabs
                      defaultActiveKey="basic_info"
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab eventKey="basic_info" title="Basic Info">
                          <DatasetBasicInfo input_datasetTableInputFormat={datasetTableInputFormat} input_dataset={dataset}/>
                      </Tab>
                      <Tab eventKey="genes_list" title="Genes List">
                        <DatasetGenesListTable input_expanded_gene_info={gene_information_expanded} />
                      </Tab>
                      <Tab eventKey="edit_dataset" title="Edit Dataset">
                          <DatasetEditTable input_dataset_id={DATASET_ID} row_type={gotPatientInfo && gotGeneInfo && ( (patient_information.length == 1 && patient_information[0]["patient_id"] == "") || patient_information.length == 0 ) ? "gene_rows" : "patient_rows"} input_together_patient_gene_information={together_patient_gene_information} input_set_together_patient_gene_information={set_together_patient_gene_information} input_displayHistoryTable={displayHistoryTable} input_set_displayHistoryTable={setDisplayHistoryTable} />
                          <DatasetChangeUndo input_dataset_id={DATASET_ID} row_type={gotPatientInfo && gotGeneInfo && ( (patient_information.length == 1 && patient_information[0]["patient_id"] == "") || patient_information.length == 0 ) ? "gene_rows" : "patient_rows"} input_displayHistoryTable={displayHistoryTable} />
                      </Tab>
                    </Tabs>
              </div>
            </div>
           </div>
          </div>
         </div>

            <script src="../bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
            <script src="../bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>


            <script src="../bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>

            <script src="../bootstrap_gene_page/js/sb-admin-2.min.js"></script>

            <script src="../bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>

            <script src="../bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
            <script src="../bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>

        </body>

      )
}

export default DatasetPage;

/*
const get_combined_patients_genes_data = () => {
        let combined_dataset_full_information = []

        if (patient_information.length == 1 && patient_information[0]["patient_id"] == "") {
            // not set yet
            return [
                { patient_id: "", age: 0, diabete: "", final_diagnosis: "", gender: "", hypercholesterolemia: "", hypertension: "", race: "", ENSG: 3.2 }
            ]
        }

        for (let i = 0; i < patient_information.length; i++) {
            let existing_patient_info = clone(patient_information[i]);

            let gene_patient_subset_values = {};

            for (let j = 0; j < gene_with_value_information.length; j++) {

                let patient_index = gene_with_value_information[j]["patient_ids"]["arr"].indexOf(existing_patient_info["patient_id"])

                gene_patient_subset_values[gene_with_value_information[j]["name"]] = parseFloat(gene_with_value_information[j]["gene_values"]["arr"][patient_index]);
            }
            combined_dataset_full_information.push({ ...existing_patient_info, ...gene_patient_subset_values })
        }


        //console.log( combined_dataset_full_information );

        return combined_dataset_full_information;

    }
*/