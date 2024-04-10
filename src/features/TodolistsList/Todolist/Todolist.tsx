import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from 'components/AddItemForm/AddItemForm'
import {EditableSpan} from 'components/EditableSpan/EditableSpan'
import {Task} from './Task/Task'
import {TaskStatuses, TaskType} from 'api/todolists-api'
import {FilterValuesType, TodolistDomainType} from '../todolists-reducer'
import {useAppDispatch} from 'hooks/useAppDispatch';
import {Button, IconButton, Paper} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {fetchTasksTC} from "features/TodolistsList/tasks-actions";
import {UpdateDomainTaskModelType} from "features/TodolistsList/tasks-reducer";
import {useAction} from "app/store";
import {tasksActions, todolistsActions} from "features/TodolistsList";
import {OverridableStringUnion} from "@mui/types";
import {ButtonPropsColorOverrides} from "@mui/material/Button/Button";

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    // changeFilter: (params: { filter: FilterValuesType, id: string }) => void
    // addTask: (params: { title: string, todolistId: string }) => void
    // changeTaskStatus: (params: { taskId: string, model: UpdateDomainTaskModelType, todolistId: string }) => void
    // changeTaskTitle: (params: { taskId: string, model: UpdateDomainTaskModelType, todolistId: string }) => void
    // removeTask: (params: { taskId: string, todolistId: string }) => void
    // removeTodolist: (id: string) => void
    // changeTodolistTitle: (params: { id: string, title: string }) => void
    demo?: boolean
}

export const Todolist = React.memo(function ({demo = false, ...props}: PropsType) {

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo) {
            return
        }
        dispatch(fetchTasksTC(props.todolist.id))
    }, [])


    const {
        /** ZA: addTask BoundAction based on addTaskTC */
        addTaskTC: addTaskBoundAction,
    } = useAction(tasksActions)

    const {
        /** ZA: removeTodolist BoundAction based on removeTodolistTC */
        removeTodolistTC: removeTodolistBoundAction,
        /** ZA: changeTodolistTitle BoundAction based on changeTodolistTitleTC */
        changeTodolistTitleTC: changeTodolistTitleBoundAction,
        /** ZA: changeTodolistFilter BoundAction based on changeTodolistFilterAC */
        changeTodolistFilterAC: changeTodolistFilterBoundAction,
    } = useAction(todolistsActions)

    const addTask = useCallback(async (title: string) => {
        addTaskBoundAction({title, todolistId: props.todolist.id})
    }, [addTaskBoundAction, props.todolist.id])

    const removeTodolist = () => {
        removeTodolistBoundAction(props.todolist.id)
    }
    const changeTodolistTitle = useCallback((title: string) => {
        changeTodolistTitleBoundAction({id: props.todolist.id, title: title})
    }, [props.todolist.id, changeTodolistTitleBoundAction])

    let tasksForTodolist = props.tasks


    if (props.todolist.filter === 'active') {

        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    const onFilterButtonClickHandler = (filter: FilterValuesType) => changeTodolistFilterBoundAction({
        filter,
        id: props.todolist.id
    })

    const color: FilterButtonColorType = "inherit"
    const renderFilterButton = (buttonFilter: FilterValuesType) => {
        return (
            <Button variant={props.todolist.filter === buttonFilter ? 'outlined' : 'text'}
                    onClick={() => onFilterButtonClickHandler(buttonFilter)}
                    color={color}
            >{buttonFilter}
            </Button>
        )
    }

    return <Paper style={{position: "relative", padding: "5px"}}>
        <IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === 'loading'}
                    style={{position: "absolute", right: "5px", top: "5px"}}
        >
            <Delete/>
        </IconButton>
        <h3><EditableSpan value={props.todolist.title} onChange={changeTodolistTitle}/>
        </h3>
        <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t =>
                    <Task key={t.id} task={t} todolistId={props.todolist.id}/>)
            }
            {!tasksForTodolist.length && <div style={{padding: "10px", color: "grey"}}>"no task"</div>}
        </div>
        <div style={{paddingTop: '10px'}}>
            {renderFilterButton("all")}
            {renderFilterButton("active")}
            {renderFilterButton("completed")}
        </div>
    </Paper>
})

type FilterButtonColorType = OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    ButtonPropsColorOverrides
>