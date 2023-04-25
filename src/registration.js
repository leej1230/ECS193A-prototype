import React, { useState } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import TextField from "@mui/material/TextField";
import "./components/bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "./components/bootstrap_gene_page/css/sb-admin-2.min.css";

const api_url = `${process.env.REACT_APP_BACKEND_URL}/api/registration`;
const encryptionKey = process.env.ENCRYPTION_SECRET_KEY;

function Registration() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [validFirstName, setValidFirstName] = useState();
  const [validLastName, setValidLastName] = useState();
  const [validEmail, setValidEmail] = useState();
  const [validPassword, setValidPassword] = useState();
  const [validRePassword, setValidRePassword] = useState();

  const handleSubmit = () => {
    if (email === "" || password === "") {
      alert("Either Email or Password is missing.");
      return;
    }

    if(rePassword !== password) {
      alert("Password is NOT matching!");
      return;
    }

    // Encrypt password to send to backend
    const encryptedPassword = CryptoJS.AES.encrypt(password, encryptionKey).toString();

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", encryptedPassword);
    axios
      .post(api_url, formData)
      .then((result) => {
        console.log(result)
        // Use result to identify whether the login was successful or not
        alert("You have submitted!");
      })
      .catch((error) => {
        if (error.response.status === 409) {
          alert("An account with that email already exists. Please use a different email.");
        }
      });
  };

  const handleValidate = (fieldName, value) => {
    switch(fieldName){
      case 'email':
        const emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        setValidEmail(emailValid);
        if (emailValid) {
          setEmail(value);
        }
        break

    }
  }

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
            onChange={(e) => handleValidate("email",e.target.value)}
            type="text"
            variant="outlined"
            helperText={validEmail?"":"Fill in a valid email address"}
            fullWidth
            label="Email Address"
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
