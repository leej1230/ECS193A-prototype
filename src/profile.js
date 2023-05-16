import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingSpinner from './components/spinner/spinner';
// import axios from 'axios';

// const getAuth0Users = async () => {
//     const domain = process.env.REACT_APP_AUTH0_DOMAIN;
//     const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
//     const clientSecret = process.env.REACT_APP_AUTH0_CLIENT_SECRET;

//     try {
//         // Get an access token to authenticate the API request
//         const authResponse = await axios.post(`https://${domain}/oauth/token`, {
//             grant_type: 'client_credentials',
//             client_id: clientId,
//             client_secret: clientSecret,
//             audience: `https://${domain}/api/v2/`,
//         });

//         const accessToken = authResponse.data.access_token;

//         // Make a request to the Management API to fetch the users
//         const usersResponse = await axios.get(`https://${domain}/api/v2/users`, {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//             params: {
//                 per_page: 100, // Adjust the number of users per page as needed
//             },
//         });

//         const users = usersResponse.data;
//         console.log('User List:', users);

//         // Process the user data as needed

//     } catch (error) {
//         console.error('Error retrieving users:', error);
//     }
// };

// getAuth0Users();

// Assume list of bookmarked genes has provided by api
const bookmarkedGenes = [
    "ENSG00000000003.14/1",
    "ENSG00000000003.15/1",
    "ENSG00000000003.16/1",
    "ENSG00000000003.17/1",
]

// Assume Permission is provided by api
const is_admin = true;
const is_member = true;

const url = process.env.REACT_APP_FRONTEND_URL;

function Profile() {
    const { user, isLoading, getAccessTokenSilently, isAuthenticated } = useAuth0();

    const userMetadata = user?.['https://unique.app.com/user_metadata'];

    return isLoading ? (
        <div>
            <LoadingSpinner />
        </div>
    ) : (
        <div>
            {userMetadata && (
                // <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
                <div >
                    <h1>User Page</h1>
                    <div className='mx-3 my-2'>
                        <h2>{userMetadata.given_name} {userMetadata.family_name}</h2>
                    </div>
                    <div>
                        <h2>Bookmarked Genes</h2>
                        {bookmarkedGenes.map((geneUrl) =>
                            <a href={`${url}/${geneUrl}`} className="mx-3" style={{ display: 'block', marginBottom: '10px' }}>{geneUrl}</a>
                        )}

                    </div>
                    {is_admin && (
                        <div>
                            <a href={`${url}/manage`}>Manage Users</a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Profile;
