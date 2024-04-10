import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {AppRootStateType, useAction} from 'app/store'
import {TodolistDomainType} from './todolists-reducer'
import {Grid, Paper} from '@mui/material'
import {AddItemForm} from 'components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {Navigate} from 'react-router-dom'
import {selectIsLoggedIn} from "features/Auth";
import {TasksStateType} from "features/TodolistsList/tasks-reducer";
import {todolistsActions} from "features/TodolistsList";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(selectIsLoggedIn)


    const {
        /** ZA: addTodolist BoundAction based on addTodolistTC */
        addTodolistTC: addTodolistBoundAction,
        /** ZA: fetchTodolists BoundAction based on fetchTodolistsTC */
        fetchTodolistsTC: fetchTodolistsBoundAction,
    } = useAction(todolistsActions)

    const addItemHandler = async (title: string) => addTodolistBoundAction(title)


    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        fetchTodolistsBoundAction()
        // dispatch(fetchTodolistsTC())
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addItemHandler}/>
        </Grid>
        <Grid container spacing={3} style={{flexWrap: "nowrap", overflowX: "scroll"}}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <div style={{width: "300px"}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                demo={demo}
                            />
                        </div>
                    </Grid>
                })
            }
        </Grid>
    </>
}
