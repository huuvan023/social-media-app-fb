import React from 'react'
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid';
import { useEffect } from 'react';
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
    cardContainer: {
        margin: theme.spacing(2,1),
        "&:hover": {
            backgroundColor: 'white'
          }
    },
    cardBody: {
        padding: theme.spacing(0,2),
        backgroundColor: "white",
        "&:hover": {
            //you want this to be the same as the backgroundColor above
            backgroundColor: "white",
        }
    },
    avatar: {
        marginRight: theme.spacing(2)
    },
    bodyComponent: {
        marginTop: theme.spacing(1)
    }
}))
export default function Screams(item) {
    let data = item.item;
    const classes = useStyles();
    const uData = {};
    //data.userImage
    return (
        
    <Card className={ classes.cardContainer }>
        <CardActionArea disableRipple className= { classes.cardBody } >

                    <CardContent>
                        <Box alignItems="center" display="flex">
                            <Avatar alt="" className={ classes.avatar } src={data.userImage}/> 
                            <Grid>
                                <Typography variant="h5">{ data.userHandle }</Typography>
                                <Typography style={{ color:"#8e8b8b" }} variant="caption">15 hours ago</Typography>
                            </Grid>
                        </Box>
                        <Box className={classes.bodyComponent}>
                            <Typography variant="body1">{ data.body }</Typography>
                        </Box>
                    </CardContent>
                
            
        </CardActionArea>
        
    </Card>
    )
}
