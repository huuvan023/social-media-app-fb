import React, { useRef } from 'react'
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import blueGrey from '@material-ui/core/colors/blueGrey';
import lightBlue from '@material-ui/core/colors/lightBlue';
import LinkIcon from '@material-ui/icons/Link';
import IconButton from '@material-ui/core/IconButton';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import { 
    Input, 
    CardContent, 
    Box, 
    Avatar ,
    Fab,
    Badge,
    Typography
    } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
          margin: theme.spacing(1),
        },
        
    },
      avatar: {
        height:100,
        width: 100,
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
    }
}))


export default function User() {
    const classes = useStyles();

    const uploadFile = useRef();

    const onUploadImage = () => {
        uploadFile.current.click();
    }
    return (
        <Card className={ classes.cardContainer }>
            <CardContent>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <div className={classes.root}>
                    <input ref={ uploadFile } type="file" id="uploadImage"  style={{ display: "none" }}/>
                        <Badge
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
                            }
                        >
                            <Avatar className={ classes.avatar } alt="" src="/avatar.jpg"/> 
                        </Badge>
                    </div>
                </Box>
            </CardContent>
            <CardContent >
                <Box className={ classes.boxItem } display="flex" justifyContent="center">
                    <Typography color="secondary" variant="h5">
                        @Name
                    </Typography>
                </Box>
                <Box className={ classes.boxItem }>
                    <Typography className={ classes.intro } align="center" color="textPrimary" variant="body1">
                        Tôi là Ngô Hữu Văn
                    </Typography>
                </Box>
                <Box className={ classes.boxItem } display="flex" justifyContent="center" alignItems="center">
                    <PersonPinIcon className={ classes.iconItem }/>
                    <Typography align="center" color="textPrimary" variant="body2">
                        HCM, Viet Nam
                    </Typography>
                </Box>
                <Box className={ classes.boxItem } display="flex" justifyContent="center" alignItems="center">
                    <LinkIcon className={ classes.iconItem }/>
                    <Typography align="center" color="textPrimary" variant="body2">
                        http://fb.com
                    </Typography>
                </Box>
                <Box className={ classes.boxItem } display="flex" justifyContent="center" alignItems="center">
                    <PermContactCalendarIcon className={ classes.iconItem }/>
                    <Typography align="center" color="textPrimary" variant="body2">
                        Joined, March 29
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                    <IconButton aria-label="delete">
                        <EditIcon />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    )
}

