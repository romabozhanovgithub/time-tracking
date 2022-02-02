import {
    TRACK_LIST_REQUEST,
    TRACK_LIST_SUCCESS,
    TRACK_LIST_FAIL,
    TRACK_CREATE_REQUEST,
    TRACK_CREATE_SUCCESS,
    TRACK_CREATE_FAIL,
    TRACK_UPDATE_REQUEST,
    TRACK_UPDATE_SUCCESS,
    TRACK_UPDATE_FAIL,
    TRACK_DELETE_REQUEST,
    TRACK_DELETE_SUCCESS,
    TRACK_DELETE_FAIL
} from "./types";

const url = "http://localhost:8000/api/";

export const listTracks = (page) => async (dispatch, getState) => {
    try {
        dispatch({ type: TRACK_LIST_REQUEST })

        const { user: { userInfo }, } = getState();

        const res = await fetch(`${url}tracks/?page=${page}`, {
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
            type: TRACK_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: TRACK_LIST_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}

export const createTrack = (track) => async (dispatch, getState) => {
    console.log(track)
    try {
        dispatch({ type: TRACK_CREATE_REQUEST })

        const { user: { userInfo }, } = getState();

        const res = await fetch(`${url}tracks/create/`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
            body: JSON.stringify(track)
        })
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail);
        }

        dispatch({
            type: TRACK_CREATE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: TRACK_CREATE_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}

export const updateTrack = (track) => async (dispatch, getState) => {
    try {
        dispatch({ type: TRACK_UPDATE_REQUEST })

        const { user: { userInfo }, } = getState();

        const res = await fetch(`${url}tracks/update/${track.id}/`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
            body: JSON.stringify(track)
        })
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail);
        }

        dispatch({
            type: TRACK_UPDATE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: TRACK_UPDATE_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}

export const deleteTrack = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: TRACK_DELETE_REQUEST })

        const { user: { userInfo }, } = getState();

        const res = await fetch(`${url}tracks/delete/${id}/`, {
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
            type: TRACK_DELETE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: TRACK_DELETE_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}
