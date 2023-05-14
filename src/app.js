import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./home";
import Navbar from "./navbar";
import Data from "./data";
import SampleList from "./components/SampleList";
import Sample from "./components/Sample";
import UploadDataset from "./components/UploadDataset";
import DatasetPage from "./components/DatasetPage";
import GenePage from "./components/GenePage";
import HomePage from "./components/HomePage";
import GenePageBootstrap from "./components/bootstrap_gene_page/GenePageBootstrap";
import PrivateRoute from "./privateRoute";
import UpdateDataset from "./components/UpdateDataset";
import Registration from "./registration";
import Login from "./login";

const privateRoutes = [
  {
    path: "/console",
    element: (
      <>
        <Navbar /> <Home />
      </>
    ),
  },
  {
    path: "/data/:id",
    element: (
      <>
        <Navbar />
        <div>
          <Sample />
        </div>
      </>
    ),
  },
  {
    path: "/gene/:name/:id",
    element: (
      <>
        <Navbar />
        <div>
          <GenePage />
        </div>
      </>
    ),
  },
  {
    path: "/data",
    element: (
      <>
        <Navbar />
        <Data />
      </>
    ),
  },
  {
    path: "/upload",
    element: (
      <>
        <Navbar />
        <UploadDataset />
      </>
    ),
  },
  {
    path: "/frontend_test",
    element: (
      <>
        <Navbar />
        <div>
          <SampleList />
        </div>
      </>
    ),
  },
  {
    path: "/frontend_test/:id",
    element: (
      <>
        <Navbar />
        <div>
          <Sample />
        </div>
      </>
    ),
  },
  {
    path: "/dataset/:id",
    element: (
      <>
        <Navbar />
        <DatasetPage />
      </>
    ),
  },
  {
    path: "/gene_bootstrap",
    element: (
      <>
        <GenePageBootstrap />
      </>
    ),
  },
  // {
  //   path: "/registration",
  //   element: (
  //     <>
  //       <Navbar />
  //       <Registration />
  //     </>
  //   ),
  // },
  // {
  //   path: "/login",
  //   element: (
  //     <>
  //       <Navbar />
  //       <Login />
  //     </>
  //   ),
  // },
];

const publicRoutes = [
  {
    path: "/",
    element: (
      <>
        <HomePage />
      </>
    ),
  },
]

function app() {
  return (
    <Router>
      <Routes>
        {publicRoutes.map((route) => (
          <Route exact path={route.path} element={route.element} />
        ))}
        {privateRoutes.map((route) => (
          // <Route exact path={route.path} element={<PrivateRoute component={() => route.element} />} />
          <Route exact path={route.path} element={<PrivateRoute element={route.element} />} />
        ))}
      </Routes>
    </Router>
  );
}

export default app;