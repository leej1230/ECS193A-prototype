import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {  CircularProgress } from '@mui/material';
import "./GenePage.css";

import NameHeaderHolder from './NameHeaderHolder'
import BasicInfo from './BasicInfo'
import NumberFilter from './NumberFilter';
import GeneSequenceAnimation from './GeneSequenceAnimation';

import SampleGraph from './echartdemo';

//import { useTable } from "react-table";
//import MaterialTable from 'material-table';

import Multiselect from "multiselect-react-dropdown";
import filterFactory, { FILTER_TYPES, customFilter, textFilter,  Comparator } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "./bootstrap_gene_page/css/sb-admin-2.min.css"

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


function ProductFilter(props) {

  const filter = (selectedList, selectedItem) => {
    props.onFilter(
      selectedList.map(x => [x.value])
    );
  }

  return (
    <Multiselect options={props.optionsInput}
      displayValue="label"
      showCheckbox
      closeOnSelect={false}
      onSelect={filter}
      onRemove={filter} />
  )

}

const selectOptions = [
  { value: "Yes", label: 'yes' },
  { value: "No", label: 'no' },
  { value: "unknown", label: 'Unknown' }
];

const SAMPLE_ID = window.location.pathname.split("/").at(-1)

const SAMPLE_NAME = window.location.pathname.split("/").at(-2)
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/gene/${SAMPLE_NAME}/${SAMPLE_ID}`


function GenePage() {
  // state = {samples: []}
  const [gene_data, setGene_data] = useState({ id: 1, dataset_id: 0, name: "ENSG", patient_ids: { arr: [0] }, gene_values: { arr: [0] } });
  const [gene_external_data, setGeneExternalData] = useState({ description: "" });
  const [patient_data_table_filtered, set_patient_data_table_filtered] = useState([
    { patient_id: "" },
    { age: 0 },
    { diabete: "" },
    { final_diagnosis: "" },
    { gender: "" },
    { hypercholesterolemia: "" },
    { hypertension: "" },
    { race: "" },
    { id: 0 }
  ]);
  const [patient_information_expanded, set_patient_information_expanded] = useState([
    { patient_id: "" },
    { age: 0 },
    { diabete: "" },
    { final_diagnosis: "" },
    { gender: "" },
    { hypercholesterolemia: "" },
    { hypertension: "" },
    { race: "" },
    { id: 0 }
  ]);

  const [graphType, setGraphType] = useState('bar');
  
  const [graph_table_filter_data, set_graph_table_filter_data] = useState();
  const [patient_columns, set_patient_columns] = useState([{
    dataField: 'id',
    text: ''
  }, {
    dataField: 'patient_id',
    text: 'Patient ID'
  }, {
    dataField: 'age',
    text: 'Age'
  }, {
    dataField: 'diabete',
    text: 'Diabetes'
  }, {
    dataField: 'final_diagnosis',
    text: 'Final Diagnosis'
  }, {
    dataField: 'gender',
    text: 'Gender'
  }, {
    dataField: 'hypercholesterolemia',
    text: 'Hypercholesterolemia',
    filter: customFilter({
      delay: 1000,
      type: FILTER_TYPES.MULTISELECT
    }),

    filterRenderer: (onFilter, column) => {
      return (
        <ProductFilter onFilter={onFilter} column={column} optionsInput={selectOptions} />
      )
    }
  }, {
    dataField: 'hypertension',
    text: 'Hypertension',
    filter: customFilter({
      delay: 1000,
      type: FILTER_TYPES.MULTISELECT
    }),

    filterRenderer: (onFilter, column) => {
      return (
        <ProductFilter onFilter={onFilter} column={column} optionsInput={selectOptions} />
      )
    }
  }, {
    dataField: 'race',
    text: 'Race'
  }]);

  const graph_table_node = useRef(null);
  const patients_table_node = useRef(null);


  const filterNumber = (filterVals, data) => {
    let compareValCode = filterVals['compareValCode']
    let inputVal1 = filterVals['inputVal1']
    let inputVal2 = filterVals['inputVal2']
    let colName = filterVals['colName']

    if (compareValCode === 0) {
      // no filter
      return data;
    }
    else if (compareValCode === 1) {
      // <

      return data.filter(patient_one => patient_one[colName] < inputVal1);
    } else if (compareValCode === 2) {
      // >
      return data.filter(patient_one => patient_one[colName] > inputVal1);
    } else if (compareValCode === 3) {
      // =
      return data.filter(patient_one => patient_one[colName] === inputVal1);
    } else if (compareValCode === 4) {
      // Between
      return data.filter(patient_one => patient_one[colName] > inputVal1 && patient_one[colName] < inputVal2);
    }


  }

  const generatePatientTable = (patients_info) => {
    if (patients_info === null) {
      return;
    }

    for (let i = 0; i < patients_info.length; i++) {
      var cur_patient = patients_info[i]
      // patient has no id, so this is fine
      cur_patient['id'] = i + 1
      let patient_index = gene_data.patient_ids.arr.indexOf(cur_patient['patient_id'])
      if (patient_index !== -1) {
        cur_patient['gene_val'] = gene_data.gene_values.arr[patient_index]
      }
    }

    // 'id' not need options
    var patient_columns_list = []

    var column_possibilities = ['patient_id', 'age', 'diabete', 'final_diagnosis', 'gender', 'hypercholesterolemia', 'hypertension', 'race']
    for (let i = 0; i < column_possibilities.length; i++) {
      var unique = [...new Set(patients_info.flatMap(item => item[column_possibilities[i]]))];

      let select_options_col = []

      for (let j = 0; j < unique.length; j++) {
        select_options_col.push({ value: unique[j], label: unique[j] })
      }

      var col_obj = {
        dataField: column_possibilities[i],
        text: column_possibilities[i]
      }
      if (unique.length > 0 && Number.isInteger(unique[0])) {
        col_obj = {
          dataField: column_possibilities[i],
          text: column_possibilities[i],
          headerStyle: { minWidth: '150px' },
          filter: customFilter({
            delay: 1000,
            onFilter: filterNumber,
            type: FILTER_TYPES.NUMBER
          }),
          filterRenderer: (onFilter, column) => {
            return (
              <NumberFilter onFilter={onFilter} column={column} input_patient_information_expanded={patient_information_expanded} />
            )
          }
        }
      }
      else if (unique.length < 3) {
        col_obj = {
          dataField: column_possibilities[i],
          text: column_possibilities[i],
          headerStyle: { minWidth: '150px' },
          filter: customFilter({
            delay: 1000,
            type: FILTER_TYPES.MULTISELECT
          }),

          filterRenderer: (onFilter, column) => {
            return (
              <ProductFilter onFilter={onFilter} column={column} optionsInput={JSON.parse(JSON.stringify(select_options_col))} />
            )
          }
        }
      } else {
        col_obj = {
          dataField: column_possibilities[i],
          text: column_possibilities[i],
          headerStyle: { minWidth: '150px' },
          filter: textFilter({
            comparator: Comparator.EQ
          })
        }
      }
      patient_columns_list.push(col_obj)
    }

    set_patient_columns(patient_columns_list);

    return patients_info;
  }

  // componentDidMount() {
  useEffect(() => {
    async function fetchGeneData() {
      const res = await axios.get(URL);
      const gene_ext = await axios.get(`https://rest.ensembl.org/lookup/id/ENSG00000157764?expand=1;content-type=application/json`);
      setGeneExternalData(gene_ext.data);
      setGene_data(res.data);
      set_graph_table_filter_data(res.data);
    }



    fetchGeneData();

    //handleFetchUser();


  }, []);


  useEffect(() => {
    async function fetchPatientsData() {

      const patientsDataAPIURL = `${process.env.REACT_APP_BACKEND_URL}/api/patients/${SAMPLE_NAME}/${gene_data.dataset_id}`
      const res = await axios.get(patientsDataAPIURL);
      if (res.data.length > 0) {
        set_patient_information_expanded(generatePatientTable(res.data));
      }
    }

    fetchPatientsData()
  }, [gene_data])

  const graphDataFilter = (cur_filters) => {
    // filterType: "TEXT"
    // filterType: "NUMBER"
    // filterType: "MULTISELECT"

    let filter_columns = Object.keys(cur_filters);

    let patients_filtered = patient_information_expanded;
    let isFiltered = false;

    for (let i = 0; i < filter_columns.length; i++) {
      let current_filter = cur_filters[filter_columns[i]];
      if (current_filter.filterType === "NUMBER") {

        let first_num = current_filter.filterVal.inputVal1
        let second_num = current_filter.filterVal.inputVal2

        if (current_filter.filterVal.compareValCode === 1) {
          // <
          isFiltered = true
          patients_filtered = patients_filtered.filter(patient_one => patient_one[filter_columns[i]] < first_num)
        } else if (current_filter.filterVal.compareValCode === 2) {
          // >
          isFiltered = true
          patients_filtered = patients_filtered.filter(patient_one => patient_one[filter_columns[i]] > first_num)
        } else if (current_filter.filterVal.compareValCode === 3) {
          // =
          isFiltered = true
          patients_filtered = patients_filtered.filter(patient_one => patient_one[filter_columns[i]] === first_num)
        } else if (current_filter.filterVal.compareValCode === 4) {
          // between
          isFiltered = true
          patients_filtered = patients_filtered.filter(patient_one => patient_one[filter_columns[i]] > first_num && patient_one[filter_columns[i]] < second_num)
        }

      } else if (current_filter.filterType === "TEXT") {

        isFiltered = true
        patients_filtered = patients_filtered.filter(patient_one => patient_one[filter_columns[i]] === current_filter.filterVal)
      } else if (current_filter.filterType === "MULTISELECT") {

        // need to or through the filters selected for a column
        let mutliselect_filter_list = []
        isFiltered = true;

        for (let current_filter_index = 0; current_filter_index < current_filter.filterVal.length; current_filter_index++) {
          // each column: one value so will not overlap
          mutliselect_filter_list = mutliselect_filter_list.concat(patients_filtered.filter(patient_one => patient_one[filter_columns[i]] === current_filter.filterVal[current_filter_index][0]))
        }

        // or the multiselect options and set to the patients filter
        patients_filtered = mutliselect_filter_list;
      }
    }

    if (isFiltered === true) {
      let new_patient_ids = []
      let new_gene_vals = []

      for (let j = 0; j < patients_filtered.length; j++) {
        new_patient_ids.push(patients_filtered[j]['patient_id'])
        new_gene_vals.push(patients_filtered[j]['gene_val'])
      }

      let new_obj = { patient_ids: { arr: new_patient_ids }, gene_values: { arr: new_gene_vals } }


      set_graph_table_filter_data(new_obj)
    } else {
      set_graph_table_filter_data(gene_data)
    }
  };

  const patientDataFilter = (cur_filters) => {
    let filter_columns = Object.keys(cur_filters);

    let patients_filtered = patient_information_expanded;
    let isFiltered = false;

    for (let i = 0; i < filter_columns.length; i++) {
      let current_filter = cur_filters[filter_columns[i]];
      if (current_filter.filterType === "NUMBER") {

        let first_num = current_filter.filterVal.inputVal1
        let second_num = current_filter.filterVal.inputVal2

        if (current_filter.filterVal.compareValCode === 1) {
          // <
          isFiltered = true
          patients_filtered = patients_filtered.filter(patient_one => patient_one[filter_columns[i]] < first_num)
        } else if (current_filter.filterVal.compareValCode === 2) {
          // >
          isFiltered = true
          patients_filtered = patients_filtered.filter(patient_one => patient_one[filter_columns[i]] > first_num)
        } else if (current_filter.filterVal.compareValCode === 3) {
          // =
          isFiltered = true
          patients_filtered = patients_filtered.filter(patient_one => patient_one[filter_columns[i]] === first_num)
        } else if (current_filter.filterVal.compareValCode === 4) {
          // between
          isFiltered = true
          patients_filtered = patients_filtered.filter(patient_one => patient_one[filter_columns[i]] > first_num && patient_one[filter_columns[i]] < second_num)
        }

      } else if (current_filter.filterType === "TEXT") {

        isFiltered = true
        patients_filtered = patients_filtered.filter(patient_one => patient_one[filter_columns[i]] === current_filter.filterVal)
      } else if (current_filter.filterType === "MULTISELECT") {

        // need to or through the filters selected for a column
        let mutliselect_filter_list = []
        isFiltered = true;

        for (let current_filter_index = 0; current_filter_index < current_filter.filterVal.length; current_filter_index++) {
          // each column: one value so will not overlap
          mutliselect_filter_list = mutliselect_filter_list.concat(patients_filtered.filter(patient_one => patient_one[filter_columns[i]] === current_filter.filterVal[current_filter_index][0]))
        }

        // or the multiselect options and set to the patients filter
        patients_filtered = mutliselect_filter_list;
      }
    }

    if (isFiltered === true) {
      set_patient_data_table_filtered(patients_filtered)
    } else {
      set_patient_data_table_filtered(patient_information_expanded)
    }
  }

  return (
    <body id="page-top" class="gene_body">

      <div id="wrapper">

        <div id="content-wrapper" class="d-flex flex-column">


          <div id="content">

            <div class="container-fluid" id="gene_page_full">

              <div id="control_buttons_gene_page">
                <a href={"/gene/" + gene_data.name + "/" + gene_data.id} class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-1"><i
                  class="fas fa-download fa-sm text-white-50"></i>Generate Report</a>
              </div>

              <NameHeaderHolder input_object_data={gene_data} />

              <div class="container-fluid" id="gene_tabs_container_content" >
                <Tabs
                  defaultActiveKey="basic_info"
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  <Tab eventKey="basic_info" title="Basic Info">
                    <BasicInfo title_info_box = "Gene Information" inner_content_elements={[<p>Description: {gene_external_data.description}</p>, <p>Dataset ID: {gene_data.dataset_id}</p>,
                      <a href={"/dataset/" + gene_data.dataset_id}>Link to Dataset</a>]} />
                  </Tab>
                  <Tab eventKey="gene_graph" title="Graph">
                    <div id="graph_gene_box">
                      <div class="card shadow mb-4">
                        <div
                          class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                          <h6 class="m-0 font-weight-bold text-primary">Data Graph</h6>

                        </div>
                        <div class="card-body">

                          {graph_table_filter_data ? (
                            <div>
                              <SampleGraph categories={graph_table_filter_data.patient_ids["arr"]} data={graph_table_filter_data.gene_values["arr"]} type={graphType} />
                              <div className='GraphType'>
                                <FormControl margin='dense' fullWidth>
                                  <InputLabel id="GraphTypeLabel">Graph Type</InputLabel>
                                  <Select
                                    labelId="GraphTypeLabel"
                                    id="GraphTypeSelect"
                                    value={graphType}
                                    label="GraphType"
                                    onChange={(e) => { setGraphType(e.target.value) }}
                                  >
                                    <MenuItem value={'bar'}>Bar</MenuItem>
                                    <MenuItem value={'line'}>Basic Line</MenuItem>
                                    <MenuItem value={'pie'}>Pie</MenuItem>
                                  </Select>
                                </FormControl>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <CircularProgress />
                            </div>
                          )}

                        </div>

                        <div id='graph_filter'>
                          <BootstrapTable keyField='id' ref={n => graph_table_node.current = n} remote={{ filter: true, pagination: false, sort: false, cellEdit: false }} data={[]} columns={patient_columns} filter={filterFactory()} filterPosition="top" onTableChange={(type, newState) => { graphDataFilter(graph_table_node.current.filterContext.currFilters) }} />
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="patients_list" title="Patient List">
                    <div class="card shadow mb-4" id="display_filter_patients_gene">
                      <div class="card-header py-3">
                        <h6 class="m-0 font-weight-bold text-primary">Patient List</h6>
                      </div>

                      <div class="row" id="table_options_outer">
                        <div id="patient_table_area">
                          <BootstrapTable keyField='id' ref={n => patients_table_node.current = n} remote={{ filter: true, pagination: false, sort: false, cellEdit: false }} data={patient_data_table_filtered} columns={patient_columns} filter={filterFactory()} pagination={paginationFactory()} filterPosition="top" onTableChange={(type, newState) => { patientDataFilter(patients_table_node.current.filterContext.currFilters) }} />
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="animation" title="Animation">
                    <GeneSequenceAnimation />
                  </Tab>
                </Tabs>
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

export default GenePage


