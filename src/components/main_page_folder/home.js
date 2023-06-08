import axios from "axios";
import React, { useEffect, useState } from "react";
import "./home.css";

import "../bootstrap_gene_page/css/sb-admin-2.min.css";
import "../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";

import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "@trendmicro/react-sidenav/dist/react-sidenav.css";

import GetUserAfterRender from "../../util/getUser";
import DashboardSidebar from "../dashboard_side/dashboardSidebar";

function debounce(fn, ms) {
    let timer
    return _ => {
        clearTimeout(timer)
        timer = setTimeout(_ => {
            timer = null
            fn.apply(this, arguments)
        }, ms)
    };
}

function Home() {
    const [gene_count, set_gene_count] = useState(0);
    const [dataset_count, set_dataset_count] = useState(0);
    const [height_link_cards] = useState("300px");

    // orig window dimensions: 1536 x 754 (width x height)
    const [dimensions, setDimensions] = React.useState({
        height: window.innerHeight,
        width: window.innerWidth
    })

    const [ dataset_img_dim , set_dataset_img_dim ] = React.useState({
        height : Math.floor( (280 / 418) * window.innerWidth * 0.7 * 0.5 * 1.2 ), 
        width: Math.floor(window.innerWidth * 0.7 * 0.5 * 1.2)
    })

    const [ gene_img_dim , set_gene_img_dim ] = React.useState({
        height : Math.floor( (495 / 735 ) * window.innerWidth * 0.7 * 0.5 * 1.2 ), 
        width: Math.floor(window.innerWidth * 0.7 * 0.5 * 1.2)
    })

    const [ link_img_holder_dim , set_link_img_holder_dim ] = React.useState({
        height : Math.floor(window.innerWidth * 0.7 * 0.5 * 1.2 * 0.7), 
        width: Math.floor(window.innerWidth * 0.7 * 0.5 * 1.2)
    })

    const getCountInfo = async () => {
        console.log("count information: ");
        const gene_count_url = `${process.env.REACT_APP_BACKEND_URL}/api/gene_count`;
        const dataset_count_url = `${process.env.REACT_APP_BACKEND_URL}/api/dataset_count`;

        let res = await axios.get(gene_count_url);
        set_gene_count(parseInt(res.data.count));
        console.log("line 39 gene count total: ", parseInt(res.data.count));

        res = await axios.get(dataset_count_url);
        set_dataset_count(parseInt(res.data.count));
        console.log("line 44 dataset count total: ", parseInt(res.data.count));
    };

    useEffect(() => {
        getCountInfo();
    }, []);

    React.useEffect(() => {
        const debouncedHandleResize = debounce(function handleResize() {

            // set img holder width and height
            let temp_link_holder_width = window.innerWidth * 0.7 * 0.5;
            let temp_link_holder_height = temp_link_holder_width * 0.7;

            // dataset height width
            let temp_dataset_img_width = Math.floor(temp_link_holder_width * 1.2)
            let temp_dataset_img_height = Math.floor( (280 / 418) * temp_dataset_img_width );

            // gene height width
            let temp_gene_img_width = Math.floor( temp_link_holder_width * 1.2 );
            let temp_gene_img_height = Math.floor( (495 / 735 ) * temp_gene_img_width );


            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            });

            set_link_img_holder_dim({
                height: Math.floor( temp_link_holder_height ),
                width: Math.floor(temp_link_holder_width)
            });

            set_dataset_img_dim({
                height: Math.floor( temp_dataset_img_height ),
                width: Math.floor( temp_dataset_img_width )
            });

            set_gene_img_dim({
                height: Math.floor( temp_gene_img_height ),
                width: Math.floor( temp_gene_img_width )
            });


        }, 1000)

        window.addEventListener('resize', debouncedHandleResize)

        return _ => {
            window.removeEventListener('resize', debouncedHandleResize)
        }
    })

    GetUserAfterRender();

    return (
        <body id="page-top">
            <div id="wrapper">
                <div id="content-wrapper" class="d-flex flex-column">
                    <div id="content">
                        <div class="container-fluid" id="home_page_full">
                            <DashboardSidebar input_cur_active={"home"} />

                            <div class="row justify-content-end">
                                <div class="col-md-12 bg-light text-right mr-5 mt-5">
                                    <a
                                        href="/upload"
                                        class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                                    >
                                        <i class="fas fa-upload fa-sm text-white-50"></i>
                                        Upload
                                    </a>
                                </div>
                            </div>

                            <div class="row justify-content-center">
                                <h3 class="h3 mb-5 text-gray-800">
                                    Human Genomics Search
                                </h3>
                            </div>

                            <div class="row justify-content-center">
                                <h3 class="h5 mb-4 text-gray-800">
                                    Welcome! You can search genes or datasets.{" "}
                                </h3>
                            </div>

                            <div
                                style={{
                                    minWidth: "100%",
                                    left: 0,
                                    marginLeft: "40px",
                                    marginBottom: "40px",
                                    justifyContent: "center",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        display: "inline-block",
                                        minWidth: "70%",
                                        maxWidth: "70%",
                                    }}
                                >
                                    <div
                                        class="justify-content-center"
                                        style={{
                                            minWidth: "100%",
                                            maxWidth: "100%",
                                            display: "flex",
                                        }}
                                    >
                                        <div
                                            class="col"
                                            style={{ display: "inline" }}
                                        >
                                            <div class="card border-left-success shadow">
                                                <div class="card-body">
                                                    <div class="row align-items-center">
                                                        <div class="col">
                                                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                                Total Genes
                                                                Count
                                                            </div>
                                                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                                                {gene_count}
                                                            </div>
                                                        </div>
                                                        <div class="col-auto">
                                                            <FontAwesomeIcon
                                                                icon={icon({
                                                                    name: "dna",
                                                                    style: "solid",
                                                                })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            class="col"
                                            style={{ display: "inline" }}
                                        >
                                            <div class="card border-left-success shadow">
                                                <div class="card-body">
                                                    <div class="row align-items-center">
                                                        <div class="col">
                                                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                                Total Datasets
                                                                Count
                                                            </div>
                                                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                                                {dataset_count}
                                                            </div>
                                                        </div>
                                                        <div class="col-auto">
                                                            <FontAwesomeIcon
                                                                icon={icon({
                                                                    name: "file",
                                                                    style: "solid",
                                                                })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    minWidth: "100%",
                                    minHeight: `${link_img_holder_dim.height}px`,
                                    maxHeight: `${link_img_holder_dim.height}px`,
                                    left: 0,
                                    marginLeft: "40px",
                                    justifyContent: "center",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        display: "inline-block",
                                        minWidth: "70%",
                                        maxWidth: "70%",
                                        minHeight: `${link_img_holder_dim.height}px`,
                                        maxHeight: `${link_img_holder_dim.height}px`,
                                    }}
                                >
                                    <div
                                        class="justify-content-center"
                                        style={{
                                            minWidth: "100%",
                                            maxWidth: "100%",
                                            display: "flex",
                                            minHeight: `${link_img_holder_dim.height}px`,
                                            maxHeight: `${link_img_holder_dim.height}px`,
                                        }}
                                    >
                                        <div
                                            class="col"
                                            style={{
                                                display: "inline",
                                                maxWidth: "50%",
                                                minWidth: "50%",
                                                minHeight: "100%",
                                                maxHeight: "100%",
                                            }}
                                        >
                                            <div
                                                class="card shadow"
                                                style={{
                                                    maxHeight: "100%",
                                                    minHeight: "100%",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <div class="card-body">
                                                    <a href="/search_genes_page">
                                                        Genes Search
                                                        <img
                                                            alt="gene_search_img"
                                                            src="https://www.ukri.org/wp-content/uploads/2022/02/MRC-180222-DNASequencingDataGenomicAnalysis-GettyImages-1293619871-735x490.jpg"
                                                            style={{
                                                                maxWidth:
                                                                    `${gene_img_dim.width}px`,
                                                                minWidth:
                                                                    `${gene_img_dim.width}px`,
                                                                minHeight:
                                                                    `${gene_img_dim.height}px`,
                                                                maxHeight:
                                                                    `${gene_img_dim.height}px`,
                                                                objectFit: 'cover'
                                                            }}
                                                        ></img>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            class="col"
                                            style={{
                                                display: "inline",
                                                maxWidth: "50%",
                                                minWidth: "50%",
                                                minHeight: "100%",
                                                maxHeight: "100%",
                                            }}
                                        >
                                            <div
                                                class="card shadow"
                                                style={{
                                                    maxHeight: "100%",
                                                    minHeight: "100%",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <div class="card-body">
                                                    <a href="/search_datasets_page">
                                                        Datasets Search
                                                        <img
                                                            alt="dataset_search_img"
                                                            src="https://www.shutterstock.com/image-vector/abstract-business-chart-uptrend-line-260nw-593939270.jpg"
                                                            width='100%'
                                                            height='100%'
                                                            style={{
                                                                maxWidth:
                                                                    `${dataset_img_dim.width}px`,
                                                                minWidth:
                                                                    `${dataset_img_dim.width}px`,
                                                                minHeight:
                                                                    `${dataset_img_dim.height}px`,
                                                                maxHeight:
                                                                    `${dataset_img_dim.height}px`,
                                                                objectFit: 'cover'
                                                            }}
                                                        ></img>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <script src="../bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
            <script src="../bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

            <script src="../bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>

            <script src="../bootstrap_gene_page/js/sb-admin-2.min.js"></script>

            <script src="../bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>

            <script src="../bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
            <script src="../bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>
        </body>
    );
}

export default Home;
