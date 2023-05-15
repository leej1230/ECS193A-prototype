import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingSpinner from './components/spinner/spinner';

function Profile() {
    const { user, isLoading } = useAuth0();

    const userMetadata = user?.['https://unique.app.com/user_metadata'];

    return isLoading ? (
        <div>
            <LoadingSpinner />
        </div>
    ) : (
        <div>
            {userMetadata && (
                <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
            )}
        </div>
    );
}

export default Profile;
