import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import "./UpdateDataset.css"

import "../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "../bootstrap_gene_page/css/sb-admin-2.min.css"

function UpdateDataset(){
    //const [selectedFile, setSelectedFile] = useState(null);
    const [urltoFile, setUrltoFile] = useState("");
    const [description, setDescription] = useState("");
    //const [datasetID, setDatasetID] = useState(0);
    const [datasetName, setDatasetName] = useState(0);
    const [dateCreated, setDateCreated] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isFilePicked, setIsFilePicked] = useState(false);
    // SelectedFile will be a variable for the file and isFilePicked will be used to verify if file has been picked or not
    const api_url = `${process.env.REACT_APP_BACKEND_URL}/api/update_dataset`;

    {/*const changeHandler = (e) => {
        setSelectedFile(e.target.files[0]);
        setDateCreated(e.target.files[0].lastModifiedDate);
        setIsFilePicked(true);
    }*/}

    const handleSubmission = () => {
        const formData = new FormData();

        //console.log(selectedFile);
        console.log(urltoFile);
        console.log(dateCreated);
        console.log(isFilePicked);
        console.log(datasetName)
        

        //formData.append( 'file' , selectedFile );
        formData.append('datasetName', datasetName );
        formData.append('description', description );
        formData.append('urltoFile', urltoFile );
        //formData.append('dateCreated', dateCreated );
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            },
            onUploadProgress: function(e) {
              setProgress(Math.round( (e.loaded * 100) / e.total))
            }
        }

        console.log(api_url);

        axios.post(api_url, formData, config)
        .then((result) => {
          console.log('Success', result)
          alert("Data has been updated")
        })
        .catch((error) => {
          console.error('Update failed', error);
          alert("Due to some error, data has not been updated");
        })
    }
    
    return(
      <div id="outer_cont" className='form-container'>
        
          <div>
            <h1></h1>
          </div>

          <div class="card shadow mb-4">
              <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between ">
                  <h5 class="m-0 font-weight-bold text-primary">Update Form</h5>
              </div>
              <div class="card-body">
                <form>
                  <div class="form-group">
                  {/*<div class="mb-3">
                    <label for="formFile" class="form-label">Dataset CSV File Update</label>
                    <input class="form-control" type="file" id="formFile" onChange={(e)=>changeHandler(e)} />
                  </div>*/}
                  </div>
                  {/*<div class="form-group">
                    <label for="exampleInputEmail1">Dataset ID (original, can't be updated)</label>
                    <input type="number" class="form-control"  onChange = {(e)=>setDatasetID(e.target.value)} />
                </div>*/}
                <div class="form-group">
                    <label for="exampleInputEmail1">Dataset Name (original, can't be updated)</label>
                    <input type="text" class="form-control"  onChange = {(e)=>setDatasetName(e.target.value)} />
                </div>
                  <div class="form-group">
                    <label for="exampleInputEmail1">Description Update</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange = {(e)=>setDescription(e.target.value)} />
                  </div>
                  <div class="form-group">
                    <label for="exampleInputPassword1">URL Update</label>
                    <input type="url" class="form-control" id="exampleInputPassword1" onChange={(e)=>setUrltoFile(e.target.value)} />
                  </div>
                  <button type="button" class="btn btn-primary" onClick={handleSubmission}>Submit</button>
                </form> 

                {/*<div class="row justify-content-center">
                  
                      <div className='progress-bar' style={{ width: 200, height: 200 }}>
                        <CircularProgressbar 
                          value={progress} 
                          text={`${progress}%`}
                          styles={buildStyles({
                            // How long animation takes to go from one percentage to another, in seconds
                            pathTransitionDuration: 0.5,

                            textSize: '10px',
                            text:{dominantBaseline: 'middle', textAnchor: 'middle'},
                            root:{verticalAlign: "middle"},
                        
                            // Colors
                            pathColor: `rgba(62, 152, 199`,
                            trailColor: '#d6d6d6',
                            backgroundColor: '#03fc80',
                          })}
                        />
                      </div>
                  </div>*/}

              </div>

          </div>

          

          <script src="../bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
          <script src="../bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

          <script src="../bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>

          <script src="../bootstrap_gene_page/js/sb-admin-2.min.js"></script>

          <script src="../bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>

          <script src="../bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
          <script src="../bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>

      </div>
    )
}


export default UpdateDataset