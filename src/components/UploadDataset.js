// https://stackoverflow.com/a/42096508

// Add description of the file
// Add URL of the file
// Use material ui for components

import React, { useState } from 'react'
import axios from 'axios';
import { Button, TextareaAutosize } from '@mui/material';
import './UploadDataset.css';

function UploadDataset(){
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    // SelectedFile will be a variable for the file and isFilePicked will be used to verify if file has been picked or not
    const api_url = 'http://127.0.0.1:8000/api/upload_dataset';

    const changeHandler = (e) => {
        setSelectedFile(e.target.files[0]);
        setIsFilePicked(true);
    }

    const handleSubmission = () => {
        const formData = new FormData();
        formData.append('file',selectedFile);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        axios.post(api_url, formData, config)
        .then((result) => {
          console.log('Success', result)
        })
        .catch((error) => {
          console.error('Post failed', error);
        })
    }
    
    return(
      <div className='form-container'>
          <div>
            <h1>File Upload</h1>
          </div>

          <div className='submit-button'>
            <Button variant="contained" component="label">
              Upload
              <input hidden type="file" onChange={changeHandler} />
            </Button>
          </div>

          <div className='text-area'>
            <TextareaAutosize
              aria-label="empty textarea"
              placeholder="Description"
              style={{ width: 200 }}
            />
          </div>

          <div className='text-area'>
            <TextareaAutosize
              aria-label="empty textarea"
              placeholder="URL"
              style={{ width: 200 }}
            />
          </div>

          <div className='submit-button'>
          {isFilePicked ?(
            <Button onClick={handleSubmission} variant="contained">
              Submit
            </Button>
          ):(
            <Button variant="contained" disabled>
              Submit
            </Button>
          )}
          </div>
      </div>
    )
}

/*
function UploadDataset() {

  constructor(props) {
    super(props);
    this.state ={
      file:null
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }

  function onFormSubmit(e){
    e.preventDefault() // Stop form submit
    this.fileUpload(this.state.file).then((response)=>{
      console.log(response.data);
    })
  }

  onChange(e) {
    this.setState({file:e.target.files[0]})
  }

  function fileUpload(file){
    const url = 'http://127.0.0.1:8000/api/upload_dataset';
    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return axios.post(url, formData,config)
  }

  return (
    <form onSubmit={this.onFormSubmit}>
      <h1>File Upload</h1>
      <input type="file" onChange={this.onChange} />
      <button type="submit">Upload</button>
    </form>
  )
}
*/

export default UploadDataset