import React from 'react';
import TextField from "@mui/material/TextField";
import { IconButton } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import "./home.css";
import SampleList from './components/SampleList';
import Slider from './components/Slider';


function home() {
  return (
        <div className='home'>
            <h2>
                Human Genomics Search
            </h2>
            <div className='search'>
                <TextField
                    id='input_keyword'
                    variant='outlined'
                    fullWidth
                    label="Search by ...?"
                />
                <IconButton type="submit" aria-label="search">
                    <SearchIcon style={{ fill: "blue" }} />
                </IconButton>
            </div>

            <div className='search-result'>
                <ul className='search-result'>
                    <Slider />
                    <SampleList/>
                </ul>
            </div>

            <div className='search-result'>
                <ul className='search-result'>
                    <li><a href='/upload'>Upload</a></li>
                </ul>
            </div>

        </div>



  );
}

export default home
