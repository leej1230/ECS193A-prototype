import React from 'react'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import  Home from "./home";
import  Navbar from "./navbar";
import Data from "./data";
import SampleList from './components/SampleList';
import Sample from './components/Sample';
import UploadDataset from './components/UploadDataset';
import DatasetPage from './components/DatasetPage';
import GenePage from './components/GenePage';
import HomePage from './components/HomePage';

function app() {
  return (
    <Router>
        <Routes>
            <Route exact path="/" element={<><Navbar/><Home/></>}/>
            <Route exact path="/data/:id" element={
              <>
                <Navbar/>
                <div>
                  <Sample/>
                </div>
              </>
            }/>
            <Route exact path="/gene/:name/:id" element={
              <>
                <Navbar/>
                <div>
                  <GenePage/>
                </div>
              </>
            }/>
            <Route exact path="/data" element={<><Navbar/><Data/></>}/>
            <Route exact path="/upload" element={<><Navbar/><UploadDataset/></>}/>
            <Route exact path="/frontend_test" element={
              <>
                <Navbar/>
                <div>
                  <SampleList/>
                </div>
              </>
            }/>
            <Route exact path="/frontend_test/:id" element={
              <>
                <Navbar/>
                <div>
                  <Sample/>
                </div>
              </>
            }/>
            <Route exact path="/dataset/:id"  element={
              <>
                <Navbar/>
                <DatasetPage/>
              </>
            }  />
            <Route exact path="/homepage"  element={
              <>
                <HomePage/>
              </>
            }  />
        </Routes>
    </Router>
  );
}

export default app