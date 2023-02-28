import React, { useEffect, useState } from 'react';
import "./Dataset.css";
import { Box, Card , CardContent, CardActions, Typography } from '@mui/material';
import {Button} from "@mui/material";


export default class Dataset extends React.Component {

    
  render() {
    
    return (
      <div className="dataset_element">
        <Box width='300px' maxheight="200px">
          <Card variant="outlined">
            <CardContent>
              <Typography gutterBottom variant='h5' component='div'> Dataset <br /> Name: {this.props.dataset.name} </Typography>
                <Typography variant="body2" color="text.secondary">Description: {this.props.dataset.description} </Typography>
              </CardContent>
            <CardActions>
              <a href={"/dataset/" + this.props.dataset.id}> Learn more </a>
            </CardActions>
          </Card>
        </Box>
      </div>
    )
  }
}
