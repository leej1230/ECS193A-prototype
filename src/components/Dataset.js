import React, { useEffect, useState } from 'react';
import "./Dataset.css";
import { Box, Card , CardContent, CardActions, Typography } from '@mui/material';
import {Button} from "@mui/material";


export default class Dataset extends React.Component {

  constructor(props){
    super(props)
    this.input_dataset = props.dataset;
  };
    
  render() {
    
    return (
      <div className="dataset_element">
        <Box width='300px' maxheight="200px">
          <Card variant="outlined">
            <CardContent>
              <Typography gutterBottom variant='h5' component='div'> Dataset {this.input_dataset.id} <br /> Name: {this.input_dataset.name} </Typography>
                <Typography variant="body2" color="text.secondary">Description: {this.input_dataset.description} <br /> Date Uploaded: {this.input_dataset.published_date} </Typography>
              </CardContent>
            <CardActions>
              <Button size="small">Learn more</Button>
            </CardActions>
          </Card>
        </Box>
      </div>
    )
  }
}