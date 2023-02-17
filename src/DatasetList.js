import React, { useEffect, useState } from 'react';
import "./DatasetList.css";
import Card from '@mui/material/Card';

const URL = `http://127.0.0.1:8000/api/patient/all`

function DatabaseList() {
  const [database_data, setDatabase_data] = useState([]);


  // componentDidMount() {
  //   axios.get(URL)
  //     .then(res => {
  //       const samples = res.data;
  //       this.setState({ samples });
  //     })
  // }
  
  return (
    <div>
      {

        <div className = "outer_grid">
            <div className="dataset_element"><Card variant="outlined">Dataset1</Card></div>
            <div className="dataset_element"><Card variant="outlined">Dataset1</Card></div>
            <div className="dataset_element"><Card variant="outlined">Dataset1</Card></div>
            <div className="dataset_element"><Card variant="outlined">Dataset1</Card></div>
            <div className="dataset_element"><Card variant="outlined">Dataset1</Card></div>
            <div className="dataset_element"><Card variant="outlined">Dataset1</Card></div>
            <div className="dataset_element"> <button >Default</button> </div>
            <div className="dataset_element">Middle</div>
            <div className="dataset_element"> <button >Default</button> </div>
        </div>

    }
    </div>
  )
}

export default DatabaseList