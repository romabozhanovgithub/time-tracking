import {
    TASK_LIST_REQUEST,
    TASK_LIST_SUCCESS,
    TASK_LIST_FAIL,
    TASK_DETAILS_REQUEST,
    TASK_DETAILS_SUCCESS,
    TASK_DETAILS_FAIL,
    TASK_CREATE_REQUEST,
    TASK_CREATE_SUCCESS,
    TASK_CREATE_FAIL,
    TASK_UPDATE_REQUEST,
    TASK_UPDATE_SUCCESS,
    TASK_UPDATE_FAIL,
    TASK_DELETE_REQUEST,
    TASK_DELETE_SUCCESS,
    TASK_DELETE_FAIL
} from "../actions/types";

export const taskReducer = (state = {}, action) => {
    switch (action.type) {
        case TASK_LIST_REQUEST:
            return { ...state, loading: true }
        case TASK_LIST_SUCCESS:
            return { ...state, loading: false, tasks: action.payload }
        case TASK_LIST_FAIL:
            return { ...state, loading: false, error: action.payload }
        case TASK_DETAILS_REQUEST:
            return { ...state, loading: true }
        case TASK_DETAILS_SUCCESS:
            return { ...state, loading: false, task: action.payload }
        case TASK_DETAILS_FAIL:
            return { ...state, loading: false, error: action.payload }
        case TASK_CREATE_REQUEST:
            return { ...state, loadingCreate: true }
        case TASK_CREATE_SUCCESS:
            return { ...state, loadingCreate: false, successCreate: true, tasks: [...state.tasks, action.payload] }
        case TASK_CREATE_FAIL:
            return { ...state, loadingCreate: false, errorCreate: action.payload }
        case TASK_UPDATE_REQUEST:
            return { ...state, loadingUpdate: true }
        case TASK_UPDATE_SUCCESS:
            return { ...state, loadingUpdate: false, successUpdate: true, tasks: [...state.tasks.map(task => task.id === action.payload.id ? action.payload : task )] }
        case TASK_UPDATE_FAIL:
            return { ...state, loadingUpdate: false, errorUpdate: action.payload }
        case TASK_DELETE_REQUEST:
            return { ...state, loadingDelete: true }
        case TASK_DELETE_SUCCESS:
            return { ...state, loadingDelete: false, successDelete: true, tasks: [...state.tasks.filter(task => task.id !== action.payload)] }
        case TASK_DELETE_FAIL:
            return { ...state, loadingDelete: false, errorDelete: action.payload }
        default:
            return state
    }
}
