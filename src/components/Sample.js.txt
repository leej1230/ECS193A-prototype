import { Box, Card, CardContent } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Sample.css";

import SampleGraph from "./gene_folder/echartdemo";

//import { useTable } from "react-table";
import MaterialTable from "material-table";

import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import "./bootstrap_gene_page/css/sb-admin-2.min.css";
import "./bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";

const tableIcons = {
    Add: AddBox,
    Check: Check,
    Clear: Clear,
    Delete: DeleteOutline,
    DetailPanel: ChevronRight,
    Edit: Edit,
    Export: SaveAlt,
    Filter: FilterList,
    FirstPage: FirstPage,
    LastPage: LastPage,
    NextPage: ChevronRight,
    PreviousPage: ChevronLeft,
    ResetSearch: Clear,
    Search: Search,
    SortArrow: ArrowUpward,
    ThirdStateCheck: Remove,
    ViewColumn: ViewColumn,
};

const SAMPLE_ID = window.location.pathname.split("/").at(-1);
const URL = `${process.env.REACT_APP_BACKEND_URL}/api/patient/${SAMPLE_ID}`;
const columns = [
    { title: "Field Name", field: "field_name" },
    { title: "Value", field: "value" },
];

function Sample() {
    // state = {samples: []}
    const [patient_data, setPatient_data] = useState();
    const [patient_table_input_format,] =
        useState([{ field_name: "", value: "" }]);
    const [graphType, setGraphType] = useState("bar");

    // componentDidMount() {
    useEffect(() => {
        async function fetchPatientData() {
            const res = await axios.get(URL);
            setPatient_data(res.data);
            //set_patient_table_input_format( createPatientFormatted(patient_data) );
            // .then(res => {
            // })
            //console.log( patient_data['patient_id'] );
        }
        fetchPatientData();
    });

    return (
        <div>
            <div className="headerGroup">
                <p className="textElement">Last Updated: 01-03-2023</p>
                <div className="buttonGroup">
                    <button className="buttonElement"> Download </button>
                    <button className="buttonElement"> Delete </button>
                </div>
            </div>

            {patient_data ? (
                <div>
                    <div className="titleLayout">
                        <h3>{patient_data["patient_id"]}</h3>
                    </div>

                    <div className="cardLayout">
                        <div className="cardContent">
                            <h4 className="cardTitle">Description</h4>
                            <p>{"info"}</p>
                        </div>
                    </div>

                    <Box className="cardLayout">
                        <Card variant="outlined">
                            <CardContent>
                                <h4 className="cardTitle">Gene Information</h4>
                                <MaterialTable
                                    columns={columns}
                                    data={patient_table_input_format}
                                    icons={tableIcons}
                                    options={{
                                        paging: false,
                                        showTitle: false,
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Box>

                    <ul>
                        <li key={patient_data.patient_id}>
                            <b>Patient ID: {patient_data.patient_id}</b>
                            <table className="patient-data-table">
                                <tr>
                                    {patient_data.gene_ids.map((gene_id) => (
                                        <th key={gene_id}>{gene_id}</th>
                                    ))}
                                </tr>
                                <tr>
                                    {patient_data.gene_values.map(
                                        (gene_value) => (
                                            <td key={gene_value}>
                                                {gene_value}
                                            </td>
                                        )
                                    )}
                                </tr>
                            </table>
                        </li>
                        <SampleGraph
                            categories={patient_data.gene_ids}
                            data={patient_data.gene_values}
                            type={graphType}
                        />
                    </ul>
                    <div className="GraphType">
                        <FormControl margin="dense" fullWidth>
                            <InputLabel id="GraphTypeLabel">
                                Graph Type
                            </InputLabel>
                            <Select
                                labelId="GraphTypeLabel"
                                id="GraphTypeSelect"
                                value={graphType}
                                label="GraphType"
                                onChange={(e) => {
                                    setGraphType(e.target.value);
                                }}
                            >
                                <MenuItem value={"bar"}>Bar</MenuItem>
                                <MenuItem value={"line"}>Basic Line</MenuItem>
                                <MenuItem value={"pie"}>Pie</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className="bottomInfo">
                        <Box className="bottomCard">
                            <Card variant="outlined">
                                <CardContent>
                                    <h4 className="cardTitle">Stats</h4>
                                    <p>Number of Patients: </p>
                                    <p>Avg Age of Patients: </p>
                                    <p>Number of Missing Cells: </p>
                                    <p>Patient Conditions: </p>
                                </CardContent>
                            </Card>
                        </Box>

                        <Box className="bottomCard">
                            <Card variant="outlined">
                                <CardContent>
                                    <h4 className="cardTitle">
                                        Recently Viewed Members
                                    </h4>
                                    <p>Person 1</p>
                                    <p>Person 2</p>
                                    <p>Person 3</p>
                                </CardContent>
                            </Card>
                        </Box>
                    </div>

                    <Box className="cardLayout">
                        <Card variant="outlined">
                            <CardContent>
                                <h4 className="cardTitle">Gene View</h4>
                            </CardContent>
                        </Card>
                    </Box>

                    <script src="./bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
                    <script src="./bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

                    <script src="./bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>

                    <script src="./bootstrap_gene_page/js/sb-admin-2.min.js"></script>

                    <script src="./bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>

                    <script src="./bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
                    <script src="./bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default Sample;
