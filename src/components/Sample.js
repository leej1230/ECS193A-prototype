import React from 'react';
import axios from 'axios';
import "../data.css";
import SampleGraph from './apexchartdemo';

const SAMPLE_ID = window.location.pathname.split("/").at(-1)
const URL = `http://127.0.0.1:8000/api/patient/${SAMPLE_ID}`

export default class Sample extends React.Component {
  state = {
    samples: []
  }

  componentDidMount() {
    axios.get(URL)
      .then(res => {
        const samples = res.data;
        this.setState({ samples });
      })
    }
    
  render() {
    if (this.state.samples.length === 0) {
      return <div>Loading...</div>
    }
    
    console.log(this.state.samples)
    return (
      <ul>
        {
            <li key={this.state.samples.id}><b>Patient ID: {this.state.samples.patient_id}</b>
            <table className="patient-data-table">
              <tr>
                {
                  this.state.samples.gene_ids.map((gene_id) => 
                    <th key={gene_id}>{gene_id}</th>
                  )
                }
              </tr>
              <tr>
                {
                  this.state.samples.gene_values.map((gene_value) => 
                    <td key={gene_value}>{gene_value}</td>
                  )
                }
              </tr>
            </table>
            </li>
        }
      <SampleGraph categories={this.state.samples.gene_ids} data={this.state.samples.gene_values}/>
      </ul>
    )
  }
}