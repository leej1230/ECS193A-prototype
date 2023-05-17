import React, { useEffect, useRef, useState } from 'react';

import { Box, Card , CardContent, CardActions, Typography, Button, Table, TableRow, TableCell, TableContainer, TableBody, Paper } from '@mui/material';

import { Link } from 'react-router-dom';
import axios from 'axios';

import ReactPlayer from 'react-player'

//import './bootstrap_landing_page_template/css/styles.css'

import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "./bootstrap_gene_page/css/sb-admin-2.min.css"

import './HomePage.css'

function debounce(fn, ms) {
    let timer
    return _ => {
      clearTimeout(timer)
      timer = setTimeout(_ => {
        timer = null
        fn.apply(this, arguments)
      }, ms)
    };
  }

function HomePage(){

    // orig window dimensions: 1536 x 754 (width x height)
    const [dimensions, setDimensions] = React.useState({ 
        height: window.innerHeight,
        width: window.innerWidth
      })

    // initially width too small so modify for that in initial case
    const [vid_width, setVidWidth] = React.useState(
        Math.ceil( (Math.ceil((window.innerHeight * 16) / 9)) * ( (window.innerWidth / (Math.ceil((window.innerHeight * 16) / 9)) ) + 0.2))
    )
    const [vid_height, setVidHeight] = React.useState( 
        Math.ceil(window.innerHeight * ( (window.innerWidth / (Math.ceil((window.innerHeight * 16) / 9)) ) + 0.2))
      )

    React.useEffect(() => {
    const debouncedHandleResize = debounce(async function handleResize() {

        // aspect ratio: 16 : 9 (width to heigth)
        let new_width = 0;
        let new_height = 0;

        if( (window.innerWidth / window.innerHeight) > (16/9)){
            // height matches but the width does not match
            // width of video smaller
            new_height = window.innerHeight
            new_width = Math.ceil((new_height * 16) / 9)

            // but need to scale up to match window
            // cusion up for safety
            let scale = window.innerWidth / new_width
            scale = scale + 0.2

            new_height = Math.ceil(new_height * scale)
            new_width = Math.ceil(new_width * scale)

        } else {
            // width matches but height of video smaller
            new_width = window.innerWidth
            new_height = Math.floor((new_width * 9) / 16)

            // but need to scale up to match window
            // cusion up for safety
            let scale = window.innerHeight / new_height
            scale = scale + 0.2

            new_height = Math.ceil(new_height * scale)
            new_width = Math.ceil(new_width * scale)
        }

        console.log("aspect ratio cur: ")
        console.log((window.innerWidth / window.innerHeight))
        console.log("new height: ", new_height, "  new width: ", new_width )
        console.log( "window height: ", window.innerHeight, "   window width: ", window.innerWidth )


        await setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
        });

        await setVidWidth(new_width)
        await setVidHeight(new_height)

        
    }, 1000)

    window.addEventListener('resize', debouncedHandleResize)

        return _ => {
        window.removeEventListener('resize', debouncedHandleResize)

        }
    })
    return(
        <body class="home_page_body">

                <nav id="landing_page_navbar" class="navbar navbar-expand bg-transparent shadow">

          
                    <ul class="navbar-nav">
                        <li class="nav-item active">
                        <a class="nav-link" href="#"> <div id="landing_page_nav_text">Home</div> <span class="sr-only">(current)</span></a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#"> <div id="landing_page_nav_text">About</div> </a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#"> <div id="landing_page_nav_text">Contact Us</div> </a>
                        </li>
                    </ul>
            

                </nav>


                <ReactPlayer 
                    id="video_back" 
                    url='https://static.videezy.com/system/resources/previews/000/018/787/original/Komp_2.mp4'
                    loop={true}
                    playing={true}
                    volume={0}
                    muted={true}
                    controls={false}
                    //style={{ minWidth:parseInt(dimensions.width), minHeight:parseInt(dimensions.height),  width: parseInt(dimensions.width), height: parseInt(dimensions.height), position: 'absolute', left: 0, right: 0 }}
                    style={{ minWidth: vid_width, minHeight: vid_height,  width: vid_width, height: vid_height, position: 'absolute', left: 0, right: 0, zindex:-1 }}
                    onLoad={async (response) => {
                        const { width, height } = response.naturalSize;
                        //
                    }}
                    disablePictureInPicture={true}
                    />

            <div id="title_landing_info">
                <div class="h1 text-white d-flex align-items-center justify-content-center" id="title_website">Genomics Browser</div>
                <div class="h4 text-white d-flex align-items-center justify-content-center">Helping Researchers and Medical Professionals Work With Genomics Data</div>
                <div className="d-flex align-items-center justify-content-center">
                    <button class="btn btn-primary" type="submit">Login</button>&nbsp; &nbsp; &nbsp;  
                    <button class="btn btn-primary" type="submit">Signup</button> 
                </div>
            </div>

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

{/*


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

        */}

{/*<video
                autoPlay
                muted
                loop
                style={{ height: "100%", width: "100%", objectFit: "cover" }} //object-fit:cover
                >
                <source src="https://static.videezy.com/system/resources/previews/000/018/787/original/Komp_2.mp4" type="video/mp4" />
                </video>*/}