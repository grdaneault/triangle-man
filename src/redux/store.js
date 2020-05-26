import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import {applyMiddleware, createStore} from "redux";
import rootReducer from "./reducers";

const loggerMiddleware = createLogger()

export default createStore(rootReducer, applyMiddleware(thunkMiddleware, loggerMiddleware));
