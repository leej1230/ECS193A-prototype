
import React, { useEffect, useState, useRef } from 'react';
import {clone} from "ramda";
import filterFactory, { FILTER_TYPES, customFilter} from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import './DatasetGenesListTable.js'

import NumberFilter from '../filters/NumberFilter';
import ProductFilter from '../filters/ProductFilter';
import filterNumber from '../filters/filterNumber';
import TextFuzzyFilter from '../filters/TextFuzzyFilter';

function DatasetGenesListTable(props){

    const gene_list_node = useRef(null);
    const [gene_list_filtered , set_gene_list_filtered] = useState([{'id':0,'gene_id': "None"}]);

    const [gene_columns, setGene_columns] = useState([{
        dataField: 'id',
        text: ''
      },{
        dataField: 'gene_id',
        text: 'gene_id'
      }]);

    useEffect(() => {
        let copy_obj = clone( props.input_expanded_gene_info );
        set_gene_list_filtered(copy_obj);
    }, [props.input_expanded_gene_info])

    useEffect(() => {
        setGene_columns(generateGeneTable(props.input_expanded_gene_info));
      }, [props.input_expanded_gene_info]);
    
    const geneListFilter = (gene_list_filter_value) => {
    //console.log("node method");
    //console.log(gene_list_filter_value)

    let text_search = gene_list_filter_value.gene_id.filterVal.input_string_value;
    let column_search = gene_list_filter_value.gene_id.filterVal.colName;
    let reset_value = gene_list_filter_value.gene_id.filterVal.reset;

    if(reset_value == true){
        set_gene_list_filtered(clone(props.input_expanded_gene_info));
        return;
    }

    let search_results_genes = filterFuzzyText({input_string_value: text_search, colName: column_search, reset: false}, props.input_expanded_gene_info );

    set_gene_list_filtered(clone(search_results_genes));
    }

    const filterFuzzyText = (filterVals, data) => {
        let input_str = filterVals['input_string_value']
        let colName = filterVals['colName']
  
        if( filterVals['reset'] == true ){
          return data;
        }
  
        // not exact match or exact off by 1: need to be ok with includes
  
        // also discarding decimal in search important
        let removed_decimal_input = input_str
        if( removed_decimal_input.includes(".") ){
          removed_decimal_input = removed_decimal_input.substring(0, removed_decimal_input.indexOf("."))
        }
        
        // equals filter
        let filtered_list_genes = data.filter( patient_one => (hasLevenshteinDistanceLessThanEqualOne(patient_one[colName] , input_str) <= 1) || (patient_one[colName].includes(input_str)) || (patient_one[colName].includes(removed_decimal_input)) ).sort(
          (patient_object_a, patient_object_b) => {
            return hasLevenshteinDistanceLessThanEqualOne(patient_object_a[colName] , input_str) - hasLevenshteinDistanceLessThanEqualOne(patient_object_b[colName] , input_str);
          }
        );
  
        return filtered_list_genes;
        
      }
    
    const hasLevenshteinDistanceLessThanEqualOne = (current_input_str, str_reference) => {
    if( Math.abs(current_input_str.length - str_reference.length) > 1 ){
        // rand number more than 1 to be discarded when filtered
        return 5;
    }else if( Math.abs(current_input_str.length - str_reference.length) == 1 ){
        // distance is 1, make sure no other diff, or else not dist 1

        let larger_str = current_input_str;
        let smaller_str = str_reference;
        if(current_input_str.length < str_reference.length){
        larger_str = str_reference;
        smaller_str = current_input_str;
        }


        let num_errors = 0;
        let smaller_index = 0;
        let larger_index = 0;

        for( ; smaller_index < smaller_str.length && larger_index < larger_str.length; ){
        if( smaller_str[smaller_index] == larger_str[larger_index]  ){
            smaller_index++;
            larger_index++;
        } else if( (larger_index+1) < larger_str.length && smaller_str[smaller_index] == larger_str[larger_index+1] ){
            larger_index = larger_index+2;
            smaller_index++;
            num_errors++;
        } else {
            larger_index++;
            smaller_index++;
            num_errors++;
        }
        }

        
        return num_errors;

    } else {
        // equal length

        let num_errors = 0;
        let first_index = 0;
        let second_index = 0;

        for( ; first_index < current_input_str.length && second_index < str_reference.length; ){
        if( current_input_str[first_index] == str_reference[second_index]  ){
            first_index++;
            second_index++;
        } else {
            second_index++;
            first_index++;
            num_errors++;
        }
        }

    
        return num_errors;
    }
    
    }

    const generateGeneTable = (gene_objs_information) => {

        // 'id' not need options
        let gene_columns_list = []
    
        if(gene_objs_information == null || gene_objs_information.length == 0){
          return [{
            dataField: 'id',
            text: ''
          },{
            dataField: 'gene_id',
            text: 'gene_id'
          }];
        }
    
        let column_possibilities = ['gene_id']
        for(let i = 0; i < column_possibilities.length; i++){
          let unique = [...new Set(gene_objs_information.flatMap(item => item[ column_possibilities[i] ] ))];
    
          let select_options_col = []
    
          for(let j = 0; j < unique.length; j++){
            select_options_col.push({value: unique[j], label: unique[j]})
          }
    
          let col_obj = {dataField: column_possibilities[i],
            text: column_possibilities[i]}
          if(unique.length > 0 && Number.isInteger(unique[0])){
            col_obj = {
              dataField: column_possibilities[i],
              text: column_possibilities[i],
              headerStyle: { minWidth: '150px' },
              filter: customFilter({
                delay: 1000,
                onFilter:filterNumber,
                type: FILTER_TYPES.NUMBER
              }),
              filterRenderer: (onFilter, column) => {
                return(
                  <NumberFilter onFilter={ onFilter } column={column} />
                  )
              }
            }
          }
          else if(unique.length < 5){
            col_obj = {
              dataField: column_possibilities[i],
              text: column_possibilities[i],
              headerStyle: { minWidth: '150px' },
              filter: customFilter({
                delay: 1000,
                type: FILTER_TYPES.MULTISELECT
              }),
            
              filterRenderer: (onFilter, column) => {
                return(
                  <ProductFilter onFilter={onFilter} column={column} optionsInput={clone(select_options_col)}/>
                  )
              }
            }
          } else {
            col_obj = {
              dataField: column_possibilities[i],
              text: column_possibilities[i],
              headerStyle: { minWidth: '150px' },
              formatter: (cell, row, rowIndex, extraData) => {
                return(
                  <span>
                    <a id="gene_list_single_link" href={"/gene/"+ cell +"/1"}>{cell}</a>
                  </span>
                );
              },
              formatExtraData: gene_list_filtered,
              filter: customFilter({
                delay: 1000,
                onFilter:filterFuzzyText
              }),
              filterRenderer: (onFilter, column) => {
                return(
                  <TextFuzzyFilter onFilter={ onFilter } column={column} nested_input_gene_expanded_information={props.input_expanded_gene_info} />
                  )
              }
            }
          }
          gene_columns_list.push(col_obj)
        }
        return gene_columns_list;
      }
    
    return( 
        <div class="row" id="dataset_table_and_stats_row">
            <div class="card shadow" id="dataset_genes_list">
                <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Gene Ids</h6>
                </div>
                <div class="card-body">
                    <div class="row" id="table_options_outer">
                        <div id="gene_table_area">
                        <BootstrapTable keyField='id' ref={ n => gene_list_node.current = n  } remote={ { filter: true, pagination: false, sort: false, cellEdit: false } } data={ gene_list_filtered } columns={ gene_columns } filter={ filterFactory() } pagination={ paginationFactory() } filterPosition="top" onTableChange={ (type, newState) => { geneListFilter(gene_list_node.current.filterContext.currFilters) } } />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DatasetGenesListTable