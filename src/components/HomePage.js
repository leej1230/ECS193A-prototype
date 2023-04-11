
import React, { useEffect, useState } from 'react';

import { Box, Card , CardContent, CardActions, Typography, Button, Table, TableRow, TableCell, TableContainer, TableBody, Paper } from '@mui/material';

import { Link } from 'react-router-dom';
import axios from 'axios';

//import './bootstrap_landing_page_template/css/styles.css'

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "./bootstrap_gene_page/css/sb-admin-2.min.css"

import './HomePage.css'
import { Margin } from '@mui/icons-material';

export default class HomePage extends React.Component {

    render(){
        return(
            <body id="page-top">
            <nav class="navbar navbar-expand navbar-light bg-primary topbar static-top shadow">

                <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                    <i class="fa fa-bars"></i>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item active">
                    <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="#">About</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="#">Contact Us</a>
                    </li>
                </ul>
                </div>

                </nav>

                <div class="bg" >
                    
                </div>
        
   
        <header class="masthead">
            <div class="container">
                <div class="h1 text-white d-flex align-items-center justify-content-center" id="title_website">Genomics Browser</div>
                <div class="h4 text-white d-flex align-items-center justify-content-center">Helping Researchers and Medical Professionals Work With Genomics Data</div>
                <div className="d-flex align-items-center justify-content-center">
                    <button class="btn btn-primary" type="submit">Login</button>&nbsp; &nbsp; &nbsp;  
                    <button class="btn btn-primary" type="submit">Signup</button> 
                </div>
            </div>
        </header>

        <footer class="footer py-4 fixed-bottom bg-secondary">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-4 text-lg-start text-white">Copyright &copy; Your Website 2023</div>
                    <div class="col-lg-4 my-3 my-lg-0 text-white">
                        <a class="btn btn-dark btn-social mx-2" href="#!" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a class="btn btn-dark btn-social mx-2" href="#!" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a class="btn btn-dark btn-social mx-2" href="#!" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                    <div class="col-lg-4 text-lg-end">
                        <a class="link-dark text-decoration-none me-3 text-white" href="#!">Privacy Policy</a>
                        <a class="link-dark text-decoration-none text-white" href="#!">Terms of Use</a>
                    </div>
                </div>
            </div>
        </footer>

        <script src="./bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
        <script src="./bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

        <script src="./bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>

        <script src="./bootstrap_gene_page/js/sb-admin-2.min.js"></script>

        <script src="./bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>

        <script src="./bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
        <script src="./bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>

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
