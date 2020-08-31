import React, {createContext, useReducer, useState} from 'react';
import * as consts from './constants';

const initialState = {
    loading: false,
    authenticated: false,
    credentials: {},
    likes: [],
    notifications: []
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
    

    const [state, dispatch] = useReducer((state, action) => {
        switch(action.type) {
            case consts.SET_LOADING :
                return {
                    ...state,
                    loading: true
                }
                break;
            case consts.FETCH_USER:
                return {
                    ...action.payload.uData,
                    authenticated: true,
                }
                break;
            case consts.SET_AUTHENTICATED:
                return {
                    ...state,
                    authenticated: true
                }
                break;
            case consts.SET_UNAUTHENTICATED:
                return initialState;
                break;
            case consts.SET_USER: 
                return {
                    authenticated: true,
                    ...action.payload
                }
                break;
            case consts.LOG_OUT:
                return initialState;
                break;
            default:
                throw new Error("No action executed!")
        };
    }, initialState);
    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};
export { store, StateProvider };