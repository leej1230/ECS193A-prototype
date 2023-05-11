import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import CryptoJS from "crypto-js";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { InputAdornment } from "@material-ui/core";
import "./components/bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "./components/bootstrap_gene_page/css/sb-admin-2.min.css";


const api_url = `${process.env.REACT_APP_BACKEND_URL}/api/login`;
const encryptionKey = `${process.env.REACT_APP_ENCRYPTION_SECRET_KEY}`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [disableButton, setDisableButton] = useState(true);
  
  const handleSubmit = async(e) => {
    e.preventDefault();

    // if (email === "" || password === "") {
    //   alert("Either Email or Password is missing.");
    //   return;
    // }

    // Encrypt password to send to backend
    const encryptedPassword = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(password),
      encryptionKey
    ).toString(CryptoJS.enc.Hex);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", encryptedPassword);

    axios
      .post(api_url, formData)
      .then((result) => {
        console.log(result);
        // Use result to identify whether the login was successful or not
        alert("You have submitted!");
      })
      .catch((error) => {
        if (error.response.status === 404) {
          alert(
            "Could not find an account with that email or password. Please try again."
          );
        }
      });
  };

  return (
    <div
      className="container"
      style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}
    >
      <div class="text-center">
        <h1>Sign In</h1>
      </div>
      <form>
        <div class="form-outline mb-4">
          <TextField
            id="Email_Address"
            onChange={(e) => {
              setEmail(e.target.value)
              if(e.target.value && password){
                setDisableButton(false);
              } else {
                setDisableButton(true);

              }
            }}
            type="text"
            variant="outlined"
            fullWidth
            label="Email Address"
          />
        </div>

        <div class="form-outline mb-4">
          <TextField
            id="Password"
            onChange={(e) => {
              setPassword(e.target.value);
              if(e.target.value && email){
                setDisableButton(false);
              } else {
                setDisableButton(true);
              }
            }}
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            label="Password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <button
          type="button"
          class="btn btn-primary btn-block mb-4"
          onClick={handleSubmit}
          disabled={disableButton}
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

export default Login;
