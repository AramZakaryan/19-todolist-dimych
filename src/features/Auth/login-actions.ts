import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatusAC} from "app/app-reducer";
import {authAPI, FieldErrorType, LoginParamsType} from "api/todolists-api";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {AxiosError} from "axios";

////////// THUNKS
export const loginTC = createAsyncThunk<
    undefined,
    LoginParamsType,
    {
        rejectValue: {
            errors: string[],
            fieldsErrors?: FieldErrorType[]
        }
    }
>("auth/login",
    async (data, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        try {
            const res = await authAPI.login(data);
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                return
                // thunkAPI.dispatch(setIsLoggedInAC({value: true}))
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
            }
        } catch (error) {
            handleServerNetworkError(error as AxiosError, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: [(error as AxiosError).message], fieldsErrors: undefined})
        }
    })

export const logoutTC = createAsyncThunk("auth/logout",
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        try {
            const res = await authAPI.logout();
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(clearTasksAndTodolists())
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                return
                // thunkAPI.dispatch(setIsLoggedInAC({isLoggedIn: false}))
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue({})
            }
        } catch (error) {
            handleServerNetworkError(error as AxiosError, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})

        }
    })