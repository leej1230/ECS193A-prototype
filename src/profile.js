import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import LoadingSpinner from './components/spinner/spinner';

import './profile.css';

const user_get_url = `${process.env.REACT_APP_BACKEND_URL}/api/login`;
const url = process.env.REACT_APP_FRONTEND_URL;

const is_admin = true;
const is_member = true;

function Profile() {
  const { user, isLoading } = useAuth0();
  const [userInfo, setUserInfo] = useState();
  const [bookmarkedGenes, setBookmarkedGenes] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true); // New state to control the visibility of the spinner

  const userMetadata = user?.['https://unique.app.com/user_metadata'];

  const handleFetchUser = async () => {
    if (user && user.sub) {
      const userSub = user.sub.split("|")[1];
      try {
        const res = await axios.get(`${user_get_url}/${userSub}`);
        console.log(res.data);
        setUserInfo(res.data);
        setBookmarkedGenes(res.data.bookmarked_genes);
      } catch (e) {
        console.log("Failed to fetch user Info.", e);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 1000);

    if (!isLoading) {
      handleFetchUser();
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  if (showSpinner) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (!userInfo || isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <body id="page-top" class="gene_body">
      <div className="profile">
        <div className="profile-card">
          <h2 className="card-title1">User Page</h2>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title2">User Information</h2>
          <div className="card-content">
            <div className="user-info">
              {userMetadata && (
                <h4>
                  User full name: {userMetadata.given_name} {userMetadata.family_name}
                </h4>
              )}
              <ul className="role-list">
                {is_admin && is_member ? (
                  <h4>User Role: Admin and Verified</h4>
                ) : !is_admin && is_member ? (
                  <h4>User Role: Verified</h4>
                ) : (
                  <h4>User Role: Not Verified</h4>
                )}
                {is_admin && (
                  <div>
                  <a href={`${url}/manage`} style={{ fontSize: '22px' }}>Manage Users</a>
                </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title2">Gene Bookmarks</h2>
          {bookmarkedGenes.length !== 0 ? (
            bookmarkedGenes.map((geneUrl) => (
              <a
                href={`${url}/gene/${geneUrl}`}
                className="mx-3"
                style={{ display: 'block', marginBottom: '10px' }}
                key={geneUrl}
              >
                {geneUrl}
              </a>
            ))
          ) : (
            <div className="no-bookmarks">
              <h4>No gene bookmarks Found!</h4>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title2">Record Bookmarks</h2>
          {(
            <div className="no-bookmarks">
              <h4>No record bookmarks Found!</h4>
            </div>
          )}
        </div>
      </div>

    </body>
  );
}

export default Profile;
