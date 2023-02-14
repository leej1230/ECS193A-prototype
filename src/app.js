import React from 'react'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import  Home from "./home";
import  Navbar from "./navbar";
import Data from "./data";
import SampleList from './components/SampleList';
import Sample from './components/Sample';

function app() {
  return (
    <Router>
        <Routes>
            <Route exact path="/" element={<><Navbar/><Home/></>}/>
            <Route exact path="/data" element={<><Navbar/><Data/></>}/>
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
        </Routes>
    </Router>
  );
}

export default app