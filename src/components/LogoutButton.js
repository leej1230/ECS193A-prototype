import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
    const { logout, isAuthenticated } = useAuth0();

    return (
        isAuthenticated && (
            <div className="d-flex align-items-center justify-content-center">
                {/* TODO: comeback and link href to login page */}
                <button class="btn btn-primary" onClick={() => logout()}>OAuth Test Logout</button>
            </div>
        )
    )
}

export default LogoutButton;