// Add description of the file
// Add URL of the file
// Use material ui for components

import React, { useState } from 'react'
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Button, TextareaAutosize } from '@mui/material';
import './UploadDataset.css';

function UploadDataset(){
    const [selectedFile, setSelectedFile] = useState();
    const [urltoFile, setUrltoFile] = useState("");
    const [description, setDescription] = useState("");
    const [dateCreated, setDateCreated] = useState();
    const [progress, setProgress] = useState(0)
    const [isFilePicked, setIsFilePicked] = useState(false);
    // SelectedFile will be a variable for the file and isFilePicked will be used to verify if file has been picked or not
    const api_url = `${process.env.REACT_APP_BACKEND_URL}/api/upload_dataset`;

    const changeHandler = (e) => {
        setSelectedFile(e.target.files[0]);
        setDateCreated(e.target.files[0].lastModifiedDate);
        setIsFilePicked(true);
    }

    const handleSubmission = () => {
        const formData = new FormData();
        formData.append('file',selectedFile);
        formData.append('description', description)
        formData.append('urltoFile', urltoFile)
        formData.append('dateCreated', dateCreated)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            },
            onUploadProgress: function(e) {
              setProgress(Math.round( (e.loaded * 100) / e.total))
            }
        }
        axios.post(api_url, formData, config)
        .then((result) => {
          console.log('Success', result)
          alert("Data has been posted")
        })
        .catch((error) => {
          console.error('Post failed', error);
          alert("Due to some error, data has not been posted")
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
            {isFilePicked?(
                <div>
                  <h5>File Name: {selectedFile.name}</h5>
                </div>
              ):(
                <div>
                  <h5>File Not Selected</h5>
                </div>
              )

            }
          </div>

          <div className='text-area'>
            <TextareaAutosize
              aria-label="empty textarea"
              placeholder="Description"
              style={{ width: 200 }}
              onChange = {(e)=>setDescription(e.target.value)}
            />
          </div>

          <div className='text-area'>
            <TextareaAutosize
              aria-label="empty textarea"
              placeholder="URL"
              style={{ width: 200 }}
              onChange = {(e)=>setUrltoFile(e.target.value)}
            />
          </div>

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
                backgroundColor: '#3e98c7',
              })}
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

// class UploadDataset extends React.Component {

//   constructor(props) {
//     super(props);
//     this.state ={
//       file:null,
//       description: "",
//       dateCreated: null
//     }
//     this.onFormSubmit = this.onFormSubmit.bind(this)
//     this.onFileChange = this.onFileChange.bind(this)
//     this.onDescriptionChange = this.onDescriptionChange.bind(this)
//     this.fileUpload = this.fileUpload.bind(this)
//   }

//   onFormSubmit(e){
//     e.preventDefault() // Stop form submit
//     this.fileUpload(this.state.file, this.state.description).then((response)=>{
//       console.log(response.data);
//     })
//   }

//   onFileChange(e) {
//     this.setState({file:e.target.files[0]})
//     this.setState({dateCreated: e.target.files[0].lastModifiedDate})
//   }

//   onDescriptionChange(e) {
//     this.setState({description:e.target.value})
//   }

//   fileUpload(file, description){
//     const url = `${process.env.REACT_APP_BACKEND_URL}/api/upload_dataset`;
//     const formData = new FormData();
//     formData.append('file', file)
//     formData.append('description', description)
//     formData.append('dateCreated', this.state.dateCreated)
//     const config = {
//         headers: {
//             'content-type': 'multipart/form-data'
//         }
//     }
//     if (this.state.file) {
//       console.log(this.state)
//       return axios.post(url, formData, config)
//     }
//   }

//   render() {
//     return (
//       <form onSubmit={this.onFormSubmit}>
//         <h1>File Upload</h1>
//         <input type="file" onChange={this.onFileChange} />
//         <input type="text" name="description" onChange={this.onDescriptionChange} />
//         <button type="submit">Upload</button>
//       </form>
//    )
//   }
// }



export default UploadDataset