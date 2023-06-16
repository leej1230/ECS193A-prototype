
import React from 'react';

import { CircularProgress } from '@mui/material';

import './BasicInfo.css'

import "../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "../bootstrap_gene_page/css/sb-admin-2.min.css"

function BasicInfo(props) {

  return (
    <div class="row" id="info_box">
      {props.input_basic_info_loaded ? (
        <div class="card shadow" >
          <div
            class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Gene Information</h6>
          </div>

          <div class="card-body" >
              <div>

                <>
                  <br />
                  <div >
                          <h5 class="dataset_subheader">Description </h5>
                          <hr class="line_div_category_header_content" />
                          <p class="dataset_subcontent">{props.input_description ? props.input_description : ""}</p>
                  </div>
                  
                  {/*<p>Dataset ID: {props.input_gene.dataset_id}</p>*/}
                  
                </>

                {props.input_gene ? 
                  (
                    <>
                      {Object.keys(props.input_gene).map((single_attr, attr_index) => {
                        //console.log("within the gene basic info: ");
                        //console.log(single_attr);
                        //console.log(props.input_gene[single_attr]);
                        if (single_attr !== "description" && single_attr !== "dataset_name" && single_attr !== "name" && single_attr !== "id" && single_attr !== "patient_ids" && single_attr !== "gene_values") {
                          return <>
                            <br />
                            <div >
                                <h5 class="dataset_subheader">{single_attr} </h5>
                                <hr class="line_div_category_header_content" />
                                <p class="dataset_subcontent">{props.input_gene[single_attr] ? props.input_gene[single_attr] : ""}</p>
                            </div>
                            {/*<p>{single_attr}: &nbsp; {props.input_gene[single_attr]}</p>*/}
                          </>
                        }
                        return null;
                      })}
                    </>
                )
                :
                (
                  <></>
                )
              }

                <br />

                <a href={ props.input_gene && 'dataset_name' in props.input_gene && props.input_gene.dataset_name ? "/dataset/" + props.input_gene.dataset_name : ""}>Link to Dataset</a>
                &nbsp; &nbsp; &nbsp; &nbsp;
                <a href={`https://www.genecards.org/cgi-bin/carddisp.pl?id=${props.input_gene && 'name' in props.input_gene &&  props.input_gene.name && props.input_gene.name.indexOf('.') >= 0 ? props.input_gene.name.substring(0 , props.input_gene.name.indexOf('.')) : ""}&id_type=ensembl` } target="_blank" rel="noopener noreferrer">Gene Cards Link</a>

              </div>

          </div>
        </div>
      ) : (
        <div>
          <CircularProgress />
        </div>
      )}
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