import {TodolistType} from 'api/todolists-api'
import {RequestStatusType} from 'app/app-reducer'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {
    addTodolistTC,
    changeTodolistTitleTC,
    fetchTodolistsTC,
    removeTodolistTC
} from "features/TodolistsList/todolists-actions";

const slice = createSlice({
    name: "todolist",
    initialState: [] as TodolistDomainType[],
    reducers: {
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
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC,
} = slice.actions

////////// THUNKS

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

