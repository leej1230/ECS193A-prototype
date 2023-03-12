import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./SampleList.css"

const URL = `${process.env.REACT_APP_BACKEND_URL}/api/patient/all`
const GENE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/gene/all`

function SampleList(props) {
  const [patient_data, setPatient_data] = useState([]);
  const [gene_data, setGENE_data] = useState([]);

  useEffect( () => {
    async function fetchPatients() {
      axios.get(URL)
      .then(result => {
        setPatient_data(result.data);
      }).then( () => {
        axios.get(GENE_URL).then( result => {
          console.log(result.data)
          setGENE_data( result.data )
        } )
      } )
    }

    const intervalRun = setInterval(() => {
      fetchPatients()
    }, 10000)

    return () => clearInterval(intervalRun)
  });
  
  return (
    <div>
      <div>
        <h5>Popular Genes</h5>
        {
          gene_data && gene_data.map( (gene_val) =>
            <li class="gene-display"><a href={'/gene/' + gene_val.name + '/'+gene_val.id}>Gene Name: {gene_val.name} ID: {gene_val.id}</a></li>
          )
        }
      </div>
      <div>
      <h5>Patients</h5>
        {
          patient_data && patient_data.filter((word) => {
            return word.patient_id.toLowerCase().includes(props.kword.toLowerCase())
          }).map((patient) =>
              <li class="patient-display"><a href={'/data/' + patient.patient_id}>Patient {patient.id} ID: {patient.patient_id}</a></li>
            )
        }
      </div>
    </div>
  )
}

export default SampleList