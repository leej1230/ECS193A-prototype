import React, { useState } from 'react';
import TextField from "@mui/material/TextField";
import { IconButton } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import "./home.css";
import SampleList from './components/SampleList';
import Slider from './components/Slider';


function Home() {
    const [search, setSearch] = useState('');
    console.log(search)

    return (
        <div className='home'>
            <h2>
                Human Genomics Search
            </h2>
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

            <div className='search-result'>
                <ul className='search-result'>
                    <Slider />
                    <SampleList kword={search}/>/>
                </ul>
            </div>
        </div>
  );
}

export default Home