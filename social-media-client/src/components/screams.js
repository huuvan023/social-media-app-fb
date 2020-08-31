import React from 'react'
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import Fab from '@material-ui/core/Fab';
import CommentIcon from '@material-ui/icons/Comment';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    themeProvider: {
        color: "red",
    },
    cmAndExpand: {
        color: "#1E9BE5",
    },
    cardContainer: {
        margin: theme.spacing(2,2),
        "&:hover": {
            backgroundColor: 'white'
          }
    },
    cardBody: {
        padding: theme.spacing(3,2,0,2),
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
    },
    boxItem: {
        padding: theme.spacing(1,1,0,1)
    }
}))

const theme = createMuiTheme({
    status: {
      danger: orange[500],
    },
});

export default function Screams(item) {
    let data = item.item;
    const classes = useStyles();
    dayjs.extend(relativeTime);
    let [like,setLike] = React.useState(false);

    return (
        
    <Card className={ classes.cardContainer }>
        
                    <CardContent className = { classes.cardBody } >
                        <Box alignItems="center" display="flex">
                            <Avatar alt="" className={ classes.avatar } src={data.userImage}/> 
                            <Grid>
                                <Typography variant="h5">{ data.userHandle }</Typography>
                                <Typography style={{ color:"#8e8b8b" }} variant="caption">{ dayjs(data.createAt).fromNow() }</Typography>
                            </Grid>
                        </Box>
                        <Box className={classes.bodyComponent}>
                            <Typography variant="body1">{ data.body }</Typography>
                        </Box>
                        <Box display="flex">
                            <Box className={ classes.boxItem } flexGrow={1}>
                                <ThemeProvider theme={theme}>
                                    <Fab aria-label="like" 
                                    variant="round" 
                                    size="small" 
                                    classes={{
                                        root: classes.themeProvider,
                                    }}
                                    onClick={ () => setLike(!like) }
                                    style={{backgroundColor:"transparent", boxShadow:"none"}} >
                                        { like ? 
                                        (
                                        <FavoriteIcon/>  
                                        )
                                        :
                                        (<FavoriteBorderIcon />)
                                        }
                                    </Fab>
                                </ThemeProvider>
                                Like
                            </Box>
                            <Box className={ classes.boxItem } flexGrow={2}>
                                <ThemeProvider theme={theme}>
                                    <Fab aria-label="like" 
                                    variant="round" 
                                    classes={{
                                        root: classes.cmAndExpand,
                                    }} 
                                    size="small" 
                                    style={{backgroundColor:"transparent", boxShadow:"none"}} >
                                        <CommentIcon style={{color:"#1E9BE5"}}/>
                                    </Fab>
                                </ThemeProvider>
                                Comments
                            </Box>
                            <Box className={ classes.boxItem }>
                                <ThemeProvider theme={theme}>
                                    <Fab aria-label="like" 
                                    variant="round"
                                    classes={{
                                        root: classes.cmAndExpand,
                                    }} 
                                    size="small" 
                                    style={{backgroundColor:"transparent", boxShadow:"none"}} >
                                        <UnfoldMoreIcon style={{color:"#1E9BE5"}}/>
                                    </Fab>
                                </ThemeProvider>
                            </Box>
                        </Box>
                    </CardContent>
            
        
    </Card>
    )
}
