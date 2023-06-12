import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminRoute from "./adminRoute";
//import Sample from "./components/Sample";
import GenePageBootstrap from "./components/bootstrap_gene_page/GenePageBootstrap";
import DatasetPage from "./components/dataset_folder/DatasetPage";
import UpdateDataset from "./components/dataset_folder/UpdateDataset";
import UploadDataset from "./components/dataset_folder/UploadDataset";
import GenePage from "./components/gene_folder/GenePage";
import DatasetSearchPage from "./components/initial_search_pages/dataset_search_folder/DatasetSearchPage";
import GeneSearchPage from "./components/initial_search_pages/gene_search_folder/GeneSearchPage";
import SampleList from "./components/initial_search_pages/gene_search_folder/SampleList";
import HomePage from "./components/landing_page_components/HomePage";
import Home from "./components/main_page_folder/home";
import Management from "./components/management/management";
import Navbar from "./components/navbar_folder/navbar";
import About from "./components/user_folder/about";
import Contact from "./components/user_folder/contact";
import Profile from "./components/user_folder/profile";
import PrivateRoute from "./privateRoute";
import StaffRoute from "./staffRoute";

const adminRoutes = [
    {
        path: "/manage",
        element: (
            <>
                <Navbar />
                <Management />
            </>
        ),
    },
];

const staffRoutes = [
    {
        path: "/gene/:name/:dataset_name",
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
        path: "/dataset/:dataset_name",
        element: (
            <>
                <Navbar />
                <DatasetPage />
            </>
        ),
    },
];

const privateRoutes = [
    /*
     * /console must be a private route, as it is the first page after
     * login
     */
    {
        path: "/console",
        element: (
            <>
                <Navbar />
                <Home />
            </>
        ),
    },
    /*{
        path: "/data/:id",
        element: (
            <>
                <Navbar />
                <Sample />
            </>
        ),
    },*/

    {
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
    /*{
        path: "/frontend_test/:id",
        element: (
            <>
                <Navbar />
                <div>
                    <Sample />
                </div>
            </>
        ),
    },*/

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
        ),
    },

    {
        path: "/profile",
        element: (
            <>
                <Navbar />
                <Profile />
            </>
        ),
    },
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
];

function app() {
    return (
        <Router>
            <Routes>
                {publicRoutes.map((route) => (
                    <Route exact path={route.path} element={route.element} />
                ))}
                {privateRoutes.map((route) => (
                    <Route
                        exact
                        path={route.path}
                        element={<PrivateRoute>{route.element}</PrivateRoute>}
                    />
                ))}
                {staffRoutes.map((route) => (
                    <Route
                        exact
                        path={route.path}
                        element={<StaffRoute>{route.element}</StaffRoute>}
                    />
                ))}
                {adminRoutes.map((route) => (
                    <Route
                        exact
                        path={route.path}
                        element={<AdminRoute>{route.element}</AdminRoute>}
                    />
                ))}
            </Routes>
        </Router>
    );
}

export default app;
