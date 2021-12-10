import { CALENDAR_LIST_REQUEST, CALENDAR_LIST_SUCCESS, CALENDAR_LIST_FAIL, CALENDAR_CREATE_REQUEST, CALENDAR_CREATE_SUCCESS, CALENDAR_CREATE_FAIL, CALENDAR_UPDATE_REQUEST, CALENDAR_UPDATE_SUCCESS, CALENDAR_UPDATE_FAIL, CALENDAR_DELETE_REQUEST, CALENDAR_DELETE_SUCCESS, CALENDAR_DELETE_FAIL } from "./types";

const url = "http://localhost:8000/api/";

export const listCalendar = (dateStart) => async (dispatch, getState) => {
    try {
        dispatch({ type: CALENDAR_LIST_REQUEST })

        const { user: { userInfo }, } = getState();

        const res = await fetch(`${url}calendars/?page=${dateStart}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        })
        const data = await res.json();
        console.log(data);

        if (!res.ok) {
            throw new Error(data.detail);
        }

        dispatch({
            type: CALENDAR_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: CALENDAR_LIST_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}

export const createCalendar = (calendar) => async (dispatch, getState) => {
    try {
        dispatch({ type: CALENDAR_CREATE_REQUEST })

        const { user: { userInfo }, } = getState();

        const res = await fetch(`${url}calendars/create/`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
            body: JSON.stringify(calendar)
        })
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail);
        }

        dispatch({
            type: CALENDAR_CREATE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: CALENDAR_CREATE_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}

export const updateCalendar = (calendar) => async (dispatch, getState) => {
    try {
        dispatch({ type: CALENDAR_UPDATE_REQUEST })

        const { user: { userInfo }, } = getState();

        const res = await fetch(`${url}calendars/update/${calendar.id}/`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
            body: JSON.stringify(calendar)
        })
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail);
        }

        dispatch({
            type: CALENDAR_UPDATE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: CALENDAR_UPDATE_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}

export const deleteCalendar = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: CALENDAR_DELETE_REQUEST })

        const { user: { userInfo }, } = getState();

        const res = await fetch(`${url}calendars/delete/${id}/`, {
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
            type: CALENDAR_DELETE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: CALENDAR_DELETE_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}
