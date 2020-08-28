import React from 'react'
import Grid from '@material-ui/core/Grid';
import { CssBaseline, makeStyles } from '@material-ui/core';
import NavBar from '../components/navbar';
import { useEffect, useState } from 'react';
import axios from 'axios'
import User from '../components/user';
import Screams from '../components/screams';


export default function Home() {
    const [loading,setLoading] = useState(true)
    let [uData,setUData] = useState({})
    let url = "https://europe-west1-social-media-app-b41d2.cloudfunctions.net/api/screams";

    const fetchData = React.useCallback(() => {
        axios({
            method: "get",
            url: url,

        })
        .then(data => {
            if( data.data ) {   
                setUData(udata => data.data)
                setLoading(false)
            }
        })
        .catch((error) => {
          console.log(error)
        })
    }, [url])    
      
    useEffect(()=>{

        fetchData();
        return () => true;
    },[])

    return false ? (<div>loading</div>)
    :
    (
        <Grid container >
            <CssBaseline/>
            <Grid item xs={12}>
                <NavBar/>
            </Grid>

            <Grid item sm={3} xs={12}>
                <User/>
            </Grid>
            <Grid item sm={6} xs={12}>
                { uData.length > 0 ? uData.map((item,index) => <Screams item={item} key ={ index }/> ) : "" }
            </Grid>
            <Grid item sm={3} xs={12}>
                <p>Profile..    </p>
            </Grid>
        </Grid>
    ) 
}
