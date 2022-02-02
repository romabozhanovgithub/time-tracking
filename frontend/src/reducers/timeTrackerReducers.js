import {
    TRACK_LIST_REQUEST,
    TRACK_LIST_SUCCESS,
    TRACK_LIST_FAIL,
    TRACK_CREATE_REQUEST,
    TRACK_CREATE_SUCCESS,
    TRACK_CREATE_FAIL,
    TRACK_ADD_CREATE_REQUEST,
    TRACK_ADD_CREATE_SUCCESS,
    TRACK_ADD_CREATE_FAIL,
    TRACK_UPDATE_REQUEST,
    TRACK_UPDATE_SUCCESS,
    TRACK_UPDATE_FAIL,
    TRACK_DELETE_REQUEST,
    TRACK_DELETE_SUCCESS,
    TRACK_DELETE_FAIL
} from "../actions/types";

export const trackReducer = (state = {}, action) => {
    switch (action.type) {
        case TRACK_LIST_REQUEST:
            return { ...state, loading: true }
        case TRACK_LIST_SUCCESS:
            const listTracks = action.payload.length ? (
                action.payload.reduce((previous, current) => new Date(previous[0].time_start).toLocaleDateString() !== new Date(current.time_start).toLocaleDateString() ? (
                    previous[1].push(
                        { 
                            date: current.time_start, 
                            tracks: action.payload.filter(
                                track => new Date(track.time_start).toLocaleDateString() === new Date(current.time_start).toLocaleDateString()
                            ), 
                            totalTime: action.payload.filter(
                                track => new Date(track.time_start).toLocaleDateString() === new Date(current.time_start).toLocaleDateString()
                            ).reduce(
                                (previousTrack, currentTrack) => previousTrack +  (
                                    (new Date(currentTrack.time_end).getTime() / 1000) - (new Date(currentTrack.time_start).getTime() / 1000)
                                ), 0
                            ) 
                        }
                    ), [current, previous[1]]
                ) : (
                    previous
                ), 
                [
                    action.payload[0], 
                    [
                        { 
                            date: action.payload[0].time_start, 
                            tracks: action.payload.filter(
                                track => new Date(track.time_start).toLocaleDateString() === new Date(action.payload[0].time_start).toLocaleDateString()
                            ), 
                            totalTime: action.payload.filter(
                                track => new Date(track.time_start).toLocaleDateString() === new Date(action.payload[0].time_start).toLocaleDateString()
                            ).reduce(
                                (previousTrack, currentTrack) => previousTrack +  (
                                    (new Date(currentTrack.time_end).getTime() / 1000) - (new Date(currentTrack.time_start).getTime() / 1000)
                                ), 0
                            ) 
                        }
                    ]
                ])[1]
            ) : (
                action.payload
            )
            return { ...state, loading: false, tracks: listTracks, tracksList: action.payload }
        case TRACK_LIST_FAIL:
            return { ...state, loading: false, error: action.payload }
        case TRACK_CREATE_REQUEST:
            return { ...state, loadingCreate: true }
        case TRACK_CREATE_SUCCESS:
            const listTracksCreate = state.tracks.length ? (
                state.tracks.filter(day => new Date(day.date).toLocaleDateString() === new Date().toLocaleDateString()).length ? (
                    [
                        ...state.tracks.map(
                            day => new Date(day.date).toLocaleDateString() === new Date().toLocaleDateString() ? 
                                (
                                    { 
                                        date: day.date, 
                                        tracks: [action.payload, ...day.tracks], 
                                        totalTime: day.totalTime 
                                    }
                                ) 
                                : 
                                (
                                    day
                            )
                        )
                    ]
                ) : (
                    [
                        { 
                            date: new Date(), 
                            tracks: [action.payload], 
                            totalTime: 0
                        },
                        ...state.tracks
                    ]
                )
            ) : (
                [
                    { 
                        date: new Date(), 
                        tracks: [action.payload], 
                        totalTime: 0 
                    }
                ]
            )
            return { ...state, loadingCreate: false, successCreate: true, tracks: listTracksCreate }
        case TRACK_CREATE_FAIL:
            return { ...state, loadingCreate: false, errorCreate: action.payload }
        case TRACK_ADD_CREATE_REQUEST:
            return { ...state, loadingCreate: true }
        case TRACK_ADD_CREATE_SUCCESS:
            return { ...state, loadingCreate: false, successCreate: true, tracks: [
                ...state.tracks.map(
                    day => new Date(day.date).toLocaleDateString() === (new Date(action.payload.time_start).toLocaleDateString()) ? (
                        (day.tracks = [...day.tracks, action.payload]
                    ), day) : day
                )
            ] }
        case TRACK_ADD_CREATE_FAIL:
            return { ...state, loadingCreate: false, errorCreate: action.payload }
        case TRACK_UPDATE_REQUEST:
            return { ...state, loadingUpdate: true }
        case TRACK_UPDATE_SUCCESS:
            const listTracksUpdate = state.tracks.filter(day => new Date(day.date).toLocaleDateString() === new Date(action.payload.time_start).toLocaleDateString()).length ? (
                [
                    ...state.tracks.map(
                        day => new Date(day.date).toLocaleDateString() === new Date(action.payload.time_start).toLocaleDateString() ? (
                            day.tracks.filter(track => track.id === action.payload.id).length ? (
                                { 
                                    date: day.date, 
                                    tracks: [...day.tracks.map(track => track.id === action.payload.id ? action.payload : track)].sort(
                                        (trackPrevios, trackCurrent) => new Date(trackCurrent.time_start).getTime() - new Date(trackPrevios.time_start).getTime()
                                    ), 
                                    totalTime: [
                                        ...day.tracks.map(track => track.id === action.payload.id ? action.payload : track)
                                    ].reduce(
                                        (previousTrack, currentTrack) => previousTrack +  (
                                            (new Date(currentTrack.time_end).getTime() / 1000) - (new Date(currentTrack.time_start).getTime() / 1000)
                                        ), 0
                                    ) 
                                }
                            ) : (
                                day.tracks.push(action.payload),
                                { 
                                    date: day.date, 
                                    tracks: day.tracks.sort(
                                        (trackPrevios, trackCurrent) => new Date(trackCurrent.time_start).getTime() - new Date(trackPrevios.time_start).getTime()
                                    ), 
                                    totalTime: day.tracks.reduce(
                                        (previousTrack, currentTrack) => previousTrack +  (
                                            (new Date(currentTrack.time_end).getTime() / 1000) - (new Date(currentTrack.time_start).getTime() / 1000)
                                        ), 0
                                    ) 
                                }
                            )
                        ) : (
                            day.tracks.filter(
                                track => track.id === action.payload.id
                            ).length ? (
                                {
                                    date: day.date, 
                                    tracks: day.tracks.filter(track => track.id !== action.payload.id),
                                    totalTime: day.tracks.filter(track => track.id !== action.payload.id).reduce(
                                        (previousTrack, currentTrack) => previousTrack +  (
                                            (new Date(currentTrack.time_end).getTime() / 1000) - (new Date(currentTrack.time_start).getTime() / 1000)
                                        ), 0
                                    )
                                }
                            ) : (
                                day
                            )
                        )
                    )
                ].filter(day => day.tracks.length)
            ) : (
                [
                    ...state.tracks.map(day => day.tracks.filter(
                        track => track.id === action.payload.id
                    ).length ? (
                        {
                            date: day.date, 
                            tracks: day.tracks.filter(track => track.id !== action.payload.id),
                            totalTime: day.tracks.filter(track => track.id !== action.payload.id).reduce(
                                (previousTrack, currentTrack) => previousTrack +  (
                                    (new Date(currentTrack.time_end).getTime() / 1000) - (new Date(currentTrack.time_start).getTime() / 1000)
                                ), 0
                            )
                        }
                    ) : (
                        day
                    )),
                    { 
                        date: new Date(action.payload.time_start), 
                        tracks: [action.payload], 
                        totalTime: ((new Date(action.payload.time_end).getTime() / 1000) - (new Date(action.payload.time_start).getTime() / 1000))
                    }
                ].sort((dayPrevios, dayCurrent) => new Date(dayCurrent.date).getTime() - new Date(dayPrevios.date).getTime()).filter(day => day.tracks.length)
            )
            return { ...state, loadingUpdate: false, successUpdate: true, tracks: listTracksUpdate }
        case TRACK_UPDATE_FAIL:
            return { ...state, loadingUpdate: false, errorUpdate: action.payload }
        case TRACK_DELETE_REQUEST:
            return { ...state, loadingDelete: true }
        case TRACK_DELETE_SUCCESS:
            const tracksDelete = [...state.tracks.map(
                    day => (
                        {
                            date: day.date, 
                            tracks: day.tracks.filter(track => track.id !== action.payload),
                            totalTime: day.tracks.filter(track => track.id !== action.payload).reduce(
                                (previousTrack, currentTrack) => previousTrack +  (
                                    (new Date(currentTrack.time_end).getTime() / 1000) - (new Date(currentTrack.time_start).getTime() / 1000)
                                ), 0
                            )
                        }
                    )
                )
            ].filter(day => day.tracks.length)
            return { ...state, loadingDelete: false, successDelete: true, tracks: tracksDelete }
        case TRACK_DELETE_FAIL:
            return { ...state, loadingDelete: false, errorDelete: action.payload }
        default:
            return state
    }
}
