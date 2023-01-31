import React from 'react'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import  Home from "./home";
import  Navbar from "./navbar";
import Data from "./data";

function app() {
  return (
    <Router>
        <Routes>
            <Route exact path="/" element={<><Navbar/><Home/></>}/>
            <Route exact path="/data" element={<Data />}/>
        </Routes>
    </Router>
  );
}

export default app