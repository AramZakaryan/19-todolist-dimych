import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {initializeAppTC} from "app/app-actions";

export const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}


const slice = createSlice({
    name: "app",
    initialState: {
        status: 'idle' as RequestStatusType,
        error: null as null | string,
        isInitialized: false
    },
    reducers: {
        setAppErrorAC(state,
                      action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        // setAppInitializedAC(state,
        //                     action: PayloadAction<{ value: boolean }>) {
        //     state.isInitialized = action.payload.value
        // },
        setAppStatusAC(state,
                       action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        }
    },
    extraReducers: builder => {
        builder
            .addCase(initializeAppTC.fulfilled, (state) => {
                state.isInitialized = true
            })
    }
})

export const appReducer = slice.reducer

export const {
    setAppErrorAC,
    setAppStatusAC,
    // setAppInitializedAC
} = slice.actions



export const appAsyncActions = {initializeAppTC}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>


