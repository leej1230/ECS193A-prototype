import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import { CircularProgress } from '@mui/material';

import './GeneNameHeaderHolder.css'

import "../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "../bootstrap_gene_page/css/sb-admin-2.min.css"

import { useAuth0 } from '@auth0/auth0-react';

const user_get_url = `${process.env.REACT_APP_BACKEND_URL}/api/login`;

const SAMPLE_ID = window.location.pathname.split("/").at(-1)

const SAMPLE_NAME = window.location.pathname.split("/").at(-2)

function NameHeaderHolder(props){

    const [bookmarked, setBookmarked] = useState();
    const [userInfo, setUserInfo] = useState();

    const { user } = useAuth0();

    const handleFetchUser = async () => {
        const userSub = user.sub.split("|")[1];
        axios
          .get(`${user_get_url}/${userSub}`)
          .then((res) => {
            console.log(res.data);
            setUserInfo(res.data);
            setBookmarked(res.data.bookmarked_genes.includes(`${SAMPLE_NAME}/${SAMPLE_ID}`));
          })
          .catch((e) => {
            console.log("Failed to fetch user Info.", e)
          });
      };
    
    useEffect(() => {
        handleFetchUser();
    }, []);

    return <div id="name_box">
                <h5 class="h5 text-gray-800">
                {props.input_object_data ? (
                    <div>
                    <div>
                        <p className='d-sm-inline-block title_tag'>Name:</p>
                        &nbsp;
                        <p className='d-sm-inline-block gene_name'>{props.input_object_data.name}</p>
                        &nbsp;
                        <button
                        type="button"
                        className="btn btn-sm btn-secondary m-2 ml-auto d-sm-inline-block"
                        onClick={async () => {
                            if (bookmarked == true) {
                            await setBookmarked(false);
                            const formData = new FormData();
                            formData.append("user_id", user.sub.split("|")[1]);
                            formData.append("gene_url", `${SAMPLE_NAME}/${SAMPLE_ID}`);
                            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/remove-bookmark`, formData)
                            } else {
                            const formData = new FormData();
                            formData.append("user_id", user.sub.split("|")[1]);
                            formData.append("gene_url", `${SAMPLE_NAME}/${SAMPLE_ID}`);
                            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/add-bookmark`, formData)
                            await setBookmarked(true);
                            }
                        }}
                        >
                        {bookmarked ? <FontAwesomeIcon icon={icon({ name: 'bookmark', style: 'solid' })} /> : <FontAwesomeIcon icon={icon({ name: 'bookmark', style: 'regular' })} />}

                        </button>

                    </div>
                    <div>
                        <p class="d-sm-inline-block subtitle_tag" >ID:</p>
                        &nbsp;
                        <p class="d-sm-inline-block subtitle_content" >{props.input_object_data.id}</p>
                    </div>
                    </div>
                ) : (
                    <div>
                    <CircularProgress />
                    </div>
                )}
                </h5>
            </div>
}

export default NameHeaderHolder;