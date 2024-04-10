import React, {useCallback, useEffect} from 'react'
import './App.css'
import {TodolistsList} from 'features/TodolistsList'
import {ErrorSnackbar} from 'components/ErrorSnackbar/ErrorSnackbar'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType, useAction} from './store'
import {RequestStatusType} from './app-reducer'
import {appActions} from "app"
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {authActions, Login} from 'features/Auth'
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from '@mui/material';
import {Menu} from '@mui/icons-material'
import {appSelectors} from "app"
import {authSelectors} from "features/Auth"

type PropsType = {
    demo?: boolean
}


function App({demo = false}: PropsType) {
    const status = useSelector<AppRootStateType, RequestStatusType>(appSelectors.selectStatus)
    const isInitialized = useSelector<AppRootStateType, boolean>(appSelectors.selectIsInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(authSelectors.selectIsLoggedIn)
    const dispatch = useDispatch<any>()

    const {
        /** ZA: initializeApp BoundAction based on initializeAppTC */
        initializeAppTC: initializeAppBoundAction
    } = useAction(appActions)

    useEffect(() => {
        initializeAppBoundAction()
        // dispatch(appAsyncActions.initializeAppTC())
    }, [])

    const logoutHandler = useCallback(() => {
        dispatch(authActions.logoutTC())
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <BrowserRouter>
            <div className="App">
                <ErrorSnackbar/>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            News
                        </Typography>
                        {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path={'/'} element={<TodolistsList demo={demo}/>}/>
                        <Route path={'/login'} element={<Login/>}/>
                    </Routes>
                </Container>
            </div>
        </BrowserRouter>
    )
}

export default App
