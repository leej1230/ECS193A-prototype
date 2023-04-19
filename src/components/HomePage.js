import React, { useEffect, useState } from 'react';

import { Box, Card , CardContent, CardActions, Typography, Button, Table, TableRow, TableCell, TableContainer, TableBody, Paper } from '@mui/material';

import { Link } from 'react-router-dom';
import axios from 'axios';

//import './bootstrap_landing_page_template/css/styles.css'

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "./bootstrap_gene_page/css/sb-admin-2.min.css"

import './HomePage.css'
import { Margin } from '@mui/icons-material';

function HomePage(){
    return(
        <body id="page-top" class="home_page_body">
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
    


        <div class="container">
            <div class="h1 text-white d-flex align-items-center justify-content-center" id="title_website">Genomics Browser</div>
            <div class="h4 text-white d-flex align-items-center justify-content-center">Helping Researchers and Medical Professionals Work With Genomics Data</div>
            <div className="d-flex align-items-center justify-content-center">
                <button class="btn btn-primary" type="submit">Login</button>&nbsp; &nbsp; &nbsp;  
                <button class="btn btn-primary" type="submit">Signup</button> 
            </div>
        </div>


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

export default HomePage