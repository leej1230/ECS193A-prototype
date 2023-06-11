
import React from 'react';

import { CircularProgress } from '@mui/material';

import './BasicInfo.css'

import "../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "../bootstrap_gene_page/css/sb-admin-2.min.css"

function BasicInfo(props) {

  return (
    <div class="row" id="info_box">
      <div class="card shadow" >
        <div
          class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 class="m-0 font-weight-bold text-primary">{props.title_info_box}</h6>
        </div>

        <div class="card-body" >
          {props ? (
            <div>

              <>
                <br />
                <p>Description: {props.input_description}</p>
                <br />
                <p>Dataset ID: {props.input_gene.dataset_id}</p>
                < br />
                <a href={"/dataset/" + props.input_gene.dataset_id}>Link to Dataset</a>
                &nbsp; &nbsp; &nbsp; &nbsp;
                <a href={`https://www.genecards.org/cgi-bin/carddisp.pl?id=${props.input_gene && props.input_gene.name && props.input_gene.name.indexOf('.') >= 0 ? props.input_gene.name.substring(0,props.input_gene.name.indexOf('.')) : props.input_gene.name}&id_type=ensembl` } target="_blank" rel="noopener noreferrer">Gene Cards Link</a>
              </>

              <br />
              <br />
              {Object.keys(props.input_gene).map((single_attr, attr_index) => {
                if (single_attr !== "description" && single_attr !== "dataset_id" && single_attr !== "name" && single_attr !== "id" && single_attr !== "patient_ids" && single_attr !== "gene_values") {
                  return <>
                    <br />
                    <p>{single_attr}: &nbsp; {props.input_gene[single_attr]}</p>
                  </>
                }
                return null;
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