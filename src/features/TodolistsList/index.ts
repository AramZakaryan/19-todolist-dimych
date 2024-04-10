import * as tasksActions from './tasks-actions'
import * as todolistsAsyncActions from "./todolists-actions"
import {changeTodolistFilterAC, changeTodolistEntityStatusAC} from "./todolists-reducer"

const todolistsActions = {
    ...todolistsAsyncActions,
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC
}

export {
    tasksActions,
    todolistsActions
}

export {TodolistsList} from "./TodolistsList"
