import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import './DatasetNameHolder.css'

import "../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "../bootstrap_gene_page/css/sb-admin-2.min.css"

import { useAuth0 } from '@auth0/auth0-react';

const user_get_url = `${process.env.REACT_APP_BACKEND_URL}/api/login`;

function DatasetNameHolder(props) {
  const [, setUserInfo] = useState();
  const { user } = useAuth0();
  const [bookmarked, setBookmarked] = useState(false);

  const handleFetchUser = async () => {
    //console.log("fetch user: ")
    const userSub = user.sub.split("|")[1];
    axios
      .get(`${user_get_url}/${userSub}`)
      .then((res) => {
        //console.log(res.data);
        setUserInfo(res.data);

        if (res.data && res.data.bookmarked_datasets) {
          setBookmarked(res.data.bookmarked_datasets.includes(`${props.input_dataset.name}/${props.input_dataset_id}`))
        }

      })
      .catch((e) => {
        console.log("Failed to fetch user Info.", e)
      });
  };

  useEffect(() => {
    handleFetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id="dataset_name_holder">
      <h5 class="h5 text-gray-800">
        <div id="text_title">
          <div class="d-sm-inline-block" id="title_tag">Dataset:</div>
          &nbsp;
          <div class="d-sm-inline-block" >{props.input_dataset && props.input_dataset["name"] ? props.input_dataset["name"] : "[No Name]"}</div>
          &nbsp;
          &nbsp;
          <button
            type="button"
            className="btn btn-sm btn-secondary m-2 ml-auto d-sm-inline-block"
            onClick={async () => {
              if (bookmarked === true) {
                await setBookmarked(false);
                const formData = new FormData();
                formData.append("user_id", user.sub.split("|")[1]);
                formData.append("dataset_url", `${props.input_dataset.name}/${props.input_dataset_id}`);
                axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/remove-dataset-bookmark`, formData)
              } else {
                const formData = new FormData();
                formData.append("user_id", user.sub.split("|")[1]);
                formData.append("dataset_url", `${props.input_dataset.name}/${props.input_dataset_id}`);
                axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/add-dataset-bookmark`, formData)
                await setBookmarked(true);
              }
            }}
          >
            {bookmarked ? <FontAwesomeIcon icon={icon({ name: 'bookmark', style: 'solid' })} /> : <FontAwesomeIcon icon={icon({ name: 'bookmark', style: 'regular' })} />}

          </button>

        </div>
        <div>
          <p class="d-sm-inline-block subtitle_tag" >Dataset ID:</p>
          &nbsp;
          <p class="d-sm-inline-block subtitle_content" >{props.input_dataset_id}</p>
        </div>
      </h5>
    </div>
  )
}

export default DatasetNameHolder
