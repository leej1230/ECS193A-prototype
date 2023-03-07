import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./SampleList.css"

const URL = `${process.env.REACT_APP_BACKEND_URL}/api/patient/all`

function SampleList(props) {
  const [patient_data, setPatient_data] = useState([]);

  useEffect( () => {
    async function fetchPatients() {
      axios.get(URL)
      .then(result => {
        setPatient_data(result.data);
      })
    }

    const intervalRun = setInterval(() => {
      fetchPatients()
    }, 10000)

    return () => clearInterval(intervalRun)
  });
  
  return (
    <div>
      {
        patient_data && patient_data.filter((word) => {
          return word.patient_id.toLowerCase().includes(props.kword.toLowerCase())
        }).map((patient) =>
            <li class="patient-display"><a href={'/data/' + patient.patient_id}>Gene {patient.id} ID: {patient.patient_id}</a></li>
          )
      }
    </div>
  )
}

export default SampleList