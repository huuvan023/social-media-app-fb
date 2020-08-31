import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOpenOutlined'
import Typography from '@material-ui/core/Typography';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';
import { escapeHtml, emailValidate } from './../utils/validate';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(5),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '55%',
    left: '50%',
    fontWeight: "bold",
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    position: 'relative',
  },
}));

export default function SignUp() {
  const classes = useStyles();
  let [handleName, sethandleName] = useState("");
  let [email, setemail] = useState("");
  let [password, setpassword] = useState("");
  let [confirmPassword, setconfirmPassword] = useState("");
  let [check, setcheck] = useState(false)
  let [errors,setErrors] = useState({});
  let [loading, setLoading] = useState(false);
  const history = useHistory();


  //Handle change input field
  const onChangeValue = (e) => {
    switch( e.target.name ) {
      case "handleName":
        sethandleName(e.target.value)
      break;
      case "email":
        setemail(e.target.value)
      break;
      case "password":
        setpassword(e.target.value)
      break;
      case "confirmPassword":
        setconfirmPassword(e.target.value)
      break;
      case "checkAgreement":
        setcheck(!check)
      break;
    }
  }
  const onSignUp = (e) => {
    e.preventDefault();
    let checkEmpty = false;
    setErrors({});
    
    //check empty data
    if( escapeHtml(handleName).trim() === "" ) {
      setErrors(prevState => ({ ...prevState, handleName: "Handle name must not be empty!"}))
      checkEmpty = true
    }
    if( escapeHtml(email).trim() === "" ) {
      setErrors(prevState => ({ ...prevState, email: "Email must not be empty!"}))
      checkEmpty = true
    }
    if( escapeHtml(password).trim() === "" ) {
      setErrors(prevState => ({ ...prevState, password: "Password must not be empty!"}))
      checkEmpty = true
    }
    if( escapeHtml(confirmPassword).trim() === "" ) {
      setErrors(prevState => ({ ...prevState, confirmPassword: "Confirm password must not be empty!"}))
      checkEmpty = true
    }

    //Sign in!
    if( !checkEmpty ) {
      if( escapeHtml(handleName).indexOf(" ") >= 1 ) {
        swal({
          title: "Error!",
          button: false,
          text: "Handle name not allowed whitespace!",
          icon: "error",
        })
      }
      else {
        if( check ) {
          if( !emailValidate(email) ) {
            setErrors(prevState => ({ ...prevState, email: "Email not valid!" }))
          }
          else {
            setLoading(true)
            const newUser = {
              email: escapeHtml(email),
              password: escapeHtml(password),
              confirmPassword: escapeHtml(confirmPassword),
              handle: escapeHtml(handleName)
            }
            axios.post("/signup", newUser)
            .then( res => {
              setLoading(false);
              localStorage.setItem('FBIDToken',`HV ${res.data.token}`)
              swal({
                title: "Success!",
                button: {
                  text: "Login"
                },
                text: "Sign in successfully!",
                icon: "success",
              })
              .then(() => {
                history.push("/login")
              })
            })
            .catch( error => {
              setLoading(false);
              swal({
                title: "Error!",
                button: false,
                text: error.response.data.message,
                icon: "error",
              })
            })
          }
        }
        else {
          swal({
            title: "Error!",
            button: false,
            text: "Please agree our term of use",
            icon: "error",
          })
        }
      }
    }
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography variant="h3" color="primary" align="center" >
              Social Media App</Typography>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form className={classes.form} onSubmit={ onSignUp } noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                error={ errors.email ? true : false }
                helperText={ errors.email }
                value={ email }
                onChange={ onChangeValue }
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                onChange={ onChangeValue }
                required
                error={ errors.handleName ? true : false }
                helperText={ errors.handleName}
                value={ handleName }
                fullWidth
                id="handle"
                label="Handle Name"
                name="handleName"
                autoComplete="handleName"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                value={ password }
                fullWidth
                error={ errors.password ? true : false }
                helperText={ errors.password }
                onChange={ onChangeValue }
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                onChange={ onChangeValue }
                value={ confirmPassword }
                fullWidth
                error={ errors.confirmPassword ? true : false }
                helperText={ errors.confirmPassword }
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="confirm-password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox  value="allowExtraEmails" color="primary" />}
                label="Agree to our terms of use"
                name="checkAgreement"
                onChange={ onChangeValue }
                checked={ check }
              />
            </Grid>
          </Grid>
          <div className={classes.wrapper}>
              <Button
                type="submit"
                fullWidth
                disabled = { loading ? true : false }
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
              { loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
        </div>
      </Grid>
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
    </Grid>
  );
}