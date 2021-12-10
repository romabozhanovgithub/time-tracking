import { USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_LOGOUT, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL } from "./types";

const url = "http://localhost:8000/api/";

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST })

        const res = await fetch(`${url}users/login/`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                "username": email,
                "password": password
            })
        })
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail);
        }

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

        console.log(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}

export const logout = () => async (dispatch) => {
    localStorage.removeItem("userInfo");

    dispatch({ type: USER_LOGOUT })
}

export const register = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST })

        const res = await fetch(`${url}users/register/`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        })

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.detail);
        }

        dispatch({ type: USER_REGISTER_SUCCESS })
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}
