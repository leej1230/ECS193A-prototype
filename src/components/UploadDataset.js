// https://stackoverflow.com/a/42096508

import React from 'react'
import axios from 'axios';

class UploadDataset extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      file:null,
	  description: ""
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
	this.onDescriptionChange = this.onDescriptionChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }

  onFormSubmit(e){
    e.preventDefault() // Stop form submit
    this.fileUpload(this.state.file, this.state.description).then((response)=>{
      console.log(response.data);
    })
  }

  onFileChange(e) {
    this.setState({file:e.target.files[0]})
  }

  onDescriptionChange(e) {
    this.setState({description:e.target.value})
  }

  fileUpload(file, description){
    const url = 'http://127.0.0.1:8000/api/upload_dataset';
    const formData = new FormData();
    formData.append('file', file)
    formData.append('description', description)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return axios.post(url, formData, config)
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <h1>File Upload</h1>
        <input type="file" onChange={this.onFileChange} />
        <input type="text" name="description" onChange={this.onDescriptionChange} />
        <button type="submit">Upload</button>
      </form>
   )
  }
}



export default UploadDataset