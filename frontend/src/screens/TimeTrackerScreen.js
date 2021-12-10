import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Button, InputGroup, FormControl, Dropdown } from "react-bootstrap";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import ListOutlinedIcon from "@material-ui/icons/ListOutlined";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import CustomToggle from "../components/CustomToggle";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listTracks, createTrack, updateTrack, deleteTrack } from "../actions/timeTrackerActions";
import { listTasks } from "../actions/taskActions";

const TimeTrackerScreen = ({ history }) => {
    const [trackName, setTrackName] = useState("");
    const [searchTask, setSearchTask] = useState("");
    const [related, setRelated] = useState(false);
    const [activeTrack, setActiveTrack] = useState(false);
    const [trackEdit, setTrackEdit] = useState(false);
    const [trackEditName, setTrackEditName] = useState(false);
    const [trackEditRelated, setTrackEditRelated] = useState(false);
    const [trackEditTimeStart, setTrackEditTimeStart] = useState(false);
    const [trackEditTimeEnd, setTrackEditTimeEnd] = useState(false);
    const [trackEditDate, setTrackEditDate] = useState(false);
    const [page, setPage] = useState(1);
    const [modeHeader, setModeHeader] = useState(1);
    const [trackButton, setTrackButton] = useState(true);
    const [clockInterval, setClockInterval] = useState();
    const [time, setTime] = useState(0);

    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.user)
    const { userInfo } = userLogin

    const trackState = useSelector(state => state.track)
    const {
        loading,
        error,
        tracks,
        trackCreated,
        loadingCreate,
        errorCreate,
        successCreate,
        loadingUpdate,
        errorUpdate,
        successUpdate
    } = trackState
    const taskState = useSelector(state => state.task)
    const {
        loading: loadingTask,
        error: errorTask,
        tasks
    } = taskState

    useEffect(() => {
        if (userInfo) {
            !(Object.prototype.toString.call(tracks) == "[object Array]") && dispatch(listTracks(page));
            !(Object.prototype.toString.call(tasks) == "[object Array]") && dispatch(listTasks());
        }
        else if (!userInfo) {
            history.push("/login?redirect=timetracker");
        }

        if (activeTrack) {
            setTime((new Date().getTime() / 1000) - (new Date(activeTrack.time_start).getTime() / 1000));
            clockHandler();
        }
        else if (!activeTrack) {
            setClockInterval(false);
        }

        document.getElementById("header-title") &&  (document.getElementById("header-title").innerText = "TIME TRACKER")
    }, [dispatch, tracks, activeTrack, page]);

    const setInputFocus = () => {
        document.getElementById("dropdown-input").focus();
    }

    const trackHandler = () => {
        if (!clockInterval) {
            dispatch(createTrack({
                title: trackName,
                timeStart: new Date(),
                related
            }));
        }
        else if (clockInterval) {
            dispatch(updateTrack({
                ...activeTrack,
                time_end: new Date()
            }));
            setTrackName("");
            setRelated(false);
            clockHandler();
        }
        console.log(tracks)
    }

    const clockHandler = () => {
        if (!clockInterval) {
            setClockInterval(setInterval(() => {
                setTime(time => time + 1);
            }, 1000));
        }
        else if (clockInterval) {
            clearInterval(clockInterval);
            setActiveTrack(false);
            setTime(0);
        }
    }

    const handleSelect = (eventKey, track) => {
        if (eventKey == "edit") {
            setTrackEdit(track);
            setTrackEditName(track.title);
            setTrackEditRelated(track.related);
            setTrackEditTimeStart(`${("0" + new Date(track.time_start).getHours()).slice(-2)}:${("0" + new Date(track.time_start).getMinutes()).slice(-2)}`);
            setTrackEditTimeEnd(`${("0" + new Date(track.time_end).getHours()).slice(-2)}:${("0" + new Date(track.time_end).getMinutes()).slice(-2)}`);
            setTrackEditDate(`${new Date(track.time_start).getFullYear()}-${("0" + (new Date(track.time_start).getMonth() + 1)).slice(-2)}-${("0" + new Date(track.time_start).getDate()).slice(-2)}`);
        }
        else if (eventKey == "delete") {
            dispatch(deleteTrack(track.id));
        }
    }

    const trackUpdateHandler = (track) => {
        console.log(Number(trackEditTimeStart.split(":")[1].slice(-2)))
        dispatch(updateTrack({
            ...track,
            title: trackEditName,
            time_start: (new Date((new Date(trackEditDate).setHours(Number(trackEditTimeStart.split(":")[0].slice(-2)), Number(trackEditTimeStart.split(":")[1].slice(-2)))))),
            time_end: ((new Date((new Date(trackEditDate).setHours(Number(trackEditTimeEnd.split(":")[0].slice(-2)), Number(trackEditTimeEnd.split(":")[1].slice(-2)))))).getTime() - (new Date((new Date(trackEditDate).setHours(Number(trackEditTimeStart.split(":")[0].slice(-2)), Number(trackEditTimeStart.split(":")[1].slice(-2)))))).getTime()) >= 0 ? (new Date((new Date(trackEditDate).setHours(Number(trackEditTimeEnd.split(":")[0].slice(-2)), Number(trackEditTimeEnd.split(":")[1].slice(-2)))))) : (new Date(new Date((new Date(trackEditDate).setHours(Number(trackEditTimeEnd.split(":")[0].slice(-2)), Number(trackEditTimeEnd.split(":")[1].slice(-2))))).setDate(new Date((new Date(trackEditDate).setHours(Number(trackEditTimeEnd.split(":")[0].slice(-2)), Number(trackEditTimeEnd.split(":")[1].slice(-2))))).getDate() + 1))),
            related: trackEditRelated
        }));
        setTrackEdit(false);
    }

    const trackStartHandler = (track) => {
        dispatch(createTrack({
            title: track.title,
            timeStart: new Date(),
            related: track.related
        }));
        setTrackName(track.title);
        setRelated(track.related);
    }

    return (
        <div>
            <ListGroup className="track-header">
                <ListGroup.Item>
                    {modeHeader == 1 ? (
                        <Row className="d-flex align-items-center">
                            <Col md={7} lg={8} xl={9}>
                                <InputGroup>
                                    <FormControl className="border-0 shadow-none" placeholder="What are you working on?" value={trackName} onChange={(e) => setTrackName(e.target.value)}/>
                                    <Dropdown focusFirstItemOnShow>
                                        <Dropdown.Toggle as={CustomToggle} id="track-header-input-dropdown-md">
                                            {
                                                related ? (
                                                    <span className="d-flex"><span className="track-task-color" style={{ color: related.task.color }}> &#9679;</span><span className="text-truncate track-task-title"> {related.task.title}</span></span>
                                                ) : (
                                                    <span><AddCircleOutlineIcon/> Task</span>
                                                )
                                            }
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="track-dropdown-body">
                                            <div className="track-dropdown-task-search">
                                                <Dropdown.Item className="dropdown-input" onFocus={setInputFocus}>
                                                    <InputGroup>
                                                        <FormControl className="border-0 shadow-none" id="dropdown-input" placeholder="Find task" value={searchTask} onChange={(e) => setSearchTask(e.target.value)}/>
                                                    </InputGroup>
                                                </Dropdown.Item>
                                            </div>
                                            {
                                                (Object.prototype.toString.call(tasks) == "[object Array]" && tasks.length) ? (
                                                    <div className="track-dropdown-tasks">
                                                        <Dropdown.Item onClick={() => setRelated(false)}>
                                                            <div className="d-flex align-items-center track-dropdown-task">
                                                                <span className="d-flex rounded-circle track-dropdown-task-color"></span>
                                                                <span className="text-truncate track-dropdown-task-title">No task</span>
                                                            </div>
                                                        </Dropdown.Item>
                                                        {
                                                            tasks.map(task => (
                                                                <Dropdown.Item key={task.id} onClick={() => setRelated({ task })}>
                                                                    <div className="d-flex align-items-center track-dropdown-task">
                                                                        <span className="d-flex rounded-circle track-dropdown-task-color" style={{ background: task.color }}></span>
                                                                        <span className="text-truncate track-dropdown-task-title">{task.title}</span>
                                                                    </div>
                                                                </Dropdown.Item>
                                                            ))
                                                        }
                                                    </div>
                                                ) : (
                                                    <Dropdown.Item disabled>
                                                        <span className="d-flex align-items-center justify-content-center text-muted">No tasks</span>
                                                    </Dropdown.Item>
                                                )
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </InputGroup>
                            </Col>
                            <Col md={5} lg={4} xl={3}>
                                <div className="d-flex justify-content-between justify-content-md-end">
                                    <Dropdown focusFirstItemOnShow className="d-none d-sm-block d-md-none">
                                        <Dropdown.Toggle as={CustomToggle} id="track-header-input-dropdown">
                                            {
                                                related ? (
                                                    <span className="d-flex"><span className="track-task-color" style={{ color: related.task.color }}> &#9679;</span><span className="text-truncate track-task-title"> {related.task.title}</span></span>
                                                ) : (
                                                    <span className="track-add-task"><AddCircleOutlineIcon/> Task</span>
                                                )
                                            }
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="track-dropdown-body">
                                            <div className="track-dropdown-task-search">
                                                <Dropdown.Item className="dropdown-input" onFocus={setInputFocus}>
                                                    <InputGroup>
                                                        <FormControl className="border-0 shadow-none" id="dropdown-input" placeholder="Find task" value={searchTask} onChange={(e) => setSearchTask(e.target.value)}/>
                                                    </InputGroup>
                                                </Dropdown.Item>
                                            </div>
                                            {
                                                (Object.prototype.toString.call(tasks) == "[object Array]" && tasks.length) ? (
                                                    <div className="track-dropdown-tasks">
                                                        {
                                                            tasks.map(task => (
                                                                <Dropdown.Item key={task.id} onClick={() => setRelated({ task })}>
                                                                    <div className="d-flex align-items-center track-dropdown-task">
                                                                        <span className="d-flex rounded-circle track-dropdown-task-color" style={{ background: task.color }}></span>
                                                                        <span className="text-truncate track-dropdown-task-title">{task.title}</span>
                                                                    </div>
                                                                </Dropdown.Item>
                                                            ))
                                                        }
                                                    </div>
                                                ) : (
                                                    <Dropdown.Item disabled>
                                                        <span className="d-flex align-items-center justify-content-center text-muted">No tasks</span>
                                                    </Dropdown.Item>
                                                )
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <div className="d-inline-block my-auto track-header-time">
                                        <span className="d-flex justify-content-end my-auto">{`
                                            ${("0" + Math.floor((Math.floor(time / 60)) / 60)).slice(-2)}:${("0" + Math.floor((time / 60)) % 60).slice(-2)}:${("0" + Math.floor(time % 60)).slice(-2)}
                                        `}</span>
                                    </div>
                                    <div className="d-inline-block">
                                        <div className="d-flex justify-content-end">
                                            <div className="d-inline my-auto track-header-button">
                                                <Button variant={!clockInterval ? "primary" : "danger"} className="btn-lg shadow-none" onClick={trackHandler}>{!clockInterval ? "START" : "STOP"}</Button>
                                            </div>
                                            <div className="d-flex align-items-end flex-column">
                                                <span className="mode-button active" onClick={() => setModeHeader(1)}><AccessTimeIcon/></span>
                                                <span className="mode-button" onClick={() => setModeHeader(2)}><ListOutlinedIcon/></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    ) : (
                        <Row className="d-flex align-items-center">
                            <Col md={12} lg={5} xl={6}>
                                <InputGroup>
                                    <FormControl className="shadow-none" placeholder="What are you working on?"/>
                                    <Dropdown focusFirstItemOnShow>
                                        <Dropdown.Toggle as={CustomToggle} id="track-header-input-dropdown-add">
                                            <AddCircleOutlineIcon/> Task
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item className="dropdown-input" onFocus={setInputFocus}>
                                                <InputGroup>
                                                    <FormControl className="border-0 shadow-none" id="dropdown-input" placeholder="Find task"/>
                                                </InputGroup>
                                            </Dropdown.Item>
                                            <Dropdown.Item>Second</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </InputGroup>
                            </Col>
                            <Col md={12} lg={7} xl={6}>
                                <div className="d-flex justify-content-end">
                                    <div className="d-inline-block my-auto mx-auto track-header-time-start">
                                        <div className="d-flex align-items-center">
                                            <InputGroup>
                                                <FormControl className="text-center rounded shadow-none" value="0:00"/>
                                                <span className="d-flex align-items-center track-header-time-start-divider">-</span>
                                                <FormControl className="text-center rounded shadow-none" value="0:00"/>
                                            </InputGroup>
                                            <span className="track-body-content-calendar"><CalendarTodayOutlinedIcon/></span>
                                            <span>Today</span>
                                        </div>
                                    </div>
                                    <div className="d-inline-block my-auto mx-auto track-header-time">
                                        <InputGroup>
                                            <FormControl className="text-center shadow-none" value="0:00"/>
                                        </InputGroup>
                                    </div>
                                    <div className="d-inline-block">
                                        <div className="d-flex justify-content-end">
                                            <div className="d-inline my-auto track-header-button">
                                                <Button variant="primary" className="btn-lg shadow-none">ADD</Button>
                                            </div>
                                            <div className="d-flex align-items-end flex-column">
                                                <span className="mode-button" onClick={() => setModeHeader(1)}><AccessTimeIcon/></span>
                                                <span className="mode-button active" onClick={() => setModeHeader(2)}><ListOutlinedIcon/></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    )}
                </ListGroup.Item>
            </ListGroup>
            {
                loading ? (
                    <Loader/>
                ) : error ? (
                    <Message variant="danger">{error}</Message>
                ) : (Object.prototype.toString.call(tracks) === "[object Array]" && tracks.length) ? (
                    tracks.map(day => (
                        <ListGroup key={day.date} className="track-body">
                            <ListGroup.Item className="track-body-header">
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="float-start">{new Date(day.date).toLocaleDateString() == new Date().toLocaleDateString() ? "Today" : new Date(day.date).toLocaleDateString()}</span>
                                    <span className="justify-content-end">Total: <span className="track-body-header-time">{`${("0" + Math.floor((Math.floor(day.totalTime / 60)) / 60)).slice(-2)}:${("0" + Math.floor((day.totalTime / 60) % 60)).slice(-2)}`}</span></span>
                                </div>
                            </ListGroup.Item>
                            {day.tracks.map(track => (
                                trackEdit.id == track.id ? (
                                    <ListGroup.Item key={track.id}>
                                        <Row className="d-flex align-items-center track-body-content">
                                            <Col md={12} lg={6} xl={6} xxl={7}>
                                                    <span className="d-flex track-body-edit-title">
                                                        <InputGroup>
                                                            <FormControl className="shadow-none track-edit-title" placeholder="What are you working on?" value={trackEditName} onChange={(e) => setTrackEditName(e.target.value)}/>
                                                            <Dropdown focusFirstItemOnShow className="d-none d-md-block">
                                                                <Dropdown.Toggle as={CustomToggle} id="track-edit-input-dropdown-md" color={!related ? "#008bdb" : ""}>
                                                                    {
                                                                        trackEditRelated ? (
                                                                            <span className="d-flex"><span className="track-task-color" style={{ color: trackEditRelated.task.color }}> &#9679;</span><span className="text-truncate track-task-title"> {trackEditRelated.task.title}</span></span>
                                                                        ) : (
                                                                            <span><AddCircleOutlineIcon/> Task</span>
                                                                        )
                                                                    }
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu className="track-dropdown-body">
                                                                    <div className="track-dropdown-task-search">
                                                                        <Dropdown.Item className="dropdown-input" onFocus={setInputFocus}>
                                                                            <InputGroup>
                                                                                <FormControl className="border-0 shadow-none" id="dropdown-input" placeholder="Find task" value={searchTask} onChange={(e) => setSearchTask(e.target.value)}/>
                                                                            </InputGroup>
                                                                        </Dropdown.Item>
                                                                    </div>
                                                                    {
                                                                        (Object.prototype.toString.call(tasks) == "[object Array]" && tasks.length) ? (
                                                                            <div className="track-dropdown-tasks">
                                                                                <Dropdown.Item onClick={() => setTrackEditRelated(false)}>
                                                                                    <div className="d-flex align-items-center track-dropdown-task">
                                                                                        <span className="d-flex rounded-circle track-dropdown-task-color"></span>
                                                                                        <span className="text-truncate track-dropdown-task-title">No task</span>
                                                                                    </div>
                                                                                </Dropdown.Item>
                                                                                {
                                                                                    tasks.map(task => (
                                                                                        <Dropdown.Item key={task.id} onClick={() => setTrackEditRelated({ task })}>
                                                                                            <div className="d-flex align-items-center track-dropdown-task">
                                                                                                <span className="d-flex rounded-circle track-dropdown-task-color" style={{ background: task.color }}></span>
                                                                                                <span className="text-truncate track-dropdown-task-title">{task.title}</span>
                                                                                            </div>
                                                                                        </Dropdown.Item>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                        ) : (
                                                                            <Dropdown.Item disabled>
                                                                                <span className="d-flex align-items-center justify-content-center text-muted">No tasks</span>
                                                                            </Dropdown.Item>
                                                                        )
                                                                    }
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </InputGroup>
                                                    </span>
                                            </Col>
                                            <Col md={12} lg={6} xl={6} xxl={5}>
                                                <div className="d-flex align-items-center justify-content-between track-edit-content">
                                                    <Dropdown focusFirstItemOnShow className="d-block d-md-none">
                                                        <Dropdown.Toggle as={CustomToggle} id="track-edit-input-dropdown" color={!related ? "#008bdb" : ""}>
                                                        {
                                                            trackEditRelated ? (
                                                                <span className="d-flex"><span className="track-task-color" style={{ color: trackEditRelated.task.color }}> &#9679;</span><span className="text-truncate track-task-title"> {trackEditRelated.task.title}</span></span>
                                                            ) : (
                                                                <span><AddCircleOutlineIcon/> Task</span>
                                                            )
                                                        }
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu className="track-dropdown-body">
                                                            <div className="track-dropdown-task-search">
                                                                <Dropdown.Item className="dropdown-input" onFocus={setInputFocus}>
                                                                    <InputGroup>
                                                                        <FormControl className="border-0 shadow-none" id="dropdown-input" placeholder="Find task" value={searchTask} onChange={(e) => setSearchTask(e.target.value)}/>
                                                                    </InputGroup>
                                                                </Dropdown.Item>
                                                            </div>
                                                            {
                                                                (Object.prototype.toString.call(tasks) == "[object Array]" && tasks.length) ? (
                                                                    <div className="track-dropdown-tasks">
                                                                        <Dropdown.Item onClick={() => setTrackEditRelated(false)}>
                                                                            <div className="d-flex align-items-center track-dropdown-task">
                                                                                <span className="d-flex rounded-circle track-dropdown-task-color"></span>
                                                                                <span className="text-truncate track-dropdown-task-title">No task</span>
                                                                            </div>
                                                                        </Dropdown.Item>
                                                                        {
                                                                            tasks.map(task => (
                                                                                <Dropdown.Item key={task.id} onClick={() => setTrackEditRelated({ task })}>
                                                                                    <div className="d-flex align-items-center track-dropdown-task">
                                                                                        <span className="d-flex rounded-circle track-dropdown-task-color" style={{ background: task.color }}></span>
                                                                                        <span className="text-truncate track-dropdown-task-title">{task.title}</span>
                                                                                    </div>
                                                                                </Dropdown.Item>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                ) : (
                                                                    <Dropdown.Item disabled>
                                                                        <span className="d-flex align-items-center justify-content-center text-muted">No tasks</span>
                                                                    </Dropdown.Item>
                                                                )
                                                            }
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                    <div className="d-flex align-items-center justify-content-between track-edit-datetime">
                                                        <div className="d-flex align-items-center justify-content-between track-edit-time">
                                                            <InputGroup>
                                                                <FormControl className="text-center rounded shadow-none" type="time" value={trackEditTimeStart} onChange={(e) => setTrackEditTimeStart(e.target.value)}/>
                                                                <span className="d-flex align-items-center track-header-time-start-divider">-</span>
                                                                <FormControl className="text-center rounded shadow-none" type="time" value={trackEditTimeEnd} onChange={(e) => setTrackEditTimeEnd(e.target.value)}/>
                                                            </InputGroup>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-between track-edit-date">
                                                            <InputGroup>
                                                                <FormControl className="text-center rounded shadow-none" type="date" value={trackEditDate} onChange={(e) => setTrackEditDate(e.target.value)}/>
                                                            </InputGroup>
                                                            <span className="track-edit-time-save-md" onClick={() => trackUpdateHandler(track)}><SaveRoundedIcon/></span>
                                                        </div>
                                                    </div>
                                                    <span className="track-edit-time-save" onClick={() => trackUpdateHandler(track)}><SaveRoundedIcon/></span>
                                                </div>
                                            </Col>
                                        </Row>
                                        {(!track.time_end && !activeTrack) && setActiveTrack(track)}
                                    </ListGroup.Item>
                                ) : (
                                    <ListGroup.Item key={track.id} variant={!track.time_end && "primary"}>
                                        <Row className="d-flex align-items-center track-body-content">
                                            <Col md={12} lg={7} xl={7} xxl={8}>
                                                <div className="d-flex align-items-center track-name">
                                                    <span className="d-flex track-body-title">
                                                        <span className="text-truncate track-title">{track.title}</span>
                                                        {
                                                            track.related && (
                                                                <span className="d-flex track-task">
                                                                    <span className="" style={{ color: track.related.task.color }}>
                                                                         &#9679;
                                                                    </span>
                                                                    <span className="text-truncate">
                                                                         {track.related.task.title}
                                                                    </span>
                                                                </span>
                                                            )
                                                        }
                                                    </span>
                                                </div>
                                            </Col>
                                            <Col md={12} lg={5} xl={5} xxl={4}>
                                                <div className="d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            {track.time_end ? 
                                                                <span>
                                                                    {`${("0" + new Date(track.time_start).getHours()).slice(-2)}:${("0" + new Date(track.time_start).getMinutes()).slice(-2)} - ${("0" + new Date(track.time_end).getHours()).slice(-2)}:${("0" + new Date(track.time_end).getMinutes()).slice(-2)}`}
                                                                </span> : 
                                                                <span>
                                                                    {`${new Date(track.time_start).getHours()}:${("0" + new Date(track.time_start).getMinutes()).slice(-2)} - ??:??`}
                                                                </span>}
                                                            <span className="track-body-content-calendar"><CalendarTodayOutlinedIcon/></span>
                                                        </div>
                                                        <div>
                                                            {
                                                                track.time_end ? 
                                                                    <span>
                                                                        {`${("0" + Math.floor((Math.floor(((new Date(track.time_end).getTime() / 1000) - (new Date(track.time_start).getTime() / 1000)) / 60)) / 60)).slice(-2)}:${
                                                                            (
                                                                                "0" + Math.floor(
                                                                                    (
                                                                                        (
                                                                                            (
                                                                                                new Date(track.time_end).getTime() - new Date(track.time_start).getTime()
                                                                                            ) / 1000
                                                                                        ) / 60
                                                                                    ) % 60
                                                                                )
                                                                            ).slice(-2)}`}
                                                                    </span> : 
                                                                    <span>??:??</span>
                                                            }
                                                        </div>
                                                        <span className="track-body-content-play" onClick={() => trackStartHandler(track)}><PlayArrowIcon/></span>
                                                        <span className="track-body-content-more">
                                                            <Dropdown onSelect={(eventKey) => handleSelect(eventKey, track)}>
                                                                <Dropdown.Toggle as={CustomToggle} id="track-body-content-more">
                                                                    <MoreVertIcon/>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item active={false} eventKey="edit">Edit</Dropdown.Item>
                                                                    <Dropdown.Item active={false} eventKey="delete">Delete</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </span>
                                                </div>
                                            </Col>
                                        </Row>
                                        {(!track.time_end && !activeTrack) && setActiveTrack(track)}
                                    </ListGroup.Item>
                                )
                            ))}
                            <ListGroup.Item className="track-body-footer">
                            </ListGroup.Item>
                        </ListGroup>
                    ))
                ) : (
                    <ListGroup className="track-body">
                        <ListGroup.Item className="track-body-content">
                            <div className="d-flex align-items-center justify-content-center">
                                <span className="text-muted">No tracks</span>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                )
            }
        </div>
    )
}

export default TimeTrackerScreen
