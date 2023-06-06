import { useAuth0 } from "@auth0/auth0-react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import GetUserAfterRender from "../../util/getUser";
import UserStatusContext from "./UserStatusContext";

const users_get_url = `${process.env.REACT_APP_BACKEND_URL}/api/get-user-all`;
const role_update_url = `${process.env.REACT_APP_BACKEND_URL}/api/update-role`;
const role_log_add_url = `${process.env.REACT_APP_BACKEND_URL}/api/add-role-log`;

const PermissionDataGrid = () => {
    let userData = GetUserAfterRender();

    const { setUserStatusChange } = useContext(UserStatusContext);
    const { user } = useAuth0();
    const userMetadata = user?.["https://unique.app.com/user_metadata"];
    const [currentPage, setCurrentPage] = useState(1);
    const [totalData, setTotalData] = useState([]);
    const [, setData] = useState([]); // New state to store the data from the API
    const [dirty, setDirty] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const handleCheckboxChange = (
        index,
        uid,
        key,
        val,
        request_user,
        changed_user
    ) => {
        setDirty(true);
        // Update on frontend side only
        index = index - 1;
        setData((prevData) => {
            const newData = [...prevData];
            newData[index] = {
                ...newData[index],
                [key]: !newData[index][key],
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
                console
                    .log(
                        "Account information successfully submitted on backend."
                    )
                    .then(() => {
                        handleFetchUsers();
                    });
            })
            .catch((error) => {
                console.log(
                    "Account informaiton already registered in DB. No update needed."
                );
            })
            .then(() => {
                setDirty(false);
                setUserStatusChange(true);
                setTimeout(() => {
                    setUserStatusChange(false);
                }, 1000);
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
                if (formDataLog.get("changed_user") === userData.email) {
                    localStorage.removeItem("user");
                    userData = GetUserAfterRender();
                }
                console.log("Change log submitted on backend.");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleFetchUsers = async () => {
        try {
            const res = await axios.get(users_get_url);
            const dataWithIds = res.data.map((row, index) => ({
                id: row.auth0_uid,
                index: index + 1,
                ...row,
            }));
            setTotalData(dataWithIds);
            const startIdx = (currentPage - 1) * 10;
            const endIdx =
                startIdx + 10 > dataWithIds.length
                    ? dataWithIds.length
                    : startIdx + 10;
            const dat = dataWithIds.slice(startIdx, endIdx);
            setData(dat);
        } catch (e) {
            console.log("Failed to fetch user Info.", e);
        }
    };

    useEffect(() => {
        // Save the current page before fetching users
        const savedPage = currentPage;

        handleFetchUsers();

        // Restore the page after fetching users
        setCurrentPage(savedPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, totalData.length, dirty]); // Run the effect only when currentPage changes

    const columns = [
        {
            field: "index",
            headerName: "Index",
            width: 100,
            renderCell: (params) => (
                <p style={{ margin: "1rem" }}>{params.value}</p>
            ),
        },
        {
            field: "last_name",
            headerName: "Last Name",
            width: 200,
            renderCell: (params) => (
                <p style={{ marginTop: "1rem" }}>{params.row.last_name}</p>
            ),
        },
        {
            field: "first_name",
            headerName: "First Name",
            width: 200,
            renderCell: (params) => (
                <p style={{ marginTop: "1rem" }}>{params.row.first_name}</p>
            ),
        },
        {
            field: "email",
            headerName: "Email",
            width: 200,
        },
        {
            field: "is_admin",
            headerName: "Admin",
            width: 120,
            renderCell: (params) => (
                <input
                    type="checkbox"
                    style={{ margin: "1rem" }}
                    checked={params.value}
                    className={`form-check-input ${
                        params.value ? "checked" : ""
                    }`}
                    onChange={() =>
                        handleCheckboxChange(
                            params.row.index,
                            params.row.auth0_uid,
                            params.field,
                            params.value,
                            `${userMetadata.given_name} ${userMetadata.family_name}`,
                            `${params.row.first_name} ${params.row.last_name}`
                        )
                    }
                />
            ),
        },
        {
            field: "is_staff",
            headerName: "Staff",
            width: 120,
            renderCell: (params) => (
                <input
                    type="checkbox"
                    style={{ margin: "1rem" }}
                    checked={params.value}
                    className="form-check-input"
                    onChange={() =>
                        handleCheckboxChange(
                            params.row.index,
                            params.row.auth0_uid,
                            params.field,
                            params.value,
                            `${userMetadata.given_name} ${userMetadata.family_name}`,
                            `${params.row.first_name} ${params.row.last_name}`
                        )
                    }
                />
            ),
        },
    ];
    console.log(totalData);
    return (
        <DataGrid
            rows={totalData}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            rowCount={totalData.length}
            onPaginationModelChange={setPaginationModel}
            paginationModel={paginationModel}
        />
    );
};

export default PermissionDataGrid;
