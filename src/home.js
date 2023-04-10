import React, { useState } from 'react';
import TextField from "@mui/material/TextField";
import { IconButton, Button } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import "./home.css";
import SampleList from './components/SampleList';
import Slider from './components/Slider';



function Home() {
    const [search, setSearch] = useState('');
    return (
        <body id="page-top">

      <div id="wrapper">

            <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                <hr class="sidebar-divider my-0" />

                <li class="nav-item active">
                    <a class="nav-link" href="index.html">
                        <i class="fas fa-fw fa-tachometer-alt"></i>
                        <span>Dashboard</span></a>
                </li>

                <hr class="sidebar-divider"></hr>

                <div class="sidebar-heading">
                    Interface
                </div>

                <li class="nav-item">
                    <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo"
                        aria-expanded="true" aria-controls="collapseTwo">
                        <i class="fas fa-fw fa-cog"></i>
                        <span>Components</span>
                    </a>
                    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                        <div class="bg-white py-2 collapse-inner rounded">
                            <h6 class="collapse-header">Custom Components:</h6>
                            <a class="collapse-item" href="buttons.html">Buttons</a>
                            <a class="collapse-item" href="cards.html">Cards</a>
                        </div>
                    </div>
                </li>

                <li class="nav-item">
                    <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilities"
                        aria-expanded="true" aria-controls="collapseUtilities">
                        <i class="fas fa-fw fa-wrench"></i>
                        <span>Utilities</span>
                    </a>
                    <div id="collapseUtilities" class="collapse" aria-labelledby="headingUtilities"
                        data-parent="#accordionSidebar">
                        <div class="bg-white py-2 collapse-inner rounded">
                            <h6 class="collapse-header">Custom Utilities:</h6>
                            <a class="collapse-item" href="utilities-color.html">Colors</a>
                            <a class="collapse-item" href="utilities-border.html">Borders</a>
                            <a class="collapse-item" href="utilities-animation.html">Animations</a>
                            <a class="collapse-item" href="utilities-other.html">Other</a>
                        </div>
                    </div>
                </li>

                <hr class="sidebar-divider" />

                <div class="sidebar-heading">
                    Addons
                </div>

                <li class="nav-item">
                    <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages"
                        aria-expanded="true" aria-controls="collapsePages">
                        <i class="fas fa-fw fa-folder"></i>
                        <span>Pages</span>
                    </a>
                    <div id="collapsePages" class="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
                        <div class="bg-white py-2 collapse-inner rounded">
                            <h6 class="collapse-header">Login Screens:</h6>
                            <a class="collapse-item" href="login.html">Login</a>
                            <a class="collapse-item" href="register.html">Register</a>
                            <a class="collapse-item" href="forgot-password.html">Forgot Password</a>
                            <div class="collapse-divider"></div>
                            <h6 class="collapse-header">Other Pages:</h6>
                            <a class="collapse-item" href="404.html">404 Page</a>
                            <a class="collapse-item" href="blank.html">Blank Page</a>
                        </div>
                    </div>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="/homepage">
                        <i class="fas fa-fw fa-chart-area"></i>
                        <span>Landing Page</span></a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="/gene_bootstrap">
                        <i class="fas fa-fw fa-table"></i>
                        <span>Bootstrap Sample Page</span></a>
                </li>

                <hr class="sidebar-divider d-none d-md-block" />

            </ul>

      <div id="content-wrapper" class="d-flex flex-column">


          <div id="content">
                    
            <div class="row justify-content-end">
                <div class="col-md-12 bg-light text-right mr-5 mt-5">
                    <a href="/upload" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                            class="fas fa-upload fa-sm text-white-50"></i>Upload</a>
                </div>
            </div>

                    <div class="row justify-content-center">
                        <h3 class="h3 mb-5 text-gray-800">
                            Human Genomics Search
                        </h3>
                    </div>

                    <div class="row justify-content-center mt-5 mb-5">
                            <div className='search'>
                                <TextField
                                    id='input_keyword'
                                    onChange={(e) => setSearch(e.target.value)}
                                    variant='outlined'
                                    fullWidth
                                    label="Search by gene names or dataset name"
                                />
                                <IconButton type="submit" aria-label="search">
                                <SearchIcon style={{ fill: "blue" }} />
                                </IconButton>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className='search-result mb-5 mt-5'>
                            <ul className='search-result'>
                                <Slider />
                            </ul>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div class="card shadow mb-4">
                            <div class="card-header py-3">
                                <SampleList kword={search}/>
                            </div>
                        </div>
                    </div>

                    </div>
             
            </div>
        </div>
    </body>


  );
}

export default Home