import React, { useEffect, useState } from 'react';
import axios from 'axios';

const URL = `http://127.0.0.1:8000/api/patient/all`

function SampleList(props) {
  const [patient_data, setPatient_data] = useState([]);

  useEffect( () => {
    async function fetchPatients() {
      axios.get(URL)
      .then(result => {
        setPatient_data(result.data);
      })
      // const result = await axios(URL);
      // result = await result.json()
      // setPatient_data(result.data);
    }
    fetchPatients()
    // console.log(patient_data)
  });
  // state = {
  //   samples: []
  // }

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
        patient_data && patient_data.filter((word) => {
          return props.kword.toLowerCase() === '' ? word : word.patient_id.toLowerCase().includes(props.kword.toLowerCase())
        }).map((patient) =>
            <li key={patient.patient_id}><a href={'/data/' + patient.patient_id}>Patient {patient.id} ID: {patient.patient_id}</a>
              {/* <ul>
                Gene IDs: {sample.gene_ids}
              </ul>
              <ul>
                Gene Values: {sample.gene_values}
              </ul>
              <ul>
                Dataset ID: {sample.dataset_id}
              </ul> */}
            </li>
          )
      }
    </div>
  )
}

export default SampleList