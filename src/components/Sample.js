import React, {useEffect,useState} from 'react';
import axios from 'axios';
import "../data.css";
import SampleGraph from './echartdemo';

const SAMPLE_ID = window.location.pathname.split("/").at(-1)
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/patient/${SAMPLE_ID}`

function Sample() {
  // state = {samples: []}
  const [patient_data, setPatient_data] =  useState();

  // componentDidMount() {
  useEffect( () => {
    async function fetchPatientData() {
      const res = await axios.get(URL)
      setPatient_data(res.data);
      // .then(res => {
      // })
    }
    fetchPatientData()
  });
  

  return (
    <div>
      {patient_data ? (
        <ul>
            <li key={patient_data.patient_id}><b>Patient ID: {patient_data.patient_id}</b>
              <table className="patient-data-table">
                <tr>
                  {
                    patient_data.gene_ids.map((gene_id) => 
                    <th key={gene_id}>{gene_id}</th>
                    )
                  }
                </tr>
                <tr>
                  {
                    patient_data.gene_values.map((gene_value) => 
                    <td key={gene_value}>{gene_value}</td>
                    )
                  }
                </tr>
              </table>
            </li>
            <SampleGraph categories={patient_data.gene_ids} data={patient_data.gene_values}/>
        </ul>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default Sample
