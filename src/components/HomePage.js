
import React, { useEffect, useState } from 'react';

import { Box, Card , CardContent, CardActions, Typography, Button, Table, TableRow, TableCell, TableContainer, TableBody, Paper } from '@mui/material';

import { Link } from 'react-router-dom';
import axios from 'axios';

import './HomePage.css'

export default class HomePage extends React.Component {

    render(){
        return(
            <div>
                <div id='logo_header'>
                    <div id='logo_item'><img id='logo' src={process.env.PUBLIC_URL+ "/davis_logo.jpg"} /></div>
                </div>
                <div  className='outer_bar'>
                    <div className='bar_group'>
                        <div  className='bar_item'><Link className='bar_link'  to='/' >Home</Link></div>
                        <div  className='bar_item'><Link className='bar_link'  to='/' >About</Link></div>
                        <div  className='bar_item'><Link  className='bar_link' to='/' >Contact</Link></div>
                    </div>
                </div>
                <div className="fullPage" style={{ 
                    //backgroundImage: `url("https://wp-cpr.s3.amazonaws.com/uploads/2019/07/618922201_1485610661.jpg")`,
                    //backgroundImage: `url("https://as2.ftcdn.net/v2/jpg/02/44/28/75/1000_F_244287519_RoEredXSEUy46jCwJLAMruvfmweIr5g9.jpg")`,
                    backgroundImage: `url(${process.env.PUBLIC_URL+ "/homePageImg.jpg"})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    width: '100vw',
                    height: '100vh',
                    backgroundOrigin: 'border-box',
                    backgroundAttachment: 'fixed!important',
                    overflow: 'hidden',
                }}>
            
                <div >
                    <h1 className="title" >{"Genomics Browser"}</h1>
                </div>


                <div >
                    <h4 className="title_caption">Helping Researchers and Medical Professionals Work With Genomics Data</h4> 
                </div>


                <div className="button_group">
                    <button className="button_element" >Login</button>
                    <button className="button_element" >Sign Up</button>
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
