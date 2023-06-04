import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { AES, enc } from "crypto-js";

function GetUserAfterRender() {
    const { user } = useAuth0();
    const encryptedLSUser = localStorage.getItem("user");
    let decryptedLSUser = null;
    if (!encryptedLSUser) {
        const userMetadata = user?.["https://unique.app.com/user_metadata"];
        const email = user.email;
        const first_name = userMetadata.given_name;
        const last_name = userMetadata.family_name;
        const auth0_uid = user.sub.split("|")[1];

        const formData = new FormData();
        formData.append("email", email);
        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("auth0_uid", auth0_uid);

        const user_get_url = `${process.env.REACT_APP_BACKEND_URL}/api/login`;
        const user_post_url = `${process.env.REACT_APP_BACKEND_URL}/api/registration`;
        axios
            .post(user_post_url, formData)
            .then(() => {
                console.log(
                    "Account information successfully submitted on backend."
                );
            })
            .catch((error) => {
                if (error.response.status === 409) {
                    console.log(
                        "Account information already registered in DB. No update needed."
                    );
                }
            })
            .finally(() => {
                axios.get(`${user_get_url}/${auth0_uid}`).then((res) => {
                    console.log(res);
                    const encryptedUser = AES.encrypt(
                        JSON.stringify(res.data),
                        process.env.REACT_APP_AES_PRIVATE_KEY
                    );
                    localStorage.setItem("user", encryptedUser);
                }).finally(() => {
                    decryptedLSUser = JSON.parse(
                        AES.decrypt(
                            encryptedLSUser,
                            process.env.REACT_APP_AES_PRIVATE_KEY
                        ).toString(enc.Utf8)
                    );
                })
            });
    }

    return decryptedLSUser;
}

export default GetUserAfterRender;
