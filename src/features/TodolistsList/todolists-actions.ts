import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatusAC} from "app/app-reducer";
import {todolistsAPI} from "api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {AxiosError} from "axios";
import {changeTodolistEntityStatusAC} from "features/TodolistsList/todolists-reducer";

export const fetchTodolistsTC
    = createAsyncThunk("todolist/fetchTodolists",
    async (_, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        try {
            let res = await todolistsAPI.getTodolists();
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolists: res.data}
        } catch (error) {
            handleServerNetworkError(error as AxiosError, dispatch);
            return rejectWithValue({})
        }
    })
export const removeTodolistTC
    = createAsyncThunk("todolist/removeTodolist",
    async (todolistId: string, {dispatch}) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
        await todolistsAPI.deleteTodolist(todolistId);
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {id: todolistId}
    })
export const addTodolistTC = createAsyncThunk("todolist/addTodolist",
    async (title: string, {dispatch, rejectWithValue}) => {
        try {
            dispatch(setAppStatusAC({status: 'loading'}))
            const res = await todolistsAPI.createTodolist(title);
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: 'succeeded'}));
                return {todolist: res.data.data.item};
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null)
            }
        } catch (error) {
            handleServerNetworkError(error as AxiosError, dispatch);
            return rejectWithValue(null)
        }
    })

export const changeTodolistTitleTC
    = createAsyncThunk("todolist/changeTodolistTitle",
    async ({id, title}: { id: string, title: string }) => {
        const res = await todolistsAPI.updateTodolist(id, title);
        return {id, title};
    })