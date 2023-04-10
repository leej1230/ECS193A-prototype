
import React, { useEffect, useState } from 'react';

import { Box, Card , CardContent, CardActions, Typography, Button, Table, TableRow, TableCell, TableContainer, TableBody, Paper } from '@mui/material';

import { Link } from 'react-router-dom';
import axios from 'axios';

//import './HomePage.css'
//import './bootstrap_landing_page_template/css/styles.css'

export default class HomePage extends React.Component {

    render(){
        return(
            <body id="page-top">

        <nav class="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
            <div class="container">
                <div class="collapse navbar-collapse" id="navbarResponsive">
                    <ul class="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
                        <li class="nav-item"><a class="nav-link" href="#services">Services</a></li>
                        <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
                        <li class="nav-item"><a class="nav-link" href="#team">Team</a></li>
                        <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
                    </ul>
                </div>
            </div>
        </nav>
   
        <header class="masthead">
            <div class="container">
                <div class="masthead-heading text-uppercase">Genomics Browser</div>
                <div class="masthead-subheading">Helping Researchers and Medical Professionals Work With Genomics Data</div>
                <button class="btn btn-primary" type="submit">Login</button>&nbsp; &nbsp; &nbsp;  
                <button class="btn btn-primary" type="submit">Signup</button> 
            </div>
        </header>

        <footer class="footer py-4">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-4 text-lg-start">Copyright &copy; Your Website 2023</div>
                    <div class="col-lg-4 my-3 my-lg-0">
                        <a class="btn btn-dark btn-social mx-2" href="#!" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a class="btn btn-dark btn-social mx-2" href="#!" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a class="btn btn-dark btn-social mx-2" href="#!" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                    <div class="col-lg-4 text-lg-end">
                        <a class="link-dark text-decoration-none me-3" href="#!">Privacy Policy</a>
                        <a class="link-dark text-decoration-none" href="#!">Terms of Use</a>
                    </div>
                </div>
            </div>
        </footer>

    </body>
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

   /*
   <div className="container">
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
                    <h4 className="title_caption">Helping Researchers and Medical Professionals Work With Genomics Data ####</h4> 
                </div>


                <div className="button_group">
                    <button className="button_element" >Login</button>
                    <button className="button_element" >Sign Up</button>
                </div>
            </div>
            </div>
   */
