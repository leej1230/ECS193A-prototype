// Add description of the file
// Add URL of the file
// Use material ui for components

import axios from "axios";
import React, { useState } from "react";
import "./UploadDataset.css";

import { useAuth0 } from "@auth0/auth0-react";

import { Cancel, CheckCircle } from "@material-ui/icons";
import "../bootstrap_gene_page/css/sb-admin-2.min.css";
import "../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import LoadingSpinner from "../spinner/spinner";

function UploadDataset() {
    const [selectedFile, setSelectedFile] = useState();
    const [urltoFile, setUrltoFile] = useState("");
    const [description, setDescription] = useState("");
    const [dateCreated, setDateCreated] = useState();
    const [progress, setProgress] = useState(0);
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [state, setState] = useState(false);
    const [geneCode, setgeneCode] = useState("");
    const [patientCode, setpatientCode] = useState("");
    const [rowType, setrowType] = useState("");
    // SelectedFile will be a variable for the file and isFilePicked will be used to verify if file has been picked or not
    const api_url = `${process.env.REACT_APP_BACKEND_URL}/api/upload_dataset`;

    const { user, isLoading } = useAuth0();
    const userMetadata = user?.["https://unique.app.com/user_metadata"];

    const changeHandler = (e) => {
        setSelectedFile(e.target.files[0]);
        setDateCreated(e.target.files[0].lastModifiedDate);
        setIsFilePicked(true);
    };

    const handleSubmission = () => {
        const formData = new FormData();

        console.log(selectedFile);
        console.log(urltoFile);
        console.log(dateCreated);
        console.log(isFilePicked);
        console.log(geneCode);
        console.log(patientCode);
        console.log(rowType);

        if (isFilePicked === false) {
            return;
        }

        formData.append("file", selectedFile);
        formData.append("description", description);
        formData.append("urltoFile", urltoFile);
        formData.append("dateCreated", dateCreated);
        formData.append('geneCode', geneCode);
        formData.append('patientCode', patientCode);
        formData.append('rowType', rowType);
        formData.append('nameFull' , `${userMetadata.given_name}${" "}${userMetadata.family_name}`);

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
            onUploadProgress: function (e) {
                setProgress((e.loaded / e.total) * 50);
            },
            onDownloadProgress: function (e) {
                setProgress(50 + (e.loaded / e.total) * 50);
            },
        };

        console.log(api_url);

        axios
            .post(api_url, formData, config)
            .then((result) => {
                setState(true);
            })
            .catch((error) => {
                setState(false);
            });
    };

    return (
        <div className="form-container">
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between ">
                    <h5 class="m-0 font-weight-bold text-primary">
                        File Upload
                    </h5>
                </div>
                <div class="card-body">
                    <form>
                        <div class="form-group">
                            <div class="mb-3">
                                <label for="formFile" class="form-label">
                                    Dataset CSV File Upload
                                </label>
                                <input
                                    class="form-control"
                                    type="file"
                                    id="formFile"
                                    onChange={(e) => changeHandler(e)}
                                />
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Description</label>
                            <input
                                type="text"
                                class="form-control"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">URL</label>
                            <input
                                type="url"
                                class="form-control"
                                id="exampleInputPassword1"
                                onChange={(e) => setUrltoFile(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dataOption">Dataset Row Type</label>
                            <select className="form-control" id="dataOption" onChange={(e) => setrowType(e.target.value)}>
                                <option value="">Choose row type</option>
                                <option value="gene">Gene</option>
                                <option value="patient">Patient</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="geneCode">Gene Code</label>
                            <input type="text" className="form-control" id="geneCode" onChange={(e) => setgeneCode(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="patientCode">Patient Code</label>
                            <input type="text" className="form-control" id="patientCode" onChange={(e) => setpatientCode(e.target.value)} />
                        </div>
                        <button
                            type="button"
                            class="btn btn-primary"
                            onClick={handleSubmission}
                        >
                            Submit
                        </button>
                    </form>

                    <div class="row justify-content-center">
                        {progress > 0 && progress < 100 && <LoadingSpinner />}
                        {progress === 100 && state === true && (
                            <CheckCircle
                                color="green"
                                htmlColor="green"
                                fontSize="large"
                            />
                        )}
                        {progress === 100 && state === false && (
                            <Cancel
                                color="red"
                                htmlColor="red"
                                fontSize="large"
                            />
                        )}
                    </div>
                </div>
            </div>

            <script src="../bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
            <script src="../bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

            <script src="../bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>

            <script src="../bootstrap_gene_page/js/sb-admin-2.min.js"></script>

            <script src="../bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>

            <script src="../bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
            <script src="../bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>
        </div>
    );
}

export default UploadDataset;
