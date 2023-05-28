import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./components/main_page_folder/home";
import Navbar from "./components/navbar_folder/navbar";
import SampleList from "./components/initial_search_pages/gene_search_folder/SampleList";
import Sample from "./components/Sample";
import UploadDataset from "./components/dataset_folder/UploadDataset";
import DatasetPage from "./components/dataset_folder/DatasetPage";
import GenePage from "./components/gene_folder/GenePage";
import HomePage from "./components/landing_page_components/HomePage";
import GenePageBootstrap from "./components/bootstrap_gene_page/GenePageBootstrap";
import PrivateRoute from "./privateRoute";
import UpdateDataset from "./components/dataset_folder/UpdateDataset";
import Registration from "./components/user_folder/registration";
import Login from "./components/user_folder/login";
import Profile from "./components/user_folder/profile";
import Management from "./components/user_folder/management";
import DatasetSearchPage from "./components/initial_search_pages/dataset_search_folder/DatasetSearchPage";
import GeneSearchPage from "./components/initial_search_pages/gene_search_folder/GeneSearchPage";
import About from "./components/user_folder/about";
import Contact from "./components/user_folder/contact";

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