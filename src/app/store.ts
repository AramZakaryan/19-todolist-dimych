import {tasksReducer} from 'features/TodolistsList/tasks-reducer';
import {todolistsReducer} from 'features/TodolistsList/todolists-reducer';
import {ActionCreatorsMapObject, bindActionCreators, combineReducers} from 'redux'
import {thunk as thunkMiddleware, ThunkAction} from 'redux-thunk'
import {appReducer} from './app-reducer'
import {loginReducer} from 'features/Auth'
import {configureStore, UnknownAction} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {useMemo} from "react";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: loginReducer
})

// ❗старая запись, с новыми версиями не работает
//  const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(thunkMiddleware)
},)

export type AppRootStateType = ReturnType<typeof rootReducer>

// ❗ UnknownAction вместо AnyAction
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>

// export type AppDispatch = typeof store.dispatch
// ❗ UnknownAction вместо AnyAction
export type AppDispatch = typeof store.dispatch

export function useAction<T extends ActionCreatorsMapObject<any>>(actions: T) {
    const dispatch = useDispatch()

    const boundActions = useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [])

    return boundActions
}
