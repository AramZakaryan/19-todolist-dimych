import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer'
import {handleServerNetworkError} from '../../utils/error-utils'
import {AppThunk} from '../../app/store';
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "../../common/actions/common.actions";
import {AxiosError} from "axios";

// const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: "todolist",
    initialState: [] as TodolistDomainType[],
    reducers: {
        // removeTodolistAC(state,
        //                  action: PayloadAction<{ id: string }>) {
        //     const index = state.findIndex(el =>
        //         el.id === action.payload.id
        //     )
        //     if (index > -1) {
        //         state.splice(index, 1)
        //     }
        // },
        // addTodolistAC(state,
        //               action: PayloadAction<{ todolist: TodolistType }>) {
        //     state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        // },
        // changeTodolistTitleAC(state,
        //                       action: PayloadAction<{ id: string, title: string }>) {
        //     const index = state.findIndex(el =>
        //         el.id === action.payload.id
        //     )
        //     if (index > -1) {
        //         state[index].title = action.payload.title
        //     }
        // },
        changeTodolistFilterAC(state,
                               action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(el =>
                el.id === action.payload.id
            )
            if (index > -1) {
                state[index].filter = action.payload.filter
            }
        },
        changeTodolistEntityStatusAC(state,
                                     action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(el =>
                el.id === action.payload.id
            )
            if (index > -1) {
                state[index].entityStatus = action.payload.status
            }
        },
        // setTodolistsAC(state,
        //                action: PayloadAction<{ todolists: Array<TodolistType> }>) {
        //     return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        // },
        // clearTodolistsAC(){
        //     return []
        // }
    },
    extraReducers: builder => {
        builder
            .addCase(clearTasksAndTodolists, () => {
                return []
            })
            .addCase(fetchTodolistsTC.fulfilled, (state,
                                                  action) => {
                return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
            })
            .addCase(removeTodolistTC.fulfilled, (state,
                                                  action) => {
                const index = state.findIndex(el =>
                    el.id === action.payload.id
                )
                if (index > -1) {
                    state.splice(index, 1)
                }
            })
            .addCase(addTodolistTC.fulfilled, (state,
                                               action) => {
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
            })
            .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
                const index = state.findIndex(el =>
                    el.id === action.payload.id
                )
                if (index > -1) {
                    state[index].title = action.payload.title
                }
            })
    }
})

export const todolistsReducer = slice.reducer

export const {
    // removeTodolistAC,
    // addTodolistAC,
    // changeTodolistTitleAC,
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC,
    // setTodolistsAC,
    // clearTodolistsAC
} = slice.actions

// export const _todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
//     switch (action.type) {
//         case 'todolist/removeTodolistAC':
//             return state.filter(tl =>
//                 tl.id != action.payload.id)
//         case 'todolist/addTodolistAC':
//             return [
//                 {...action.payload.todolist, filter: 'all', entityStatus: 'idle'},
//                 ...state
//             ]
//         case 'todolist/changeTodolistTitleAC':
//             return state.map(tl =>
//                 tl.id === action.payload.id ? {...tl, title: action.payload.title} : tl)
//         case 'todolist/changeTodolistFilterAC':
//             return state.map(tl =>
//                 tl.id === action.payload.id ? {...tl, filter: action.payload.filter} : tl)
//         case 'todolist/changeTodolistEntityStatusAC':
//             return state.map(tl =>
//                 tl.id === action.payload.id ? {...tl, entityStatus: action.payload.status} : tl)
//         case 'todolist/setTodolistsAC':
//             return action.payload.todolists.map(tl =>
//                 ({...tl, filter: 'all', entityStatus: 'idle'}))
//         default:
//             return state
//     }
// }

// actions
// export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
// export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
// export const changeTodolistTitleAC = (id: string, title: string) => ({
//     type: 'CHANGE-TODOLIST-TITLE',
//     id,
//     title
// } as const)
// export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
//     type: 'CHANGE-TODOLIST-FILTER',
//     id,
//     filter
// } as const)
// export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => ({
//     type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, status
// } as const)
// export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)


////////// THUNKS

export const fetchTodolistsTC
    = createAsyncThunk("todolist/fetchTodolists",
    async (_, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        try {
            let res = await todolistsAPI.getTodolists();
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolists: res.data}
            // dispatch(setTodolistsAC({todolists: res.data}))
        } catch (error) {
            handleServerNetworkError(error as AxiosError, dispatch);
            return rejectWithValue({})
        }
    })
// export const _fetchTodolistsTC = (): AppThunk => {
//     return (dispatch: Dispatch) => {
//         dispatch(setAppStatusAC({status: 'loading'}))
//         todolistsAPI.getTodolists()
//             .then((res) => {
//                 dispatch(setTodolistsAC({todolists: res.data}))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             })
//             .catch(error => {
//                 handleServerNetworkError(error, dispatch);
//             })
//     }
// }

export const removeTodolistTC
    = createAsyncThunk("todolist/removeTodolist",
    async (todolistId: string, {dispatch}) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
        dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
        await todolistsAPI.deleteTodolist(todolistId);
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {id: todolistId}
    })
// export const _removeTodolistTC = (todolistId: string) => {
//     return (dispatch: Dispatch) => {
//         //изменим глобальный статус приложения, чтобы вверху полоса побежала
//         dispatch(setAppStatusAC({status: 'loading'}))
//         //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
//         dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
//         todolistsAPI.deleteTodolist(todolistId)
//             .then((res) => {
//                 dispatch(removeTodolistAC({id: todolistId}))
//                 //скажем глобально приложению, что асинхронная операция завершена
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             })
//     }
// }

export const addTodolistTC = createAsyncThunk("todolist/addTodolist",
    async (title: string, {dispatch}) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todolistsAPI.createTodolist(title);
        dispatch(setAppStatusAC({status: 'succeeded'}));
        return {todolist: res.data.data.item};
    })
// export const _addTodolistTC = (title: string) => {
//     return (dispatch: Dispatch) => {
//         dispatch(setAppStatusAC({status: 'loading'}))
//         todolistsAPI.createTodolist(title)
//             .then((res) => {
//                 dispatch(addTodolistAC({todolist: res.data.data.item}))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             })
//     }
// }

export const changeTodolistTitleTC
    = createAsyncThunk("todolist/changeTodolistTitle",
    async ({id, title}: { id: string, title: string }) => {
        const res = await todolistsAPI.updateTodolist(id, title);
        return {id, title};
    })
// export const _changeTodolistTitleTC = (id: string, title: string) => {
//     return (dispatch: Dispatch) => {
//         todolistsAPI.updateTodolist(id, title)
//             .then((res) => {
//                 dispatch(changeTodolistTitleAC({id, title}))
//             })
//     }
// }

// types
// export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
// export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
// export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
// type ActionsType =
//     | RemoveTodolistActionType
//     | AddTodolistActionType
//     | ReturnType<typeof changeTodolistTitleAC>
//     | ReturnType<typeof changeTodolistFilterAC>
//     | SetTodolistsActionType
//     | ReturnType<typeof changeTodolistEntityStatusAC>
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

