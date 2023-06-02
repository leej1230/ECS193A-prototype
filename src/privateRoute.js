// https://developer.auth0.com/resources/guides/spa/react/basic-authentication
import React, { useState, useEffect } from 'react';
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import NotAuthorized from './components/notAuthorized';
import axios from 'axios';
import LoadingSpinner from './components/spinner/spinner';

const email_register_url = `${process.env.REACT_APP_BACKEND_URL}/api/check_authorized_email`;

const PrivateRoute = ({ children, isAdmin, isStaff, ...propsForComponent }) => {
    const [emailAuthorized, setEmailAuthorized] = useState(null);
    const { user, isLoading } = useAuth0();

    useEffect(() => {
        const checkEmailExists = async () => {
            if (user && user.email) {
                try {
                    const response = await axios.post(email_register_url, { email: user.email });
                    setEmailAuthorized(response.data.isExists);
                } catch (error) {
                    console.error('Error checking email:', error);
                }
            }
        };

        checkEmailExists();
    }, [user]);

    const Component = withAuthenticationRequired(() => {
        if (isLoading || emailAuthorized === null) {
            return <LoadingSpinner />;
        } else if (emailAuthorized) {
            return <>{children}</>;
        } else {
            return <NotAuthorized />;
        }
    });

    return <Component {...propsForComponent} />;
};
export default PrivateRoute;
