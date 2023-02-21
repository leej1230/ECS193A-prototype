
import React, { useEffect , useState  } from "react";
import { Box, Card , CardContent, CardActions, Typography } from '@mui/material';
import {Button} from "@mui/material";
import "./Slider.css"
import DatasetList from "./DatasetList"
import axios from 'axios';

/*
,
  {id: 7, name: 'cheetah', description: 'cool stuff', date_published: '05-27-2022', gene_ids: [17,20,23], patient_ids: [74,18,28] },
  {id: 8, name: 'crow', description: '!!!jkhkjh!!!', date_published: '10-20-2022', gene_ids: [19,22,25], patient_ids: [4,9,0] },
  {id: 9, name: 'ant', description: 'komvscsaw%%^', date_published: '12-1-2022', gene_ids: [21,23,26], patient_ids: [34,72,30] }

*/


class SliderItemsContainer extends React.Component {

    state = { index: 0 };
  
    dotClicked = e => {
      this.setState({ index: parseInt(e.target.dataset.index, 10) });
    };
  
    render() {
      return (
        <div className="slider-container">
          <div
            className="slider-innerContainer"
            style={{ left: -100 * this.state.index + "%" }}>
              {this.props.dataset_groups_list.map((child, index) =>
              <div key={index}> <DatasetList datasets_arr={this.props.dataset_groups_list[index]} /> </div>)}
          </div>
          <div className="slider-dots">
            {this.props.dataset_groups_list.map((child, index) =>
              <div key={index} data-index={index} onClick={this.dotClicked}>
                {index === this.state.index ? "◉" : "◌"}
              </div>
            )}
          </div>
        </div>
      );
    }

}

  
export default class Slider extends React.Component {

  state = {
    datasets_list : [],
    groupings: []
  }

  componentDidMount() {
    axios.get(`http://127.0.0.1:8000/api/dataset/all`)
      .then(result => {
        this.setState({
          datasets_list:result.data
        })
     }).then( () => {
      this.setState({
        groupings:this.createDatasetListGroups()
      })
     }  )
  }


  createDatasetListGroups() {

    var num_datasets = this.state.datasets_list.length;
    var num_groups = Math.floor( num_datasets/6);
    var last_group_num_datasets = num_datasets % 6;

    var groups_list = []
    for (let index = 0; index <= num_groups; index++) {
      const start_dataset_index = index * 6;
      var end_dataset_index = start_dataset_index + 6;
      if (index == num_groups) {
        end_dataset_index = start_dataset_index + last_group_num_datasets;
      }
      var cur_group = []
      for (let j = start_dataset_index; j < end_dataset_index; j++) {
        cur_group.push( this.state.datasets_list[j] );
      }
      groups_list.push( cur_group );
    }

    return groups_list;
  };

  render(){  return (
      <div>
        <SliderItemsContainer  dataset_groups_list = {this.state.groupings} >
        </SliderItemsContainer>
      </div>
    );
  }

}
  
  
/*

useEffect( () => {
    let mounted = true;  // mounted means kepp active
    fetch('http://localhost:8000/api/dataset/all/')
    .then(data => data.json()).then(items => {
      if(mounted) {
        setDatasets_list(items)
      }
    })
    return () => mounted = false;
  }, []);

*/