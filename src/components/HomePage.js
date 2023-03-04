
import React, { useEffect, useState } from 'react';

import { Box, Card , CardContent, CardActions, Typography, Button, Table, TableRow, TableCell, TableContainer, TableBody, Paper } from '@mui/material';

import { Link } from 'react-router-dom';
import axios from 'axios';

export default class HomePage extends React.Component {
    render(){
        return(
            <div>
                <ul className='bar'>
                    <li className='bar'><a href='#/' className='bar'>Home</a></li>
                    <li className='bar'><a href='#/' className='bar'>About</a></li>
                    <li className='bar'><a href='#/' className='bar'>Contact</a></li>
                </ul>
                <div className="fullPage" style={{ 
                    backgroundImage: `url("https://wp-cpr.s3.amazonaws.com/uploads/2019/07/618922201_1485610661.jpg")`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    width: '100vw',
                    height: '100vh',
                    backgroundOrigin: 'border-box',
                    backgroundAttachment: 'fixed!important',
                    overflow: 'hidden'
                }}>
            
                <div >
                    <h3>{"Genomics Browser"}</h3>
                </div>


                <div >
                    <h4 >Helping Researchers and Medical Professionals Work With Genomics Data</h4> 
                </div>
            </div>
            </div>

            
        )
    }
   
}

/*

render(){
       //console.log(this.state.dataset)
     return (
        <div className="fullPage" style={{ 
                backgroundImage: `url("https://wp-cpr.s3.amazonaws.com/uploads/2019/07/618922201_1485610661.jpg")`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh',
                backgroundOrigin: 'border-box'
            }}>
         
            <div >
                <h3>{"Genomics Browser"}</h3>
            </div>


            <div >
                <h4 >Helping Researchers and Medical Professionals Work With Genomics Data</h4> 
            </div>
        </div>
     )
   }
   */
