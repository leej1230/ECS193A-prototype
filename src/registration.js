import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import "./components/bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "./components/bootstrap_gene_page/css/sb-admin-2.min.css";

const api_url = `${process.env.REACT_APP_BACKEND_URL}/api/`;

function Registration() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleSubmit = () => {
    if (userName == "" || password == "") {
      alert("Either Email or Password is missing.");
      return;
    }

    if(rePassword != password) {
      alert("Password is NOT matching!");
      return;
    }

    const userInput = {
      firstName: firstName,
      lastName: lastName,
      email: userName,
      password: password,
    };

    axios
      .post(api_url, userInput)
      .then((result) => {
        // Use result to identify whether the login was successful or not
        alert("You have submitted!");
      })
      .catch((error) => {
        alert(
          `Network or Backend error! Show message below to developer team: ${error}`
        );
      });
  };

  return (
    <div
      className="container"
      style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}
    >
      <div class="text-center">
        <h1>Register</h1>
      </div>
      <form>
      <div class="form-outline mb-4">
          <TextField
            id="First_Name"
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
            variant="outlined"
            fullWidth
            label="First Name"
          />
        </div>
        <div class="form-outline mb-4">
          <TextField
            id="Last_Name"
            onChange={(e) => setLastName(e.target.value)}
            type="text"
            variant="outlined"
            fullWidth
            label="Last Name"
          />
        </div>
        <div class="form-outline mb-4">
          <TextField
            id="Email_Adress"
            onChange={(e) => setUserName(e.target.value)}
            type="text"
            variant="outlined"
            fullWidth
            label="Email Adress"
          />
        </div>

        <div class="form-outline mb-4">
          <TextField
            id="Password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            variant="outlined"
            fullWidth
            label="Password"
          />
        </div>

        <div class="form-outline mb-4">
          <TextField
            id="rePassword"
            onChange={(e) => setRePassword(e.target.value)}
            type="password"
            variant="outlined"
            fullWidth
            label="Confirm Password"
          />
        </div>

        <button
          type="button"
          class="btn btn-primary btn-block mb-4"
          onClick={handleSubmit}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Registration;
