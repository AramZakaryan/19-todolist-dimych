import {createAsyncThunk} from "@reduxjs/toolkit";
import {authAPI} from "api/todolists-api";
import {setIsLoggedInAC} from "features/Auth";

//////////// THUNKS

export const initializeAppTC = createAsyncThunk("app/initializeApp",
    async (_, {dispatch}) => {
        const res = await authAPI.me();
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}));
        }
        // return
        // dispatch(setAppInitializedAC({value: true}));
    })