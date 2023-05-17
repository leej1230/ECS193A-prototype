// https://developer.auth0.com/resources/guides/spa/react/basic-authentication
import React from 'react';
import { withAuthenticationRequired } from "@auth0/auth0-react";


const PrivateRoute = ({ children, ...propsForComponent }) => {
    const Component = withAuthenticationRequired(() => (
        <>
            {children}
        </>
    ));

    return <Component {...propsForComponent} />;
};

export default PrivateRoute;