import React, { useState } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { InputAdornment } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import "../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";
import "../bootstrap_gene_page/css/sb-admin-2.min.css";

const api_url = `${process.env.REACT_APP_BACKEND_URL}/api/registration`;
const encryptionKey = `${process.env.REACT_APP_ENCRYPTION_SECRET_KEY}`;

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

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const strongPassword = RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  );

  const handleSubmit = () => {
    if (
      !(
        validEmail &&
        validFirstName &&
        validLastName &&
        validPassword &&
        validRePassword
      )
    ) {
      alert("Some information is missing.");
      return;
    }

    // Encrypt password to send to backend
    // TODO make encrypt work
    // const encryptedPassword = CryptoJS.AES.encrypt(
    //   CryptoJS.enc.Utf8.parse(password),
    //   encryptionKey
    // ).toString();

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);
    axios
      .post(api_url, formData)
      .then((result) => {
        console.log(result);
        // Use result to identify whether the login was successful or not
        alert("You have submitted!");
      })
      .catch((error) => {
        if (error.response.status === 409) {
          alert(
            "An account with that email already exists. Please use a different email."
          );
        }
      });
  };

  const handleValidate = (fieldName, value) => {
    switch (fieldName) {
      case "email":
        const emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        setValidEmail(emailValid);
        setEmail(value);

        break;

      case "firstName":
        const firstNameValid = value !== "";
        setValidFirstName(firstNameValid);
        setFirstName(value);
        break;

      case "lastName":
        const lastNameValid = value !== "";
        setValidLastName(lastNameValid);
        setLastName(value);
        break;

      case "password":
        const passwordValid = strongPassword.test(value);
        setValidPassword(passwordValid);
        setPassword(value);
        break;

      case "rePassword":
        const rePasswordVaild = password === value;
        setValidRePassword(rePasswordVaild);
        setRePassword(value);
        break;
      default:
        break;
    }
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
            onChange={(e) => handleValidate("firstName", e.target.value)}
            type="text"
            variant="outlined"
            helperText={validFirstName ? "" : "Fill in your first name"}
            fullWidth
            label="First Name"
          />
        </div>
        <div class="form-outline mb-4">
          <TextField
            id="Last_Name"
            onChange={(e) => handleValidate("lastName", e.target.value)}
            type="text"
            variant="outlined"
            helperText={validLastName ? "" : "Fill in your last name"}
            fullWidth
            label="Last Name"
          />
        </div>
        <div class="form-outline mb-4">
          <TextField
            id="Email_Adress"
            onChange={(e) => handleValidate("email", e.target.value)}
            type="text"
            variant="outlined"
            helperText={validEmail ? "" : "Fill in a valid email address"}
            fullWidth
            label="Email Address"
          />
        </div>

        <div class="form-outline mb-4">
          <TextField
            id="Password"
            onChange={(e) => handleValidate("password", e.target.value)}
            type={showPassword ? "text" : "password"}
            variant="outlined"
            helperText={
              validPassword
                ? ""
                : "Password must be: more than 8 characters long, at least one uppercase letter, lowercase letter, one digit, special character."
            }
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

        <div class="form-outline mb-4">
          <TextField
            id="rePassword"
            onChange={(e) => handleValidate("rePassword", e.target.value)}
            type={showRePassword ? "text" : "password"}
            variant="outlined"
            helperText={validRePassword ? "" : "Re-enter the password"}
            fullWidth
            label="Confirm Password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowRePassword(!showRePassword)}
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                  >
                    {showRePassword ? <Visibility /> : <VisibilityOff />}
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
          disabled={
            !(
              validEmail &&
              validFirstName &&
              validLastName &&
              validPassword &&
              validRePassword
            )
          }
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Registration;
