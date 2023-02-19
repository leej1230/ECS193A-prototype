
import React from "react";
import { Box, Card , CardContent, CardActions, Typography } from '@mui/material';
import {Button} from "@mui/material";
import "./Slider.css"
import DatasetList from "./DatasetList"

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
            {this.props.children.map((child, index) =>
              <div key={index}>{child}</div>)}
          </div>
          <div className="slider-dots">
            {this.props.children.map((child, index) =>
              <div key={index} data-index={index} onClick={this.dotClicked}>
                {index === this.state.index ? "◉" : "◌"}
              </div>
            )}
          </div>
        </div>
      );
    }

  }
  
function Slider() {

  var datasets_list = [{id: 0, description: 'jhgjhg', name: 'eagle', date_published: '03-27-2022', gene_ids: [1,5,8], patient_ids: [44,8,20] },
  {id: 1, name: 'fly', description: 'uytu', date_published: '03-27-2022', gene_ids: [2,6,9], patient_ids: [44,8,20] } ,
  {id: 2, name: 'cat', description: 'aaaa', date_published: '04-29-2022', gene_ids: [34,8,90], patient_ids: [45,3,23] },
  {id: 3, name: 'bird', description: '4grdj:{', date_published: '01-13-2022', gene_ids: [7,11,14], patient_ids: [46,3,55] },
  {id: 4, name: 'insect', description: 'FHJGJ', date_published: '07-30-2022', gene_ids: [9,9,9], patient_ids: [49,2,53] },
  {id: 5, name: 'lion', description: 'qmgfdf', date_published: '08-31-2022', gene_ids: [6,10,13], patient_ids: [53,6,57] },
  {id: 6, name: 'deer', description: '1234 gf 9', date_published: '09-3-2022', gene_ids: [12,15,18], patient_ids: [12,0,45] }]
  

  var groupings = createDatasetListGroups();

  function createDatasetListGroups() {
    var num_datasets = datasets_list.length;
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
        cur_group.push( datasets_list[j] );
      }
      groups_list.push( cur_group );
    }

    return groups_list;
  };

    return (
      <div>
        <SliderItemsContainer>
          { groupings.map((data_group, index) =>
              <DatasetList datasets_arr = {groupings[index]} />)}
        </SliderItemsContainer>
      </div>
    );

}
  
export default Slider
  