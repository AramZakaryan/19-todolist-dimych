import {createSlice} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {addTaskTC, fetchTasksTC, removeTaskTC, updateTaskTC} from "features/TodolistsList/tasks-actions";
import {TaskPriorities, TaskStatuses, TaskType} from "api/todolists-api";
import {addTodolistTC, fetchTodolistsTC, removeTodolistTC} from "features/TodolistsList/todolists-actions";

// const initialState: TasksStateType = {}

const slice = createSlice({
    name: "task",
    initialState: {} as TasksStateType,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchTasksTC.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(addTodolistTC.fulfilled, (state, action) => {
                    state[action.payload.todolist.id] = []
                }
            )
            .addCase(removeTodolistTC.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = []
                })
            })
            .addCase(clearTasksAndTodolists, () => {
                return {}
            })
            .addCase(removeTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t =>
                    t.id === action.payload.taskId
                )
                if (index > -1) {
                    tasks.splice(index, 1)
                }
            })
            .addCase(addTaskTC.fulfilled, (state, action) => {
                if (action.payload) {
                    const tasks = state[action.payload.task.todoListId]
                    tasks.unshift(action.payload.task)
                }
            })
            .addCase(updateTaskTC.fulfilled, (state, action) => {
                if (action.payload) {
                    const tasks = state[action.payload.todolistId]
                    const index = tasks.findIndex(t =>
                        t.id === action.payload?.taskId
                    )
                    if (index > -1) {
                        tasks[index] = {...tasks[index], ...action.payload.model}
                    }
                }
            })
    }
})

export const tasksReducer = slice.reducer


////////// TYPES

export type TasksStateType = {
    [key: string]: Array<TaskType>
}
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}