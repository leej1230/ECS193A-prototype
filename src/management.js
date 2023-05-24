import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingSpinner from './components/spinner/spinner';
import moment from 'moment/moment';

const user_get_url = `${process.env.REACT_APP_BACKEND_URL}/api/login`;
const users_get_url = `${process.env.REACT_APP_BACKEND_URL}/api/get-user-all`;
const role_update_url = `${process.env.REACT_APP_BACKEND_URL}/api/update-role`;
const role_log_add_url = `${process.env.REACT_APP_BACKEND_URL}/api/add-role-log`;
const role_log_fetch_url = `${process.env.REACT_APP_BACKEND_URL}/api/get-role-log`;

const Management = () => {
    const { user, isLoading } = useAuth0();
    const [userData, setUserData] = useState();
    const [data, setData] = useState([]);
    const [historyLog, setHistoryLog] = useState([]);

    // { name: 'John Doe', is_admin: true, is_member: false },
    // { name: 'Jane Smith', is_admin: false, is_member: true },

    const userMetadata = user?.['https://unique.app.com/user_metadata'];


    const handleFetchUser = async () => {
        const userSub = user.sub.split("|")[1];
        try {
            const res = await axios.get(`${user_get_url}/${userSub}`);
            console.log(res.data);
            setUserData(res.data);
        } catch (e) {
            console.log("Failed to fetch user Info.", e);
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

    return isLoading || !data || !userData || historyLog === [] ? (
        <div>
            <LoadingSpinner />
        </div>
    ) : (
        userData.is_admin ? (
            <div className="container my-3">
                <h2 className='text-center my-3'>Manage Users</h2>
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th>Staff</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => {
                            if (item.auth0_uid === userData.auth0_uid) {
                                return null;
                            }
                            return (
                                <tr key={index}>
                                    <td>{item.first_name} {item.last_name}</td>
                                    <td>{item.email}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={item.is_admin}
                                            onChange={() => handleCheckboxChange(index, item.auth0_uid, 'is_admin', item.is_admin, `${userMetadata.given_name} ${userMetadata.family_name}`, `${item.first_name} ${item.last_name}`)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={item.is_staff}
                                            onChange={() => handleCheckboxChange(index, item.auth0_uid, 'is_staff', item.is_staff, `${userMetadata.given_name} ${userMetadata.family_name}`, `${item.first_name} ${item.last_name}`)}
                                        />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="container my-3">
                    {historyLog.map((data, index) => {
                        return <p className='text-right' key={index}>
                            {data.asked} has {data.hasOwnProperty("is_admin") ? (data.is_admin === "false" ? "Removed" : "Added") : (data.is_staff === "false" ? "Removed" : "Added")} {data.hasOwnProperty("is_admin") ? 'Admin' : 'Staff'} role from {data.target} at {moment.parseZone(data.time).format("YYYY/MM/DD HH:mm")}
                        </p>;
                    })}
                </div>
            </div>
        ) : (
            <div className="container my-3">
                <h2 className='text-center my-3'>You have NO authority</h2>
            </div>
        )
    );
};

export default Management;
