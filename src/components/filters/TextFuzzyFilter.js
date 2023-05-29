
import React, { useState } from 'react';
import './TextFuzzyFilter.css'

const TextFuzzyFilter = (props) => {
    const [inputStr, setInputStr] =  useState("");

    const reset_list = () => {
      props.onFilter(
        {input_string_value: "", colName: props.column.dataField, reset: true}, props.nested_input_gene_expanded_information
      )
    }
    
    const filter = () => {
      props.onFilter(
        {input_string_value: inputStr, colName: props.column.dataField, reset: false}, props.nested_input_gene_expanded_information
      );
    }
  
      return (
            <div id="column_gene_search_input">
              <div class="input-group" id="input_cluster">
                <div class="form-outline gene_input_txt">
                  <input type="text" id="form1" class="form-control" placeholder="text" data-cy="genelistinputbox" onChange={(e) => { setInputStr( e.target.value ) }} />
                </div>
                <button type="button"  onClick={() => {filter()}} class="btn btn-primary gene_search_btn">
                  <i id="gene_list_search" class="fas fa-search"></i>
                </button>
                <button
                    id="gene_list_reset"
                    onClick={() => {reset_list()}}
                  >Reset</button>
              </div>

            </div>
          )
      }

export default TextFuzzyFilter;
