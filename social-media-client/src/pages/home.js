import React, { useContext } from 'react'
import Grid from '@material-ui/core/Grid';
import { CssBaseline } from '@material-ui/core';
import NavBar from '../components/navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import User from '../components/user';
import Screams from '../components/screams';
import ListUser from '../components/listUser';
import Skeleton from '@material-ui/lab/Skeleton';
import { store } from './../store/store'

 

export default function Home() {
    const [loading,setLoading] = useState(true)
    let [uData,setUData] = useState({})

    //const globalState = useContext(store)
    //console.log(globalState)
    //const { dispatch } = globalState;
    //dispatch({type:"aa"})

    const fetchData = React.useCallback(() => {
        axios.get("/screams")
        .then(data => {
            if( data.data ) {   
                setUData(udata => data.data)
                setLoading(false)
            }
        })
        .catch((error) => {
          console.log(error)
        })
    }, [])    
      
    useEffect(()=>{
        setLoading(true)
        fetchData();
        return () => true;
    },[])

    return (
        <Grid container >
            <CssBaseline/>
            <Grid item xs={12}>
                <NavBar/>
            </Grid>

            <Grid item sm={3} xs={12}>
                <User/>
            </Grid>
            <Grid item sm={6} xs={12}>
                { !loading ? 
                (
                    uData.length > 0 ? uData.map((item,index) => <Screams item={item} key ={ index }/> ) : ""
                )
                :
                (
                    <Grid style={{marginTop: "15px"}}>
                        <Skeleton style={{marginBottom: "15px",width:"100%"}} variant="rect" height={118} />
                        <Skeleton style={{marginBottom: "15px",width:"100%"}} variant="rect" height={118} />
                        <Skeleton style={{marginBottom: "15px",width:"100%"}} variant="rect" height={118} />
                        <Skeleton style={{marginBottom: "15px",width:"100%"}} variant="rect" height={118} />
                        <Skeleton style={{marginBottom: "15px",width:"100%"}} variant="rect" height={118} />
                    </Grid>
                )
                 }
            </Grid>
            <Grid item sm={3} xs={12}>
                <ListUser/>
            </Grid>
        </Grid>
    ) 
}
