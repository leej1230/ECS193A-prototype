import axios from "axios";
import React, { useEffect, useState } from "react";
import ScrollBars from "react-custom-scrollbars";
import DatasetList from "./DatasetList";
import "./Slider.css";

import { useAuth0 } from '@auth0/auth0-react';

import { clone } from "ramda";

import "../../bootstrap_gene_page/css/sb-admin-2.min.css";
import "../../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import LoadingSpinner from "../../spinner/spinner";

const user_get_url = `${process.env.REACT_APP_BACKEND_URL}/api/login`;

function debounce(fn, ms) {
    let timer;
    return (_) => {
        clearTimeout(timer);
        timer = setTimeout((_) => {
            timer = null;
            fn.apply(this, arguments);
        }, ms);
    };
}

function SliderItemsContainer(props) {
    const [index, setIndex] = useState(0);

    const [dimensions, setDimensions] = React.useState({
        height: window.innerHeight,
        width: window.innerWidth,
    });

    React.useEffect(() => {
        const debouncedHandleResize = debounce(function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth,
            });
        }, 1000);

        window.addEventListener("resize", debouncedHandleResize);

        return (_) => {
            window.removeEventListener("resize", debouncedHandleResize);
        };
    });

    return (
        <div>

            <ScrollBars
                style={{ width: parseInt(0.7 * dimensions.width), height: '405px', margin: '0px', padding: '0px' }}  >
                {props.dataset_groups_list.map((child, index) =>
                    <div key={index}> <DatasetList curWindowWidth={dimensions.width} curWindowHeight={dimensions.height} datasets_arr={props.dataset_groups_list[index]} /> </div>)}
            </ScrollBars>

            <script src="../../bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
            <script src="../../bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

            <script src="../../bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>

            <script src="../../bootstrap_gene_page/js/sb-admin-2.min.js"></script>

            <script src="../../bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>

            <script src="../../bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
            <script src="../../bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>
        </div>
    );
}

export default function Slider() {
    const [datasets_list, setDatasetsList] = useState([]);
    const [groupings, setGroupings] = useState([]);

    const { user, isLoading } = useAuth0();
    const [userInfo, setUserInfo] = useState();
    const [bookmarkedDatasets, setBookmarkedDatasets] = useState([]);

    const handleFetchUser = async () => {
        const userSub = user.sub.split("|")[1];
        try {
            const res = await axios.get(`${user_get_url}/${userSub}`);
            console.log(res.data);
            setUserInfo(res.data);
            setBookmarkedDatasets(res.data.bookmarked_datasets);
            console.log("fetched and saved user and bookmark information for dataset")

        } catch (e) {
            console.log("Failed to fetch user Info.", e);
        }
    };

    useEffect(() => {
        handleFetchUser();
    }, []);

    useEffect(() => {

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/datasets_some`, {
        // Data to be sent to the server
        datasets_request_list: clone(bookmarkedDatasets)
    }, { 'content-type': 'application/json' }).then((response) => {
        console.log("post has been sent");
        console.log("bookmarked datasets: ", bookmarkedDatasets)
        console.log(response.data);
        if(response.data && response.data.length == 1 && response.data[0] == null){
            setDatasetsList([]);
        } else {
            setDatasetsList(response.data);
        }
        
    });

    }, [bookmarkedDatasets]);

    useEffect(() => {
        function createDatasetListGroups() {
            var num_datasets = datasets_list.length;
            var num_groups = Math.floor(num_datasets / 6);
            var last_group_num_datasets = num_datasets % 6;

            if (num_datasets == 0) {
                return []
            }

            if (last_group_num_datasets > 0) {
                num_groups = num_groups + 1
            }

            var groups_list = [];
            for (let index = 0; index < num_groups; index++) {
                const start_dataset_index = index * 6;
                let end_dataset_index = start_dataset_index + 6;
                if ((index + 1) === num_groups && num_datasets % 6 > 0) {
                    end_dataset_index = start_dataset_index + last_group_num_datasets;
                }

                let cur_group = [];
                for (let j = start_dataset_index; j < end_dataset_index; j++) {
                    cur_group.push(datasets_list[j]);
                }
                groups_list.push(cur_group);
            }

            return groups_list;
        }


        setGroupings(createDatasetListGroups());

    }, [datasets_list.length]);

    return (
        <>
            {!datasets_list.length ? (
                <LoadingSpinner />
            ) : (
                <>
                    {datasets_list.length > 0 ? (
                        <SliderItemsContainer dataset_groups_list={groupings} />
                    ) : (
                        <></>
                    )}
                    <div>
                        <script src="../../bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
                        <script src="../../bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

                        <script src="../../bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>

                        <script src="../../bootstrap_gene_page/js/sb-admin-2.min.js"></script>

                        <script src="../../bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>

                        <script src="../../bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
                        <script src="../../bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>
                    </div>
                </>
            )}
        </>
    );

}

/*
<ScrollBars
    style={{
        width: parseInt(0.7 * dimensions.width),
        height: parseInt(0.35 * dimensions.height),
    }}
>
    {props.dataset_groups_list.map((child, index) => (
        <div key={index}>
            {" "}
            <DatasetList
                datasets_arr={props.dataset_groups_list[index]}
            />{" "}
        </div>
    ))}
</ScrollBars>
*/