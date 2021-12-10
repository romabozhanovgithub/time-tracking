import { CALENDAR_LIST_REQUEST, CALENDAR_LIST_SUCCESS, CALENDAR_LIST_FAIL, CALENDAR_CREATE_REQUEST, CALENDAR_CREATE_SUCCESS, CALENDAR_CREATE_FAIL, CALENDAR_UPDATE_REQUEST, CALENDAR_UPDATE_SUCCESS, CALENDAR_UPDATE_FAIL, CALENDAR_DELETE_REQUEST, CALENDAR_DELETE_SUCCESS, CALENDAR_DELETE_FAIL } from "../actions/types";

export const calendarReducer = (state = {}, action) => {
    switch (action.type) {
        case CALENDAR_LIST_REQUEST:
            return { ...state, loading: true }
        case CALENDAR_LIST_SUCCESS:
            return { ...state, loading: false, calendars: action.payload }
        case CALENDAR_LIST_FAIL:
            return { ...state, loading: false, error: action.payload }
        case CALENDAR_CREATE_REQUEST:
            return { ...state, loadingCreate: true }
        case CALENDAR_CREATE_SUCCESS:
            const calendarCreateList = [...state.calendars, action.payload].sort((calendarPrevios, calendarCurrent) => new Date(calendarCurrent.time_start).getTime() - new Date(calendarPrevios.time_start).getTime())
            return { ...state, loadingCreate: false, successCreate: true, calendars: calendarCreateList }
        case CALENDAR_CREATE_FAIL:
            return { ...state, loadingCreate: false, errorCreate: action.payload }
        case CALENDAR_UPDATE_REQUEST:
            return { ...state, loadingUpdate: true }
        case CALENDAR_UPDATE_SUCCESS:
            const calendarUpdateList = [...state.calendars.map(calendar => calendar.id == action.payload.id ? action.payload : calendar)].sort((calendarPrevios, calendarCurrent) => new Date(calendarCurrent.time_start).getTime() - new Date(calendarPrevios.time_start).getTime())
            return { ...state, loadingUpdate: false, successUpdate: true, calendars: calendarUpdateList }
        case CALENDAR_UPDATE_FAIL:
            return { ...state, loadingUpdate: false, errorUpdate: action.payload }
        case CALENDAR_DELETE_REQUEST:
            return { ...state, loadingDelete: true }
        case CALENDAR_DELETE_SUCCESS:
            return { ...state, loadingDelete: false, successDelete: true, calendars: [...state.calendars.filter(calendar => calendar.id != action.payload)] }
        case CALENDAR_DELETE_FAIL:
            return { ...state, loadingDelete: false, errorDelete: action.payload }
        default:
            return state
    }
}
