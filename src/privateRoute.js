// https://developer.auth0.com/resources/guides/spa/react/basic-authentication
import React from 'react';
import { withAuthenticationRequired } from "@auth0/auth0-react";


const PrivateRoute = ({ element }) => {
    const Component = withAuthenticationRequired(() => element, {
        onRedirecting: () => (
            <div className="page-layout">
            </div>
        ),
    });

    return <Component />;
};

export default PrivateRoute;