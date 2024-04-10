import * as appAsyncActions from "./app-actions"
import {setAppErrorAC, setAppStatusAC} from "./app-reducer"

const appActions = {...appAsyncActions, setAppErrorAC, setAppStatusAC}

export {appActions}

export * as appSelectors from "./app-selectors"
