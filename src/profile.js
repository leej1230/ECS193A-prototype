import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingSpinner from './components/spinner/spinner';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

const user_get_url = `${process.env.REACT_APP_BACKEND_URL}/api/login`;
const remove_gene_bookmark_url = `${process.env.REACT_APP_BACKEND_URL}/api/remove-bookmark`;
const remove_dataset_bookmark_url = `${process.env.REACT_APP_BACKEND_URL}/api/remove-dataset-bookmark`;
const url = process.env.REACT_APP_FRONTEND_URL;

// Assume list of bookmarked genes has provided by api
// const bookmarkedGenes = [
//     "ENSG00000000003.14/1",
//     "ENSG00000000003.15/1",
//     "ENSG00000000003.16/1",
//     "ENSG00000000003.17/1",
// ]

// Assume Permission is provided by api
const is_admin = true;
const is_member = true;

function Profile() {
    const { user, isLoading } = useAuth0();
    const [userInfo, setUserInfo] = useState();
    const [bookmarkedGenes, setBookmarkedGenes] = useState([]);
    const [bookmarkedDatasets, setBookmarkedDatasets] = useState([]);

    const userMetadata = user?.["https://unique.app.com/user_metadata"];

    const handleFetchUser = async () => {
        const userSub = user.sub.split("|")[1];
        try {
            const res = await axios.get(`${user_get_url}/${userSub}`);
            console.log(res.data);
            setUserInfo(res.data);
            setBookmarkedGenes(res.data.bookmarked_genes);
            setBookmarkedDatasets(res.data.bookmarked_datasets);
        } catch (e) {
            console.log("Failed to fetch user Info.", e);
        }
    };

    const handleRemoveBookmark = async (type, val) => {
        if (type == "dataset") {
            const formData = new FormData();
            formData.append("user_id", user.sub.split("|")[1]);
            formData.append("dataset_url", val);
            axios.post(remove_dataset_bookmark_url, formData).then((res) => {
                console.log(res.data)
                setBookmarkedDatasets(res.data)
            })
        } else {
            const formData = new FormData();
            formData.append("user_id", user.sub.split("|")[1]);
            formData.append("gene_url", val);
            axios.post(remove_gene_bookmark_url, formData).then((res) => {
                console.log(res.data)
                setBookmarkedGenes(res.data)
            })
        }
    }

    useEffect(() => {
        handleFetchUser();
    }, []);

    return (
        <div>
            {/* Move down to avoid overlap with navbar */}
            <div className="container" style={{ height: "70px", border: "1px solid black" }}></div>
            {userMetadata && (
                <div className="container mx-2 my-2">
                    {isLoading || !userInfo ? (
                        <div style={{ marginTop: "40vh" }}>
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <div>
                            <h1>User Page</h1>
                            <div className='mx-3 my-2'>
                                <h2>{userMetadata.given_name} {userMetadata.family_name}</h2>
                            </div>
                            <h2>Roles</h2>
                            <div className='mx-3 my-2'>
                                {is_admin ? (
                                    <h4>Admin</h4>
                                ) : (
                                    <></>
                                )}
                                {is_member ? (
                                    <h4>Verified</h4>
                                ) : (
                                    <></>
                                )}
                                {!is_admin && !is_member ? (
                                    <h4>Not Verified</h4>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div>
                                <h2>Bookmarked Genes</h2>
                                {bookmarkedGenes && bookmarkedGenes.length !== 0 ? (
                                    bookmarkedGenes.map((geneUrl) => (
                                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                            <DeleteIcon sx={{ color: 'red' }} onClick={() => handleRemoveBookmark("gene", geneUrl)} />
                                            <a href={`${url}/gene/${geneUrl}`} className="mx-3" style={{ marginLeft: '5px' }}>
                                                {geneUrl}
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <h4 className='mx-3 my-2'>No Bookmarks Yet!</h4>
                                )}
                            </div>

                            <div>
                                <h2>Bookmarked Datasets</h2>
                                {bookmarkedGenes && bookmarkedDatasets.length !== 0 ? (
                                    bookmarkedDatasets.map((datasetsUrl) => (
                                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                            <DeleteIcon sx={{ color: 'red' }} onClick={() => handleRemoveBookmark("dataset", datasetsUrl)} />
                                            <a href={`${url}/dataset/${datasetsUrl.split('/')[1]}`} className="mx-3" style={{ marginLeft: '5px' }}>
                                                {datasetsUrl.split('/')[0]}
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <h4 className='mx-3 my-2'>No Bookmarks Yet!</h4>
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
            )}
        </div>
    );
}

export default Profile;
