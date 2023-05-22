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
import Profile from "./profile";
import Management from "./management";
import DatasetSearchPage from "./components/DatasetSearchPage";
import GeneSearchPage from "./components/GeneSearchPage";
import About from "./about";
import Contact from "./contact";

const privateRoutes = [
  {
    path: "/console",
    element: <><Navbar /><Home /></>,
  },
  {
    path: "/data/:id",
    element: (
      <>
        <Navbar />
        <Sample />
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
  },{
    path: "/search_datasets_page",
    element: (
      <>
        <Navbar />
        <div>
          <DatasetSearchPage />
        </div>
      </>
    ),
  },
  {
    path: "/search_genes_page",
    element: (
      <>
        <Navbar />
        <div>
          <GeneSearchPage />
        </div>
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
    element:
      <>
        <Navbar />
        <DatasetPage />
      </>
  },
  {
    path: "/gene_bootstrap",
    element: (
      <>
        <GenePageBootstrap />
      </>
    ),
  },
  {
    path: "/update/dataset",
    element: (
      <>
        <Navbar />
        <UpdateDataset />
      </>
    )
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
  {
    path: "/profile",
    element: (
      <>
        <Navbar />
        <Profile />
      </>
    )
  },
  {
    path: "/manage",
    element: (
      <>
        <Navbar />
        <Management />
      </>
    )
  }
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
  {
    path: "/about",
    element: (
      <>
        <About />
      </>
    ),
  },
  {
    path: "/contact",
    element: (
      <>
        <Contact />
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
          <Route exact path={route.path} element={<PrivateRoute>{route.element}</PrivateRoute>} />
        ))}
      </Routes>
    </Router>
  );
}

export default app;