import React, { useRef , useContext, useEffect, useState} from 'react'
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import blueGrey from '@material-ui/core/colors/blueGrey';
import lightBlue from '@material-ui/core/colors/lightBlue';
import LinkIcon from '@material-ui/icons/Link';
import IconButton from '@material-ui/core/IconButton';
import { store } from './../store/store';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import Skeleton from '@material-ui/lab/Skeleton';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
    CardContent, 
    Box, 
    Avatar ,
    Fab,
    Badge,
    Typography
    } from '@material-ui/core';
import swal from 'sweetalert';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
          margin: theme.spacing(1),
        },
        
    },
      avatar: {
        width: theme.spacing(15),
        height: theme.spacing(15),
    },
    cardContainer: {
        margin: theme.spacing(3,5),
        padding: theme.spacing(2),
    },
    cardAction: {
        height: 140,
        backgroundColor: "#FFF",
        "&:hover": {
            //you want this to be the same as the backgroundColor above
            backgroundColor: "#FFF"
        }
    },
    fabIconCustom: {
        backgroundColor: blueGrey[200],
        "&:hover": {
            //you want this to be the same as the backgroundColor above
            backgroundColor: blueGrey[300]
        },
        border: `1.2px solid ${theme.palette.background.paper}`,
    },
    boxItem: {
        margin: theme.spacing(1,0)
    },
    iconItem: {
        color: lightBlue[600],
        marginRight: theme.spacing(1)
    },
    intro: {
        fontWeight: "bold"
    },
    formTitle: {
        textAlign: "center"
    }
}))


export default function User() {
    const classes = useStyles();
    const uploadFile = useRef();
    let [loading,setLoading] = useState(false);
    const globalState = useContext(store)
    const { dispatch } = globalState;
    const [edit, setEdit] = useState(false)
    dayjs.extend(relativeTime);
    let [editProfile, setEditProfile] = useState({});

    const fetchData = () => {
        axios.get("/user")
        .then( res => {
            dispatch({
                type: "FETCH_USER",
                payload: res.data,
            })
            setLoading(false);
        })
    }   
      
    useEffect(()=>{
        const FBIDToken = localStorage.getItem('FBIDToken');
        axios.defaults.headers.common['Authorization'] =  FBIDToken;
        fetchData();
        
        return () => true;
    },[])


    const onUploadImage = () => {
        uploadFile.current.click();
    }

    //Open modal to edit user
    const onOpenEdit = () => {
        setEdit(true)
    }
    //Close modal edit user
    const onCloseEdit = () => {
        setEdit(false)
    }
    const onChangeProfile = (e) => {
        setEditProfile({
            ...editProfile,
            [e.target.name]:[e.target.value]
        })
    }
    const onSubmitChange = async () => {
        setLoading(true);
        let bio = "";
        if( editProfile.bio ) {
            bio = ((editProfile.bio).toString()).trim();
        }
        let website = "";
        if( editProfile.website ) {
            website = ((editProfile.website).toString()).trim();
        }
        let location = "";
        if( editProfile.location ) {
            location = ((editProfile.location).toString()).trim();
        }
        await axios.post("/user",{
            bio,
            website,
            location
        })
        .then((res) => {
            return fetchData();
        })
        .then(() => {
            setEdit(false); 
            toast.success('Update profile successfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        })
        .catch((error) => {
            swal({
                title: "Error!",
                button: false,
                text: error.response.data.error,
                icon: "error",
            }).then(() => {
                setLoading(false)
            })
        })
    }
    useEffect(()=>{
        setLoading(false);
    },[globalState.state.cedentials])

    //UPload new avatar
    const changeAvatar = async (e) => {
        if(e.target.files[0]) {
            setLoading(true)
            const image = e.target.files[0];
            const formData = new FormData();
            formData.append('image',image,image.name)
            await axios.post("/user/image",formData)
            .then((res) => {
                return fetchData();
            })
            .then(() => {
                toast.success('Update avatar successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
            })
            .catch( error => {
                swal({
                    title: "Error!",
                    button: false,
                    text: error.response.data.error,
                    icon: "error",
                })
                .then(() => {
                    setLoading(false)
                })
            })
        }
    }
    return  (
        <React.Fragment>
        <ToastContainer />
        <Card className={ classes.cardContainer }>
            
                <Typography align="center" 
                style={{ fontFamily:"Acme" }}
                variant="h4">
                    My profile
                </Typography>
  
            <CardContent>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <div className={classes.root}>
                    <input ref={ uploadFile } type="file" id="uploadImage" onChange={ changeAvatar }  style={{ display: "none" }}/>
                        {!globalState.state.cedentials || loading ? 
                        (
                            <Skeleton variant="circle" className={  classes.avatar } />
                        )
                        :
                        (
                        !globalState.state.cedentials.imageUrl ?
                            (<Skeleton variant="circle" className={  classes.avatar } />)
                            :
                            (<Badge
                                overlap="circle"
                                anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                                }}
                                badgeContent={
                                    <Fab onClick={ onUploadImage } className={ classes.fabIconCustom } 
                                        size="small" color="secondary" 
                                        aria-label="edit">
                                        <EditIcon />
                                    </Fab>
                                }>
                                <Avatar className={ classes.avatar } alt="" src={globalState.state.cedentials.imageUrl}/> 
                            </Badge>)
                        )
                        }
                    </div>
                </Box>
            </CardContent>
            <CardContent >
                <Box className={ classes.boxItem } display="flex" justifyContent="center">
                    { !globalState.state.cedentials ? 
                    (
                        <Skeleton variant="text" width={200} height={25} />
                    )
                    :
                    (<Typography color="secondary" variant="h5">
                        @{globalState.state.cedentials.handle}
                    </Typography>)
                    }
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" className={ classes.boxItem }>
                    { !globalState.state.cedentials || loading ? 
                    (
                        <Skeleton variant="text" width={200} height={25} />
                    )
                    :
                    (<Typography className={ classes.intro } align="center" color="textPrimary" variant="body1">
                        {globalState.state.cedentials.bio}
                    </Typography>)
                    }
                </Box>
                <Box className={ classes.boxItem } display="flex" justifyContent="center" alignItems="center">
                    { !globalState.state.cedentials || loading ? 
                    (
                        <Skeleton variant="text" width={200} height={25} />
                    ) :
                    (
                        <React.Fragment>
                            <PersonPinIcon className={ classes.iconItem }/>
                            <Typography align="center" color="textPrimary" variant="body2">
                                {globalState.state.cedentials.location}
                            </Typography>
                        </React.Fragment>
                    )
                    }
                </Box>
                <Box className={ classes.boxItem } display="flex" justifyContent="center" alignItems="center">
                    { !globalState.state.cedentials || loading ? 
                    (
                        <Skeleton variant="text" width={200} height={25} />
                    ) :
                    (
                        <React.Fragment>
                            <LinkIcon className={ classes.iconItem }/>
                            <Typography align="center" color="textPrimary" variant="body2">
                                {globalState.state.cedentials.website}
                            </Typography>
                        </React.Fragment>
                    )}
                </Box>
                <Box className={ classes.boxItem } display="flex" justifyContent="center" alignItems="center">
                    { !globalState.state.cedentials ? 
                    (
                        <Skeleton variant="text" width={200} height={25} />
                    ) :
                    (
                        <React.Fragment>
                            <PermContactCalendarIcon className={ classes.iconItem }/>
                            <Typography align="center" color="textPrimary" variant="body2">
                                Joined, {dayjs(globalState.state.cedentials.createdAt).fromNow()}
                            </Typography>
                        </React.Fragment>
                    )}
                </Box>
                <Box display="flex" justifyContent="flex-end">
                    <IconButton onClick={ onOpenEdit } aria-label="delete">
                        <EditIcon />
                    </IconButton>
                    <Dialog style={{ width:"30%",margin:"0 auto"}} open={edit} onClose={onCloseEdit} aria-labelledby="form-dialog-title">
                        <DialogTitle className={ classes.formTitle } id="form-dialog-title">Edit user profile</DialogTitle>
                        <DialogContent>
                        <DialogContentText className={ classes.formTitle } >
                            Change your information so that everyone can recognize you easily!
                        </DialogContentText>
                        <TextField  
                            autoFocus
                            margin="dense"
                            onChange={ onChangeProfile }
                            name="bio"
                            label="Your Bio"
                            type="text"
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            name="website"
                            onChange={ onChangeProfile }
                            label="Your Website"
                            type="text"
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            onChange={ onChangeProfile }
                            name="location"
                            label="Your Location"
                            type="text"
                            fullWidth
                        />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={onCloseEdit} color="primary">
                            CANCEL
                        </Button>
                        <Button onClick={ onSubmitChange } color="primary">
                            SAVE
                        </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </CardContent>
        </Card>
        </React.Fragment>
    )
}

