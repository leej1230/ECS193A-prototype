import React, { useEffect, useState } from 'react';
import "./DatasetList.css";
import { Box, Card , CardContent, CardActions, Typography } from '@mui/material';
import {Button} from "@mui/material";
import Dataset from "./Dataset"

const URL = `http://127.0.0.1:8000/api/patient/all`

// dataset {
// id: 
// name:
// date_published:
// gene_ids:
// patient_ids:
// }

/*

  <div className="dataset_element">
                  <Box width='300px' maxheight="200px">
                    <Card variant="outlined">
                    <Card>
                      <CardContent>
                        <Typography gutterBottom variant='h5' component='div'> Dataset2 </Typography>
                        <Typography variant="body2" color="text.secondary">Description: alsdfkjasdkf <br /> Date Uploaded: Jan 20,2023 <br /> Size: 3 </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small">Learn more</Button>
                      </CardActions>
                    </Card>
                  
                    </Card>
                  </Box>
                </div>
                <div className="dataset_element">
                  <Box width='300px' maxheight="200px">
                    <Card variant="outlined">
                      <CardContent>
                        <Typography gutterBottom variant='h5' component='div'> Dataset3 </Typography>
                        <Typography variant="body2" color="text.secondary">Description: alsdfkjasdkf <br /> Date Uploaded: Jan 20,2023 <br /> Size: 3 </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small">Learn more</Button>
                      </CardActions>
                    </Card>
                  </Box>
                </div>
                <div className="dataset_element">
                  <Box width='300px' maxheight="200px">
                    <Card variant="outlined">
                      <CardContent>
                        <Typography gutterBottom variant='h5' component='div'> Dataset4 </Typography>
                        <Typography variant="body2" color="text.secondary">Description: alsdfkjasdkf <br /> Date Uploaded: Jan 20,2023 <br /> Size: 3 </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small">Learn more</Button>
                      </CardActions>
                    </Card>
                  </Box>
                </div>
                <div className="dataset_element">
                  <Box width='300px' maxheight="200px">
                    <Card variant="outlined">
                      <CardContent>
                        <Typography gutterBottom variant='h5' component='div'> Dataset5 </Typography>
                        <Typography variant="body2" color="text.secondary">Description: alsdfkjasdkf <br /> Date Uploaded: Jan 20,2023 <br /> Size: 3 </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small">Learn more</Button>
                      </CardActions>
                    </Card>
                  </Box>
                </div>
                <div className="dataset_element">
                  <Box width='300px' maxheight="200px">
                    <Card variant="outlined">
                
                      <CardContent>
                        <Typography gutterBottom variant='h5' component='div'> Dataset 6 </Typography>
                        <Typography variant="body2" color="text.secondary">Description: alsdfkjasdkf <br /> Date Uploaded: Jan 20,2023 <br /> Size: 3 </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small">Learn more</Button>
                      </CardActions>
                    </Card>
                  </Box>
                </div>

*/

class DatabaseList extends React.Component {

  constructor(props){
    super(props)
    console.log( props )
    this.datasets_arr_input = props.datasets_arr;
  };
  
  render() { return (

      <Box width = '1000px'>
        <Card variant='outlined'>
          <CardContent>
            <div className = "outer_grid">

            { this.datasets_arr_input.map((data_set_single, index) =>
              <Dataset dataset = {this.datasets_arr_input[index]} /> )}

            </div>
          </CardContent>
        </Card>

      </Box>
 

    )
  };
}

export default DatabaseList