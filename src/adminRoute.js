// https://developer.auth0.com/resources/guides/spa/react/basic-authentication
import { useAuth0 , withAuthenticationRequired } from "@auth0/auth0-react";
import { AES, enc } from "crypto-js";
import React from "react";
import NotAuthorized from "./notAuthorized";
import LoadingSpinner from './components/spinner/spinner';

const AdminRoute = ({ children, isAdmin, ...propsForComponent }) => {
    const Component = withAuthenticationRequired(() => <>{children}</>);
    const { user, isLoading } = useAuth0();

    const encryptedLSUser = localStorage.getItem("user");
    const decryptedLSUser = encryptedLSUser
        ? JSON.parse(
            AES.decrypt(
                encryptedLSUser,
                process.env.REACT_APP_AES_PRIVATE_KEY
            ).toString(enc.Utf8)
        )
        : {};

    if (isLoading) {
        return <LoadingSpinner />;
    } else if (!decryptedLSUser.is_admin) {
        console.log(decryptedLSUser)
        return <NotAuthorized missingPerm={"admin"} />;
    }
    return <Component {...propsForComponent} />;
};

export default AdminRoute;
