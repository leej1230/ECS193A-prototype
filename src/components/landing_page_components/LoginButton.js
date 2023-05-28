import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LoginButton = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    return (
        !isAuthenticated && (
            <div className="d-flex align-items-center justify-content-center">
                {/* TODO: comeback and link href to login page */}
                <button class="btn btn-primary" onClick={() => loginWithRedirect()}>OAuth Test</button>
            </div>
        )
    )
}

export default LoginButton;