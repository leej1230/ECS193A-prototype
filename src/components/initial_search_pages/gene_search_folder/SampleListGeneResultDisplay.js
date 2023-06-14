
import React, { useEffect, useState } from "react";

import axios from "axios";

import CircularProgress from "@mui/material/CircularProgress";
import "./SampleListGeneResultDisplay.css";

import "../../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "../../bootstrap_gene_page/css/sb-admin-2.min.css";

const URL = `${process.env.REACT_APP_BACKEND_URL}/api/patient/all`;

function SampleListGeneResultDisplay(props) {

    const [extended_gene_information, set_extended_gene_information] = useState(undefined);
    const [external_info_null, set_external_info_null] = useState(true);
  
  {/*useEffect(() => {
    if(props.gene){

      //console.log("gene info: ")
      //console.log(props.gene)

      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/dataset_name_from_dataset_id/${props.gene.dataset_id}`)
        .then(async (result) => {
          //console.log(result.data)
          set_dataset_name(String(result.data))
        })
    }
  }, [props]);*/}

  useEffect(() => {

    if(extended_gene_information !== null){
      set_extended_gene_information(null);
      set_external_info_null(true);
    }
    
  }, [props, props.gene]);

  useEffect(() => {
    if(props.gene && 'name' in props.gene && props.gene.name && external_info_null === true && extended_gene_information === null ){

      let temp_gene_name = props.gene.name
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
            //console.log('failed external info fetch!')

            set_extended_gene_information({})
            
          }
        )

        set_external_info_null(false)
      
    }
  }, [external_info_null , extended_gene_information])

  return (
    <div>
        <div id="gene_display_result_single">
            {extended_gene_information ? (
              <>
                <p id="search_gene_result_name_display">{props.gene && 'name' in props.gene && props.gene.name ? props.gene.name : ""} &nbsp; &nbsp; &nbsp; <a id="search_gene_result_link_display" href={props.gene && 'name' in props.gene && 'dataset_name' in props.gene && props.gene.name && props.gene.dataset_name ? "/gene/" + props.gene.name + "/" + props.gene.dataset_name : ""}>Link to Gene Page</a> </p>
                <p id="search_gene_result_info_display">Dataset Name: {props.gene && 'dataset_name' in props.gene && props.gene.dataset_name ? props.gene.dataset_name : ""} &nbsp; &nbsp; &nbsp; Gene Type: {extended_gene_information && 'biotype' in extended_gene_information && extended_gene_information.biotype ? extended_gene_information.biotype : "-"} &nbsp; &nbsp; &nbsp; Other Name: { extended_gene_information && 'display_name' in extended_gene_information && extended_gene_information.display_name ? extended_gene_information.display_name : "-"} &nbsp; &nbsp; &nbsp; </p>
                <hr id="line_div_category_search_content" />
              </>
            )
            :
            (
              <div>
                <CircularProgress />
              </div>
            )}
        </div>

        {/* Gene ID: {props.gene && props.gene.id ? props.gene.id : '-'} &nbsp; &nbsp; &nbsp; */}
        {/* Dataset Name: {dataset_name} &nbsp; &nbsp; &nbsp; Dataset ID: {props.gene && props.gene.dataset_id ? props.gene.dataset_id : '-'} &nbsp; &nbsp; &nbsp;  */}
      

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

export default SampleListGeneResultDisplay;



