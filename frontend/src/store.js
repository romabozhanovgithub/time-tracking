import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { userReducer} from "./reducers/userReducers";
import { trackReducer } from "./reducers/timeTrackerReducers";
import { calendarReducer } from "./reducers/calendarReducers";
import { taskReducer } from "./reducers/taskReducers";

const reducer = combineReducers({
    user: userReducer,
    track: trackReducer,
    task: taskReducer,
    calendar: calendarReducer,
})

const userInfoFromStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null

const initialState = {
    user: { userInfo: userInfoFromStorage }
}

const middleware = [thunk]

const store = createStore(reducer, initialState, applyMiddleware(...middleware))

export default store
