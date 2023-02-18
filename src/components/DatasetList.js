import React, { useEffect, useState } from 'react';
import "./DatasetList.css";
import { Box, Card , CardContent, Typography } from '@mui/material';

const URL = `http://127.0.0.1:8000/api/patient/all`

function DatabaseList() {
  const [database_data, setDatabase_data] = useState([]);


  // componentDidMount() {
  //   axios.get(URL)
  //     .then(res => {
  //       const samples = res.data;
  //       this.setState({ samples });
  //     })
  // }
  
  return (
    <div>

         <div className = "outer_grid">
            <div className="dataset_element">
              <Box width='300px'>
                <Card variant="outlined">
       
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'> Dataset1 </Typography>
                  </CardContent>
 
                </Card>
              </Box>
            </div>
            <div className="dataset_element">
              <Box width='300px'>
                <Card variant="outlined">
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'> Dataset2 </Typography>
                  </CardContent>
                </Card>
               
                </Card>
              </Box>
            </div>
            <div className="dataset_element">
              <Box width='300px'>
                <Card variant="outlined">
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'> Dataset3 </Typography>
                  </CardContent>
                </Card>
              </Box>
            </div>
            <div className="dataset_element">
              <Box width='300px'>
                <Card variant="outlined">
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'> Dataset4 </Typography>
                  </CardContent>
                </Card>
              </Box>
            </div>
            <div className="dataset_element">
              <Box width='300px'>
                <Card variant="outlined">
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'> Dataset5 </Typography>
                  </CardContent>
                </Card>
              </Box>
            </div>
            <div className="dataset_element">
              <Box width='300px'>
                <Card variant="outlined">
            
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'> Dataset 6 </Typography>
                  </CardContent>
          
                </Card>
              </Box>
            </div>
            <div className="dataset_element">
              <Box width='300px'>
                <Card>
                  <CardContent>
                    <Typography> <button> Left </button></Typography>
                  </CardContent>
                </Card>
              </Box> 
            </div>
            <div className="dataset_element">
              <Box width='300px'>
                <Card>
                  
                </Card>
              </Box>
            </div>
            <div className="dataset_element">
              <Box width='300px'>
                <Card>
                  <CardContent>
                    <Typography> <button> Right </button> </Typography>
                  </CardContent>
                </Card>
                
              </Box>
            </div>
      </div>
 
    </div>
  )
}

export default DatabaseList