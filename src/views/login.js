import React, { useState } from 'react';
import { Button, TextField, Box, Container, Card } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Logo from '../components/Logo';
import background from './../components/bg2.png';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

async function loginUser(credentials) {
    return axios.post(`http://127.0.0.1:3090/api/login`, credentials)
      .then(res => {
        console.log(res.data)
        return res.data
      })
 }

export default function Signin() {
  const classes = useStyles();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await loginUser({
      email,
      password
    });
    if ('accessToken' in response) {
      swal("Success", response.message, "success", {
        buttons: false,
        timer: 2000,
      })
      .then((value) => {
        localStorage.setItem('accessToken', response['accessToken']);
        localStorage.setItem('user', JSON.stringify(response['user']));
        window.location.href = "/profile";
      });
    } else {
      swal("Failed", response.message, "error");
    }
  }

  return (
    <>
      <Helmet>
        <title>Login | Retail system POS Project</title>
      </Helmet>
      <Box
        style={{
          backgroundImage: `url(${background})`,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
        }}
      >
        <Container style={{ display: "flex", justifyContent: "center" }}>
          <Card style={{ maxWidth: 340, display: "flex", justifyContent: "center", borderRadius: '20px', padding: "60px 40px 60px 40px" }}>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <Logo style={{ width: "190px" }} />
                {/* <img alt="Logo" src="/static/logodcxblack.png" style={{ width: "170px" }} /> */}
              </div>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                name="email"
                label="อีเมล"
                size="small"
                onChange={e => setEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="password"
                name="password"
                label="รหัสผ่าน"
                type="password"
                size="small"
                onChange={e => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                เข้าสู่ระบบ
              </Button>
            </form>
          </Card>
        </Container>
      </Box>
    </>
  );
}