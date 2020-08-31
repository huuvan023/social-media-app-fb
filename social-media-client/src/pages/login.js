import React, { useState , useContext} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { green } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import VpnKeySharpIcon from '@material-ui/icons/VpnKeySharp';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link, useHistory } from 'react-router-dom';
import { escapeHtml, emailValidate } from './../utils/validate';
import axios from 'axios';
import { store } from './../store/store';
import swal from 'sweetalert';
import PropTypes from 'prop-types'; 


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Typography display="inline" variant="caption" color="inherit" >
        Social Media App
      </Typography>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  wrapper: {
    position: 'relative',
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
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '55%',
    left: '50%',
    fontWeight: "bold",
    marginTop: -12,
    marginLeft: -12,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


export default function Login() {
  const classes = useStyles();
  let [email,setEmail] = useState(localStorage.getItem("email") ? localStorage.getItem("email") : "");
  let [password,setPassword] = useState(localStorage.getItem("password") ? localStorage.getItem("password") : "");
  let [formLabel,setFormLabel] = useState(true)
  let [error,setError] = useState({})
  let [loading, setLoading] = useState(false);
  const history = useHistory();
  const globalState = useContext(store)
  const { dispatch } = globalState;
  

  //Change input value
  const onChangeValue = ( e ) => {
    if( e.target.name === "email" ) {
      setEmail(e.target.value)
    }
    if( e.target.name === "password" ) {
      setPassword(e.target.value)
    }
    if( e.target.name === "formLabel" ) {
      setFormLabel(!formLabel)
    }
  }
  //Login submit handle function
  const onLogin = (e) => {
    e.preventDefault();
    let errorField = false;
    setError({})
    if( !emailValidate(escapeHtml(email)) ) {
      setError({
        email: "Email not valid!"
      })
    }
    else {
      setLoading(true);
      const user = {
        email: escapeHtml(email),
        password: escapeHtml(password)
      }
      axios.post("/login", user)
      .then( res => {
        setLoading(false)
        swal({
          title: "Success!",
          button: {
            text: "Great!"
          },
          text: "Login successfully!",
          icon: "success",
        })
        .then(() => {
          const FBIDToken = `HV ${res.data.token}`;
          localStorage.setItem('FBIDToken', FBIDToken);
          if( formLabel ) {
            localStorage.setItem("email",email);
            localStorage.setItem("password",password)
          }
          else {
            localStorage.removeItem('email');
            localStorage.removeItem('password');
          }
          dispatch({
            type: "SET_AUTHENTICATED"
          })
          history.push("/")
        })
      })
      .catch(error => {
        if( error.response.data.error ) {
          setError(error.response.data.error)
        }
        else {
          swal({
            title: "Error!",
            button: false,
            text: error.response.data.message,
            icon: "error",
          })
        }
        setLoading(false);
      })
    }
  }
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography variant="h3" color="primary" align="center" >
              Social Media App</Typography>
          <Avatar className={classes.avatar}>
            <VpnKeySharpIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={ onLogin }>
            <TextField
              variant="outlined"
              margin="normal"
              onChange={ onChangeValue }
              required
              value={ email }
              fullWidth
              error= { error.email ? true : false }
              helperText={ error.email ? error.email : ""}
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              error={ error.password ? true : false }
              helperText={ error.password ? error.password : ""}
              value={ password }
              onChange={ onChangeValue }
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              onChange={ onChangeValue }
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              name="formLabel"
              checked= { formLabel }
            />
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
            <Grid container>
              <Grid item xs>
                <Link to="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
