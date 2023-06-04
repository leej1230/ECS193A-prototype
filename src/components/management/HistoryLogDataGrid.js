import { AddRounded, RemoveRounded } from "@material-ui/icons";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import UserStatusContext from "./UserStatusContext";

const role_log_fetch_url = `${process.env.REACT_APP_BACKEND_URL}/api/get-role-log`;
const HistoryLogDataGrid = () => {
    const [historyLog, setHistoryLog] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const { userStatusChange } = useContext(UserStatusContext);

    const rows = historyLog.map((data, index) => {
        let role;
        let permission;

        if (data.is_admin !== undefined) {
            role = "Admin";
            permission = data.is_admin === "true" ? "Granted" : "Revoked";
        } else if (data.is_staff !== undefined) {
            role = "Staff";
            permission = data.is_staff === "true" ? "Granted" : "Revoked";
        } else {
            role = "Unknown";
            permission = "Unknown";
        }

        return {
            id: index,
            time: moment.parseZone(data.time).format("YYYY/MM/DD HH:mm"),
            asked: data.asked,
            target: data.target,
            role: role,
            permission: permission,
        };
    });

    const columns = [
        {
            field: "time",
            headerName: "Time",
            flex: 1,
            valueFormatter: (params) => params.value,
        },
        {
            field: "asked",
            headerName: "Author",
            flex: 1,
        },
        {
            field: "target",
            headerName: "Target",
            flex: 1,
        },
        {
            field: "role",
            headerName: "Role",
            flex: 1,
            renderCell: (params) => {
                <p>{params.row.role}</p>;
            },
        },
        {
            field: "permission",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => {
                if (params.row.permission === "Granted") {
                    return (
                        <>
                            <AddRounded style={{ color: "green" }} />
                            <p style={{ margin: "1rem", color: "green" }}>
                                {params.row.permission}
                            </p>
                        </>
                    );
                } else if (params.row.permission === "Revoked") {
                    return (
                        <>
                            <RemoveRounded style={{ color: "red" }} />
                            <p style={{ margin: "1rem", color: "red" }}>
                                {params.row.permission}
                            </p>
                        </>
                    );
                }
            },
        },
    ];

    useEffect(() => {
        const fetchLog = async () => {
            try {
                const response = await axios.get(role_log_fetch_url);
                setHistoryLog(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchLog();
        console.log(userStatusChange);
    }, [userStatusChange]);

    return (
        <div style={{ height: 400, width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[10, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
            />
        </div>
    );
};

export default HistoryLogDataGrid;
