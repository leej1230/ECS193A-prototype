
import React, { useEffect, useState } from 'react';

import { Box, Card , CardContent, CardActions, Typography, Button, Table, TableRow, TableCell, TableContainer, TableBody, Paper } from '@mui/material';

import { Link } from 'react-router-dom';
import axios from 'axios';

export default class HomePage extends React.Component {
    
   render(){
       //console.log(this.state.dataset)
     return (
       <div style={{ 
        backgroundImage: `url("https://wp-cpr.s3.amazonaws.com/uploads/2019/07/618922201_1485610661.jpg")` 
      }}>
         
         <div className="titleLayout">
               <h3>{"Genomics Browser"}</h3>
         </div>

         <div className="cardLayout">
           <div className='cardContent'>
             <h4 className='cardTitle'>Helping Researchers and Medical Professionals Work With Genomics Data</h4> 
           </div>
         </div>


        <div className="buttonGroup">
            <button className="buttonElement"> Login </button>
            <button className="buttonElement"> Signup </button>
        </div>


       </div>
     )
   }
}
