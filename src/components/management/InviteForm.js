import React, { useState } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const email_register_url = `${process.env.REACT_APP_BACKEND_URL}/api/submit_authorized_email`;

const InviteForm = () => {
  const [open, setOpen] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(email_register_url, { email: registerEmail });
      setOpen(true);
      setRegisterEmail('');
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToastClose = () => {
    setOpen(false);
  };

  return (
    <div id="page-top" className="gene_body">
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        open={open}
        autoHideDuration={5000}
        style={{ backgroundColor: 'green' }}
        onClose={handleToastClose}
        message="You have successfully registered an email"
      >
        <MuiAlert onClose={handleToastClose} severity="success" variant="filled">
          You have successfully registered an email
        </MuiAlert>
      </Snackbar>
      <div className="card">
        <div className="card-body">
          <h2 className="card-title2">Authorize User</h2>
          <form onSubmit={handleRegisterSubmit}>
            <TextField
              type="email"
              label="Email"
              variant="outlined"
              fullWidth
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InviteForm;
