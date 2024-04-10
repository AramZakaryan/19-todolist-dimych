import React, {ChangeEvent, useCallback} from 'react'
import {Checkbox, IconButton} from '@mui/material'
import {EditableSpan} from 'components/EditableSpan/EditableSpan'
import {Delete} from '@mui/icons-material'
import {TaskStatuses, TaskType} from 'api/todolists-api'
import {UpdateDomainTaskModelType} from "features/TodolistsList/tasks-reducer";
import {useAction} from "app/store";
import {tasksActions} from "features/TodolistsList/index";

type TaskPropsType = {
    task: TaskType
    todolistId: string
}
export const Task = React.memo((props: TaskPropsType) => {

    const {
        /** ZA: updateTask BoundAction based on updateTaskTC */
        updateTaskTC: updateTaskBoundAction,
        /** ZA: removeTask BoundAction based on removeTaskTC */
        removeTaskTC: removeTaskBoundAction,
    } = useAction(tasksActions)

    const onClickHandler = () => removeTaskBoundAction({
        taskId: props.task.id,
        todolistId: props.todolistId
    })

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        updateTaskBoundAction({
            taskId: props.task.id, model:
                {
                    status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
                }
            ,
            todolistId: props.todolistId
        })
    }

    const onTitleChangeHandler = (newValue: string) => {
        updateTaskBoundAction({taskId: props.task.id, model: {title: newValue}, todolistId: props.todolistId})
    }
    return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''} style={{position:"relative"}}>
        <Checkbox
            checked={props.task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeHandler}
        />

        <EditableSpan value={props.task.title} onChange={onTitleChangeHandler}/>
        <IconButton onClick={onClickHandler} style={{position: "absolute",right:"5px"}}>
            <Delete fontSize={"small"}/>
        </IconButton>
    </div>
})
