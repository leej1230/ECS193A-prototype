import React from 'react';
import axios from 'axios';

const SAMPLE_ID = window.location.pathname.split("/").at(-1)
const URL = `http://127.0.0.1:8000/api/patient/${SAMPLE_ID}`

export default class SampleList extends React.Component {
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
    console.log(this.state.samples)
    return (
      <ul>
        {
            <li key={this.state.samples.id}><b>Patient ID: {this.state.samples.patient_id}</b>
            <ul>
                Gene IDs: {this.state.samples.gene_ids}
            </ul>
            <ul>
                Gene Values: {this.state.samples.gene_values}
            </ul>
            <ul>
                Dataset ID: {this.state.samples.dataset_id}
            </ul>
            </li>
        }
      <div id="unique"></div>
      </ul>
    )
  }
}