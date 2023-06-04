import React from "react";

import "../bootstrap_gene_page/css/sb-admin-2.min.css";
import "../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";

import "../landing_page_components/HomePage.css";

import "./management.css";

import { useState } from "react";
import InviteForm from "./InviteForm";
import HistoryLogDataGrid from "./HistoryLogDataGrid";
import PermissionDataGrid from "./PermissionDataGrid";
import UserStatusContext from "./UserStatusContext";

const Management = () => {
    const [userStatusChange, setUserStatusChange] = useState(false);

    return (
        <body id="page-top" className="gene_body">
            <div className="profile">
                {/* ... other code */}

                <InviteForm />

                <div className="card">
                    <div className="card-body">
                        <h2 className="card-title2">User List</h2>
                        <UserStatusContext.Provider
                            value={{ userStatusChange, setUserStatusChange }}
                        >
                            <PermissionDataGrid />
                        </UserStatusContext.Provider>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <h2 className="card-title2">History Log</h2>
                        <UserStatusContext.Provider
                            value={{ userStatusChange, setUserStatusChange }}
                        >
                            <HistoryLogDataGrid />
                        </UserStatusContext.Provider>
                    </div>
                </div>
            </div>

        </body>
    );
};
export default Management;
