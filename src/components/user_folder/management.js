
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingSpinner from '../spinner/spinner';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import "../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css"
import "../bootstrap_gene_page/css/sb-admin-2.min.css"

import '../landing_page_components/HomePage.css'

import './management.css';

import moment from 'moment/moment';

const user_get_url = `${process.env.REACT_APP_BACKEND_URL}/api/login`;
const users_get_url = `${process.env.REACT_APP_BACKEND_URL}/api/get-user-all`;
const role_update_url = `${process.env.REACT_APP_BACKEND_URL}/api/update-role`;
const role_log_add_url = `${process.env.REACT_APP_BACKEND_URL}/api/add-role-log`;
const role_log_fetch_url = `${process.env.REACT_APP_BACKEND_URL}/api/get-role-log`;

const Management = () => {
  const { user, isLoading } = useAuth0();

  const userMetadata = user?.['https://unique.app.com/user_metadata'];

  const [historyLog, setHistoryLog] = useState([]);
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

  const handleCheckboxChange = (index, uid, key, val, request_user, changed_user) => {
    // Update on frontend side only
    setData((prevData) => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [key]: !newData[index][key]
      };
      return newData;
    });

    // Send info to backend to update for changing User Data
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
        console.log("Account informaiton already registered in DB. No update needed.")
      });

    // Send info to backend to update for log
    const formDataLog = new FormData();
    formDataLog.append("request_user", request_user);
    formDataLog.append("role_title", key);
    formDataLog.append("changed", !val);
    formDataLog.append("changed_user", changed_user);

    axios
      .post(role_log_add_url, formDataLog)
      .then(() => {
        console.log("Change log submitted on backend.");
      })
      .catch((error) => {
        console.log(error);
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
      formatter: (cell, item, rowIndex) => (
        <input
          type="checkbox"
          className="form-check-input"
          checked={cell}
          // onChange={() => handleCheckboxChange(rowIndex, row.auth0_uid, 'is_admin', cell)}
          onChange={() => handleCheckboxChange(rowIndex, item.auth0_uid, 'is_admin', cell, `${userMetadata.given_name} ${userMetadata.family_name}`, `${item.first_name} ${item.last_name}`)}
        />
      )
    },
    {
      dataField: 'is_staff',
      text: 'Member',
      formatter: (cell, item, rowIndex) => (
        <input
          type="checkbox"
          className="form-check-input"
          checked={cell}
          onChange={() => handleCheckboxChange(rowIndex, item.auth0_uid, 'is_staff', cell, `${userMetadata.given_name} ${userMetadata.family_name}`, `${item.first_name} ${item.last_name}`)}
        // onChange={() => handleCheckboxChange(rowIndex, row.auth0_uid, 'is_staff', cell)}
        />
      )
    }
  ];

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const response = await axios.get(role_log_fetch_url);
        setHistoryLog(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const interval = setInterval(fetchLog, 1500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return isLoading || showSpinner || !data || !userData || historyLog === [] ? (
    <div>
      <LoadingSpinner />
    </div>
  ) : (
    userData.is_admin ? (
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

            {historyLog.map((data, index) => {
              return <p className='text-right pr-2' key={index}>
                {data.asked} has {data.hasOwnProperty("is_admin") ? (data.is_admin === "false" ? "Removed" : "Added") : (data.is_staff === "false" ? "Removed" : "Added")} {data.hasOwnProperty("is_admin") ? 'Admin' : 'Staff'} role {data.is_admin === "false" || data.is_staff === "false" ? "from" : "to"} {data.target} at {moment.parseZone(data.time).format("YYYY/MM/DD HH:mm")}
              </p>;
            })}
          </div>
        </div>
      </body>
    ) : (
      <div className="container my-3">
        <h2 className='text-center my-3'>You have NO authority</h2>
      </div>
    )
  );
}

export default Management;
