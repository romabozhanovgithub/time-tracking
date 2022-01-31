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
} from "./types";

const url = "http://localhost:8000/api/";

export const listTasks = () => async (dispatch, getState) => {
    try {
        dispatch({ type: TASK_LIST_REQUEST })

        const { user: { userInfo }, } = getState();

        const res = await fetch(`${url}tasks`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        })
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail);
        }

        dispatch({
            type: TASK_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: TASK_LIST_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}

export const detailsTask = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: TASK_DETAILS_REQUEST })

        const { user: { userInfo }, } = getState();

        const res = await fetch(`${url}tasks/${id}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        })
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail);
        }

        dispatch({
            type: TASK_DETAILS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: TASK_DETAILS_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}

export const createTask = (task) => async (dispatch, getState) => {
    try {
        dispatch({ type: TASK_CREATE_REQUEST })

        const { user: { userInfo }, } = getState();

        const res = await fetch(`${url}tasks/create/`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
            body: JSON.stringify(task)
        })
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail);
        }

        dispatch({
            type: TASK_CREATE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: TASK_CREATE_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}

export const updateTask = (task) => async (dispatch, getState) => {
    try {
        dispatch({ type: TASK_UPDATE_REQUEST })

        const { user: { userInfo }, } = getState();

        const res = await fetch(`${url}tasks/update/${task.id}/`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
            body: JSON.stringify(task)
        })
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail);
        }

        dispatch({
            type: TASK_UPDATE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: TASK_UPDATE_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}

export const deleteTask = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: TASK_DELETE_REQUEST })

        const { user: { userInfo }, } = getState();

        const res = await fetch(`${url}tasks/delete/${id}/`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        })
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail);
        }

        dispatch({
            type: TASK_DELETE_SUCCESS,
            payload: id
        })
    } catch (error) {
        dispatch({
            type: TASK_DELETE_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}
