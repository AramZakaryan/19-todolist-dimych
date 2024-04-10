import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loginTC, logoutTC} from "features/Auth/login-actions";

const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state,
                        action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loginTC.fulfilled, (state) => {
                // state.isLoggedIn = action.payload.isLoggedIn
                state.isLoggedIn = true
            })
            .addCase(logoutTC.fulfilled, (state) => {
                state.isLoggedIn = false
            })
    }
})

export const loginReducer = slice.reducer

export const setIsLoggedInAC = slice.actions.setIsLoggedInAC



