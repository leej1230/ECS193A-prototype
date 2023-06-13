import React from 'react';
import "./GeneCard.css";
import axios from "axios";
import { useEffect, useState } from "react";

import LimitedText from '../../filters/LimitedText';

import "../../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "../../bootstrap_gene_page/css/sb-admin-2.min.css"

function GeneCard(props) {

  const [extended_gene_information, set_extended_gene_information] = useState(undefined);
  const [dataset_name, set_dataset_name] = useState("---");
  
  {/*useEffect(() => {

    if(props.gene && 'dataset_name' in props.gene && props.gene.dataset_name != null){
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/dataset_name_from_dataset_id/${props.gene.dataset_id}`)
        .then(async (result) => {

          set_dataset_name(String(result.data))
        })
    }
  }, [props]);*/}

  useEffect(() => {

    if( props.gene && 'name' in props.gene && props.gene.name ){

      let temp_gene_name = props.gene.name;
      let end_index = temp_gene_name.indexOf( "." )
      if( end_index >= 0 ){
        // present
        temp_gene_name = temp_gene_name.substring(0, end_index )
      }

      const external_url = `https://rest.ensembl.org/lookup/id/${temp_gene_name}?expand=1;content-type=application/json`;

      axios.get(external_url)
        .then(async (result) => {
          set_extended_gene_information({ display_name: result.data["display_name"] , biotype: result.data["biotype"] , description: result.data["description"], assembly_name: result.data["assembly_name"] })
        }).catch(
          function (error) {
            console.log('failed external info fetch!')
            
          }
        )
      
    }
  }, [props]);

  return (
    <div> 
      <div class="card" style={{minWidth: `${parseInt( ((0.7 * props.curOuterWindowWidth) - 60) / 3)}px`, maxWidth: `${parseInt( ((0.7 * props.curOuterWindowWidth) - 60) / 3)}px`, minHeight: '175px', maxHeight: '175px', overflow:'hidden'}}>
        <div class="card-body">
          <h5 class="card-title"><a href={props.gene && 'name' in props.gene && 'dataset_name' in props.gene && props.gene.name && props.gene.dataset_name ? "/gene/" + props.gene.name + "/" + props.gene.dataset_name : ""} onClick={() => {
            }} >{props.gene && 'name' in props.gene && props.gene.name ? props.gene.name : ""}</a></h5>
          {/*<LimitedText numLines='1' text={`Gene ID: ${props.gene && props.gene.id ? props.gene.id : "-"}`} /> */}
          <LimitedText numLines='1' text={`Gene Type: ${extended_gene_information && 'biotype' in extended_gene_information ? extended_gene_information.biotype : "Protein Coding"}`} />
          <LimitedText numLines='1' text={`Other Name: ${extended_gene_information && 'display_name' in extended_gene_information ? extended_gene_information.display_name : "---" }`} />
          <LimitedText numLines='1' text={`Dataset Name: ${ props.gene && 'dataset_name' in props.gene && props.gene.dataset_name ? props.gene.dataset_name : "" }`} />

          {/* Dataset ID: ${props.gene && props.gene.dataset_id ? props.gene.dataset_id : "-"} */}

          {/*<LimitedText text={props.gene ? props.gene.description : ""} />*/}
          
          {/*<p >{props.gene.description}</p>*/}
          <br />
          
        </div>
      </div>

      <script src="../../bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
      <script src="../../bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="../../bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>
      <script src="../../bootstrap_gene_page/js/sb-admin-2.min.js"></script>
      <script src="../../bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>
      <script src="../../bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
      <script src="../../bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>
    </div>
  );
}

export default GeneCard;

/*
class="btn btn-primary btn-sm"
*/