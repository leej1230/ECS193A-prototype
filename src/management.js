import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingSpinner from './components/spinner/spinner';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import ReactPlayer from 'react-player'

import "./components/bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "./components/bootstrap_gene_page/css/sb-admin-2.min.css"

import './components/HomePage.css'

import './management.css';


const user_get_url = `${process.env.REACT_APP_BACKEND_URL}/api/login`;
const users_get_url = `${process.env.REACT_APP_BACKEND_URL}/api/get-user-all`;
const role_update_url = `${process.env.REACT_APP_BACKEND_URL}/api/update-role`;

function debounce(fn, ms) {
  let timer;
  return _ => {
    clearTimeout(timer);
    timer = setTimeout(_ => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

function Management() {

  const { user, isLoading } = useAuth0();
  const [userData, setUserData] = useState();
  const [data, setData] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true); // New state to control the visibility of the spinner

  const handleFetchUser = async () => {
    if (user && user.sub) {
      const userSub = user.sub.split("|")[1];
      try {
        const res = await axios.get(`${user_get_url}/${userSub}`);
        console.log(res.data);
        setUserData(res.data);
      } catch (e) {
        console.log("Failed to fetch user Info.", e);
      }
    }
  };

  const handleCheckboxChange = (index, uid, key, val) => {
    // Update on frontend side only
    setData((prevData) => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [key]: !newData[index][key]
      };
      return newData;
    });

    // Send info to backend to update
    const formData = new FormData();
    formData.append("value", !val);
    formData.append("role_label", key);
    formData.append("user_uid", uid);

    axios
      .post(role_update_url, formData)
      .then(() => {
        console.log("Account information successfully submitted on backend.");
      })
      .catch((error) => {
        console.log("Account information already registered in DB. No update needed.")
      });
  };

  const handleFetchUsers = async () => {
    try {
      const res = await axios.get(users_get_url);
      console.log(res.data);
      setData(res.data);
    } catch (e) {
      console.log("Failed to fetch user Info.", e);
    }
  };

  useEffect(() => {
    handleFetchUser();
    handleFetchUsers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const columns = [
    {
      dataField: 'first_name',
      text: 'Full Name'
    },
    {
      dataField: 'email',
      text: 'Email'
    },
    {
      dataField: 'is_admin',
      text: 'Admin',
      formatter: (cell, row, rowIndex) => (
        <input
          type="checkbox"
          className="form-check-input"
          checked={cell}
          onChange={() => handleCheckboxChange(rowIndex, row.auth0_uid, 'is_admin', cell)}
        />
      )
    },
    {
      dataField: 'is_staff',
      text: 'Member',
      formatter: (cell, row, rowIndex) => (
        <input
          type="checkbox"
          className="form-check-input"
          checked={cell}
          onChange={() => handleCheckboxChange(rowIndex, row.auth0_uid, 'is_staff', cell)}
        />
      )
    }
  ];

  return (
    <div>
      {showSpinner && <LoadingSpinner />}
      {!showSpinner && (
        <>
          {isLoading || !data || !userData ? (
            <LoadingSpinner />
          ) : userData.is_admin ? (
            <body id="page-top" className="gene_body">

              <div className="profile">
                <div className="profile-card">
                  <h2 className="card-title1">Management Page</h2>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title2">User List</h2>
                  <BootstrapTable
                    keyField='auth0_uid'
                    data={data}
                    columns={columns}
                    pagination={paginationFactory()}
                  />
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h2 className="card-title2">History Log</h2>

                  <div className="no-logs">
                    <h4>No Logs Yet!</h4>
                  </div>
                </div>
              </div>
            </body>
          ) : (
            <div className="container my-3">
              <h2 className='text-center my-3'>You have NO authority</h2>
            </div>
          )
          }
        </>
      )}
    </div>
  );
}

export default Management;
