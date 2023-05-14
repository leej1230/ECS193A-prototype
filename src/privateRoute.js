import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    if (!isAuthenticated) {
        return <Redirect to={() => loginWithRedirect()} />;
    }


    return <Component {...rest} />;
};

export default PrivateRoute;