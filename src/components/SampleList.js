import React from 'react';
import axios from 'axios';

const URL = `http://127.0.0.1:8000/api/test/preview`

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
          this.state.samples
            .map(sample =>
              <li key={sample.id}><a href={'/data/' + sample.patient_id}>Patient {sample.id} ID: {sample.patient_id}</a>
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
      </ul>
    )
  }
}