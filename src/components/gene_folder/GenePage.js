
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import "./GenePage.css";

import GeneNameHeaderHolder from './GeneNameHeaderHolder'
import BasicInfo from './BasicInfo'
import NumberFilter from '../filters/NumberFilter';
import GeneSequenceAnimation from './GeneSequenceAnimation';
import ProductFilter from '../filters/ProductFilter';
import StringFilter from '../filters/StringFilter';
import filterNumber from '../filters/filterNumber'
import SampleGraph from './echartdemo';

import filterFactory, { FILTER_TYPES, customFilter, textFilter, Comparator } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {default as SelectDropDown} from "react-select";

import "../bootstrap_gene_page/css/sb-admin-2.min.css";
import "../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { clone, none } from "ramda";


const selectOptions = [
  { value: "Yes", label: "yes" },
  { value: "No", label: "no" },
  { value: "unknown", label: "Unknown" },
];

const options_select = [{value: "text", label: "text"},{value: "number", label: "number"}]

const SAMPLE_DATASET_NAME = window.location.pathname.split("/").at(-1);

const SAMPLE_NAME = window.location.pathname.split("/").at(-2)
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/gene/${SAMPLE_NAME}/${SAMPLE_DATASET_NAME}`

function GenePage() {
  // state = {samples: []}
  const [gene_data, setGene_data] = useState(null);
  // {  dataset_name: 0, name: "a", patient_ids: { arr: [0] }, gene_values: { arr: [0] } }
  const [gene_external_data, setGeneExternalData] = useState(null);
  const [patient_data_table_filtered, set_patient_data_table_filtered] = useState(
    null
  );
  const [patient_information_expanded, set_patient_information_expanded] = useState(
    null
  );

  const [graphType, setGraphType] = useState('bar');

  const [, set_basic_gene_info] = useState(null)
  // { dataset_name: 0, name: "a" }

  const [dataset_rowType, set_dataset_rowType] = useState("")

  const [graph_table_filter_data, set_graph_table_filter_data] = useState(null);
  
  const [column_filter_types_arr, set_column_filter_types_arr] = useState({}); // { 'id': "text", 'age': "number" }
  const [ filter_types_states_arr , set_filter_types_states_arr ] = useState({}); // { 'id': {value: "text", label: "text"} }

  const [patient_columns, set_patient_columns] = useState(null)
    /*[{
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
        <ProductFilter
          onFilter={onFilter}
          column={column}
          optionsInput={selectOptions}
        />
      );
    },
  },
  {
    dataField: "hypertension",
    text: "Hypertension",
    filter: customFilter({
      delay: 1000,
      type: FILTER_TYPES.MULTISELECT,
    }),

    filterRenderer: (onFilter, column) => {
      return (
        <ProductFilter
          onFilter={onFilter}
          column={column}
          optionsInput={selectOptions}
        />
      );
    },
  },
  {
    dataField: "race",
    text: "Race",
  },
  ]*/

  // loader states
  const [gene_name_holder_loader , set_gene_name_holder_loader] = useState(false);
  const [basic_info_loaded, set_basic_info_loaded] = useState(false);
  const [loaded_gene_info, set_loaded_gene_info] = useState(false); // for graph
  const [patient_table_loaded, set_patient_table_loaded] = useState(false);

  const graph_table_node = useRef(null);
  const patients_table_node = useRef(null);

  useEffect(() => {
    let some_result = generatePatientTable(clone(patient_information_expanded));
    console.log("patients table setting: ", some_result)
    set_patient_data_table_filtered(some_result);
  }, [column_filter_types_arr, filter_types_states_arr, patient_information_expanded])

  const handleSelect = async (input_select_obj, input_col_name) => {
    let temp_var = clone(column_filter_types_arr);

    temp_var[input_col_name] = input_select_obj.value;
    
    set_column_filter_types_arr( temp_var );

    temp_var = clone(filter_types_states_arr);
    temp_var[input_col_name] = input_select_obj;
    set_filter_types_states_arr( temp_var )
  };

  const generatePatientTable = (patients_info) => {
    if ( !patients_info || patients_info.length === 0 || !('patient_ids' in gene_data) || !gene_data || gene_data.patient_ids === null || !('gene_values' in gene_data) || gene_data.gene_values === null) {
      set_patient_columns([])
      return [];
    }

    //var column_possibilities = ['patient_id', 'age', 'diabete', 'final_diagnosis', 'gender', 'hypercholesterolemia', 'hypertension', 'race']
    var column_possibilities = [];

    // 'id' not need options
    var patient_columns_list = []


    if (dataset_rowType === "patient") {
      for (let i = 0; patients_info && i < patients_info.length; i++) {
        var cur_patient = patients_info[i]
        // patient has no id, so this is fine
        cur_patient['id'] = i + 1
        let patient_index = gene_data.patient_ids.arr.indexOf(cur_patient['patient_id'])
        if (patient_index !== -1) {
          cur_patient['gene_val'] = gene_data.gene_values.arr[patient_index]
        }
      }


    } else if (dataset_rowType === "gene") {
      // genes are rows, patients: only gene value and ids info
      // add some hardcoded values in this case like patient_id, gene_values, etc. so use those

      let cur_gene_index = patients_info[0].gene_ids.arr.indexOf(gene_data.name)
      patients_info = patients_info.map((patient_obj_element, patient_obj_key) => { return { 'patient_id': patient_obj_element.patient_id, 'gene_val': patient_obj_element.gene_values.arr[cur_gene_index] } })

    }

    column_possibilities = Object.keys(patients_info[0])

    let copy_column_filter_types_arr = clone(column_filter_types_arr);
    let copy_filter_types_states_arr = clone(filter_types_states_arr);

    /*if( copy_column_filter_types_arr.length !== column_possibilities.length ){
      // first loading of screen
      set_column_filter_types_arr(Array(column_possibilities.length).fill("text"));
      copy_column_filter_types_arr = Array(column_possibilities.length).fill("text")

      copy_filter_types_states_arr = []
      for(let temp_index = 0; temp_index < column_possibilities.length; temp_index++){
        copy_filter_types_states_arr.push({value: "text", label: "text"});
      }

      set_filter_types_states_arr(copy_filter_types_states_arr)

    }*/

    let have_modified_cols = false


    for (let i = 0; column_possibilities && i < column_possibilities.length; i++) {

      if( column_possibilities[i] != 'gene_ids' && column_possibilities[i] != 'dataset_id' && column_possibilities[i] != 'dataset_name' ){

          if( !(column_possibilities[i] in copy_column_filter_types_arr) ){
            // add column and column type
            copy_column_filter_types_arr[column_possibilities[i]] = "text"
            have_modified_cols = true
          }

          if( !(column_possibilities[i] in copy_filter_types_states_arr) ){
            // add column and column type
            copy_filter_types_states_arr[column_possibilities[i]] = {value: "text", label: "text"}
            have_modified_cols = true
          }

          var unique = [...new Set(patients_info.flatMap(item => item[column_possibilities[i]]))];

          unique = unique.filter(x => x != "nan/na");

          let select_options_col = []

          for (let j = 0; j < unique.length; j++) {
            select_options_col.push({ value: unique[j], label: unique[j] })
          }

          var col_obj = {
            dataField: column_possibilities[i],
            text: column_possibilities[i]
          }
          
          if ( unique.length < 3 ) {
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
                  <>
                    <p className="float-center">Multiselect</p>
                    <ProductFilter onFilter={onFilter} column={column} optionsInput={JSON.parse(JSON.stringify(select_options_col))} />
                  </>
                )
              }
            }
          }
          else if( copy_column_filter_types_arr[column_possibilities[i]] == "number" ){
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
                  <>
                    <SelectDropDown className="float-center"
                            options={options_select}
                            isLoading={!options_select}
                            closeMenuOnSelect={true}
                            onChange={(e) => {
                              //handleSelect(e, i);
                              handleSelect(e, column_possibilities[i] );
                              
                            }}
                            value={copy_filter_types_states_arr[ column_possibilities[i] ]}
                            name={"filter_type"}
                          />
                    <br />
                    <NumberFilter onFilter={onFilter} column={column} input_patient_information_expanded={patients_info} />
                  </>
                )
              }
            }
          }
           else {
            col_obj = {
              dataField: column_possibilities[i],
              text: column_possibilities[i],
              headerStyle: { minWidth: '150px' },
              filter: customFilter({
                delay: 1000,
                type: FILTER_TYPES.TEXT
              }),

              filterRenderer: (onFilter, column) => {
                return (
                  <>
                    <SelectDropDown className="float-center"
                            options={options_select}
                            isLoading={!options_select}
                            closeMenuOnSelect={true}
                            onChange={(e) => {
                              //handleSelect(e, i);
                              handleSelect(e, column_possibilities[i]);
                              
                            }}
                            value={copy_filter_types_states_arr[ column_possibilities[i]]}
                            name={"filter_type"}
                          />
                    <br />
                    <StringFilter onFilter={onFilter} column={column} input_patient_information_expanded={patients_info} />
                  </>
                )
              }
            }
          }

          /*if (unique.length > 0 && Number.isInteger(unique[0])) {
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
                  <NumberFilter onFilter={onFilter} column={column} input_patient_information_expanded={patients_info} />
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
          }*/
          patient_columns_list.push(col_obj)
        }
    }

    if( have_modified_cols ){
      set_column_filter_types_arr( copy_column_filter_types_arr )
      set_filter_types_states_arr( copy_filter_types_states_arr )
    }

    set_patient_columns(patient_columns_list);

    return patients_info;
  }

  // componentDidMount() {
  useEffect(() => {
    async function fetchGeneData(input_first_part_name_gene) {
      await axios.get(URL).then((res) => {

        if(res.data){

          let cur_res_data = clone(res.data);

          let keys_list = Object.keys( cur_res_data );
          for (let i = 0; i <  keys_list.length; i++){
            let cur_attr_key = keys_list[i]
            if(cur_attr_key !== "gene_values" && cur_attr_key !== "gene_ids" && cur_attr_key !== "patient_ids"){
              if( (cur_res_data[cur_attr_key]).constructor == Object ){
                cur_res_data[cur_attr_key] = JSON.stringify(cur_res_data[cur_attr_key])
              } else if(Array.isArray(cur_res_data[cur_attr_key])){
                cur_res_data[cur_attr_key] = cur_res_data[cur_attr_key].toString()
              }
            }
          }

          setGene_data(cur_res_data);

          set_basic_gene_info(cur_res_data);

          set_graph_table_filter_data(clone(cur_res_data));
          console.log("graph table filter set: ", cur_res_data);
        } else {
          setGene_data({});

          set_graph_table_filter_data({});
        }

        console.log( "graph filter information: ", res.data );
      });
      await axios.get(`https://rest.ensembl.org/lookup/id/${input_first_part_name_gene}?expand=1;content-type=application/json`).then((gene_ext) => {
        
        let temp_res_data = clone(gene_ext.data)
        let keys_list = Object.keys( temp_res_data );
        for (let i = 0; i <  keys_list.length; i++){
          let cur_attr_key = keys_list[i]
          if(cur_attr_key !== "gene_values" && cur_attr_key !== "gene_ids" && cur_attr_key !== "patient_ids"){
            if( (temp_res_data[cur_attr_key]).constructor == Object ){
              temp_res_data[cur_attr_key] = JSON.stringify(temp_res_data[cur_attr_key])
            } else if(Array.isArray(temp_res_data[cur_attr_key])){
              temp_res_data[cur_attr_key] = temp_res_data[cur_attr_key].toString()
            }
          }
        }
      
        setGeneExternalData(temp_res_data);

        console.log("get the external data: ")
        console.log(temp_res_data)
        
      }).catch(() => {
        setGeneExternalData({});
      });


    }


    let first_part_name_gene = SAMPLE_NAME;
    let dot_index_sample_name = first_part_name_gene.indexOf(".")
    if( dot_index_sample_name >= 0 ){
      first_part_name_gene = first_part_name_gene.substring(0, dot_index_sample_name);
    }
    console.log("sample name substring: ")
    console.log(first_part_name_gene);
    fetchGeneData(first_part_name_gene);

    // eslint-disable-next-line react-hooks/exhaustive-deps



  }, []);

  useEffect(() => {
    async function fetchRowType() {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get_row_type/${SAMPLE_DATASET_NAME}`).then((res) => {

        set_dataset_rowType(res.data)

      });
    }

    fetchRowType();
  }, [gene_data])


  useEffect(() => {
    async function fetchPatientsData() {

      if (gene_data && 'dataset_name' in gene_data && gene_data.dataset_name != null && dataset_rowType.length > 0) {

        const patientsDataAPIURL = `${process.env.REACT_APP_BACKEND_URL}/api/patients/${SAMPLE_NAME}/${SAMPLE_DATASET_NAME}`
        await axios.get(patientsDataAPIURL).then((res) => {

          if (res.data &&  res.data.length > 0) {

            let temp_res_data = clone(res.data)
            for( let j = 0; j < temp_res_data.length; j++ ){
              let cur_pat_obj = temp_res_data[j]
              let keys_list = Object.keys( cur_pat_obj );
              for (let i = 0; i <  keys_list.length; i++){
                let cur_attr_key = keys_list[i]
                if(cur_attr_key !== "gene_values" && cur_attr_key !== "gene_ids" && cur_attr_key !== "patient_ids"){
                  if( (cur_pat_obj[cur_attr_key]).constructor == Object ){
                    cur_pat_obj[cur_attr_key] = JSON.stringify(cur_pat_obj[cur_attr_key])
                  } else if(Array.isArray(cur_pat_obj[cur_attr_key])){
                    cur_pat_obj[cur_attr_key] = cur_pat_obj[cur_attr_key].toString()
                  }
                }
              }

              temp_res_data[j] = cur_pat_obj;
            }

            console.log("fetch patient stuff: ", temp_res_data);
            set_patient_information_expanded(temp_res_data);
            let some_result = generatePatientTable(clone(temp_res_data))
            console.log("process patient table: ", some_result)
            set_patient_data_table_filtered(some_result)

          } else {
            set_patient_data_table_filtered([])
            set_patient_information_expanded([])
          }

          
        });

      }

      console.log("got here!!!");
      set_patient_table_loaded(true);
    }

    fetchPatientsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset_rowType, loaded_gene_info])


  {/*useEffect(() => {
    let temp_obj = clone(gene_data ?  gene_data : {})
    let list_attr = Object.keys(temp_obj)
    for (let i = 0; i < list_attr.length; i++) {
      if (temp_obj[list_attr[i]] !== null && temp_obj[list_attr[i]].constructor.name === 'Object' && !Array.isArray(temp_obj[list_attr[i]]) && !(temp_obj[list_attr[i]] instanceof Date)) {
        // object so remove (or convert to array)
        delete temp_obj[list_attr[i]]
      }
    }

    set_basic_gene_info(temp_obj)
  }, [gene_data])*/}

  useEffect(() => {
    if(gene_external_data){
      set_basic_info_loaded( true );
    }
  }, [gene_external_data])

  useEffect(() => {
    if( gene_data ){
      set_gene_name_holder_loader(true);
      set_loaded_gene_info(true);
    }
  }, [gene_data])

  const graphDataFilter = (cur_filters) => {
    // filterType: "TEXT"
    // filterType: "NUMBER"
    // filterType: "MULTISELECT"

    let filter_columns = Object.keys(cur_filters);

    let patients_filtered = generatePatientTable(clone(patient_information_expanded));
    let isFiltered = false;

    console.log("graph filter : ");
    console.log(cur_filters);

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

        //isFiltered = true
        //patients_filtered = patients_filtered.filter(patient_one => patient_one[filter_columns[i]] === current_filter.filterVal)

        if ( current_filter.filterVal.compareValCode === 1 ){
          isFiltered = true
          patients_filtered = patients_filtered.filter(patient_one => String(patient_one[filter_columns[i]]) === String(current_filter.filterVal.inputVal1) );
        }
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

      for (let j = 0; patients_filtered && j < patients_filtered.length; j++) {
        new_patient_ids.push(patients_filtered[j]['patient_id'])
        new_gene_vals.push(patients_filtered[j]['gene_val'])
      }

      let new_obj = { patient_ids: { arr: new_patient_ids }, gene_values: { arr: new_gene_vals } }


      set_graph_table_filter_data( new_obj )
      console.log("filter graph: ", patients_filtered)
    } else {
      set_graph_table_filter_data( (clone(gene_data)) )
      console.log("filter graph: ", gene_data)
    }
  };

  const patientDataFilter = (cur_filters) => {
    let filter_columns = Object.keys(cur_filters);

    let patients_filtered = generatePatientTable(clone(patient_information_expanded));
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

        if ( current_filter.filterVal.compareValCode == 1 ){
          isFiltered = true
          patients_filtered = patients_filtered.filter(patient_one => String(patient_one[filter_columns[i]]) === String(current_filter.filterVal.inputVal1 ) )
        }
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
      console.log("patient table filter set ", patients_filtered)
      set_patient_data_table_filtered(patients_filtered)
    } else {
      let temp_filtered_list = generatePatientTable(clone(patient_information_expanded))
      console.log("patient table filter set ", temp_filtered_list )
      set_patient_data_table_filtered(temp_filtered_list)
    }
  }

  return (
    <body id="page-top" class="gene_body">
      <div id="wrapper">
        

          <div id="content-wrapper" class="d-flex flex-column">


            <div id="content">

              <div class="container-fluid" id="gene_page_full">

                <div id="control_buttons_gene_page">
                  {/*<a href={"/gene/" + gene_data.name + "/" + gene_data.id} class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-1">{/*<i
                    class="fas fa-download fa-sm text-white-50"></i>Generate Report</a>*/}
                    
                </div>

                <GeneNameHeaderHolder input_object_data={gene_data} input_gene_name_holder_loaded={gene_name_holder_loader} />

                <div class="container-fluid" id="gene_tabs_container_content" >
                  <Tabs
                    defaultActiveKey="basic_info"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                  >
                    <Tab eventKey="basic_info" title="Basic Info">
                      <BasicInfo input_gene={gene_data} input_description={gene_external_data ? gene_external_data.description : ""} input_basic_info_loaded={basic_info_loaded && gene_external_data} />
                    </Tab>
                    <Tab eventKey="gene_graph" title="Graph">
                      <div id="graph_gene_box">
                        <div class="card shadow mb-4">
                          <div
                            class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 class="m-0 font-weight-bold text-primary">Data Graph</h6>

                          </div>
                          <div class="card-body">

                            {patient_table_loaded ?
                              <>
                                { graph_table_filter_data && patient_columns && patient_columns.length > 0 && ( (dataset_rowType === "patient") || (patient_information_expanded && patient_information_expanded.length > 0 )) ?
                                  (<div>
                                    <SampleGraph categories={graph_table_filter_data["patient_ids"]["arr"]} data={graph_table_filter_data["gene_values"]["arr"]} type={graphType} />
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
                                       
                                        </Select>
                                      </FormControl>
                                    </div>
                                    
                                    <div id='graph_filter'>
                                      <BootstrapTable keyField='id' ref={n => graph_table_node.current = n} remote={{ filter: true, pagination: false, sort: false, cellEdit: false }} data={[]} columns={patient_columns} filter={filterFactory()} filterPosition="top" onTableChange={(type, newState) => { graphDataFilter(graph_table_node.current.filterContext.currFilters) }} />
                                    </div>

                                  </div>
                                  ) : (
                                    <div> No Graph of Gene Values Since No Patient Data </div>
                                  )}
                              </>

                              : (
                                <div>
                                  <CircularProgress />
                                </div>

                              )}


                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab eventKey="patients_list" title="Patient List">
                       {patient_table_loaded  ? 
                          (
                            <>
                              {patient_data_table_filtered && patient_columns && patient_columns.length > 0 && ((dataset_rowType === "patient" ) || (patient_information_expanded && patient_information_expanded.length > 0)) ?
                                (
                                  <div class="card shadow mb-4" id="display_filter_patients_gene">
                                    <div class="card-header py-3">
                                      <h6 class="m-0 font-weight-bold text-primary">Patient List</h6>
                                    </div>

                                    <div class="row" id="table_options_outer">
                                      <div id="patient_table_area">
                                        <BootstrapTable keyField='patient_id' ref={n => patients_table_node.current = n} remote={{ filter: true, pagination: false, sort: false, cellEdit: false }} data={patient_data_table_filtered} columns={patient_columns} filter={filterFactory()} pagination={paginationFactory()} filterPosition="top" onTableChange={(type, newState) => { patientDataFilter(patients_table_node.current.filterContext.currFilters) }} />
                                      </div>
                                    </div>
                                  </div>
                                )
                          
                              :
                              <div class="card shadow mb-4" id="display_filter_patients_gene">
                                <div class="card-header py-3">
                                  <h6 class="m-0 font-weight-bold text-primary">Patient List</h6>
                                </div>

                                <div class="row" id="table_options_outer">
                                  <div id="patient_table_area">
                                    <p>No patient data</p>
                                  </div>
                                </div>
                              </div>
                              }
                            </>
                           )
                          :
                          (
                            <div>
                              <CircularProgress />
                            </div>

                          )}
                      </Tab>
                    <Tab eventKey="animation" title="Animation">
                      <GeneSequenceAnimation gene_name={gene_data && 'name' in gene_data ? gene_data.name : "" } />
                    </Tab>
                  </Tabs>
                </div>

              </div>

            </div>

            {/*<footer class="sticky-footer bg-white">
              <div class="container my-auto">
                <div class="copyright text-center my-auto">
                  <span>Copyright &copy; Your Website 2021</span>
                </div>
              </div>
              </footer>*/}

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
  );
}

export default GenePage;

/*
{!(gene_data && ("name" in gene_data) && gene_data["name"]) ? (
          <div style={{ marginTop: "40vh" }}>
            <LoadingSpinner />
          </div>
        ) : (
*/
