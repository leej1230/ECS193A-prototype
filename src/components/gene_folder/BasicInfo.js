                
import React, { useEffect, useState, useRef } from 'react';

import { CircularProgress } from '@mui/material';

import './BasicInfo.css'

import "../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "../bootstrap_gene_page/css/sb-admin-2.min.css"
                
function BasicInfo(props){     
  
  return(
          <div class="row" id="info_box">
            <div class="card shadow" >
              <div
                class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 class="m-0 font-weight-bold text-primary">{props.title_info_box}</h6>
              </div>

              <div class="card-body" >
                {props ? (
                  <div>
                    {props.inner_content_elements.map((cur_display_element, cur_index) => 
                      <>
                        <br />
                        {cur_display_element}
                      </>
                    )}
                    <br />
                    {Object.keys(props.input_gene).map((single_attr, attr_index) => {
                      if( single_attr != "description" && single_attr != "dataset_id" && single_attr != "name" && single_attr != "id"){
                        return <>
                                  <br />
                                  <p>{single_attr}: &nbsp; {props.input_gene[single_attr]}</p>
                              </>
                      }
                    })}
                  </div>
                ) : (
                  <div>
                    <CircularProgress />
                  </div>
                )}

              </div>
            </div>
          </div>
  )
}

export default BasicInfo

/*
<p>Description: 0</p>
<br />
<p>Dataset ID: 0</p>
<br />
<a href="#">Link to Dataset</a>
*/