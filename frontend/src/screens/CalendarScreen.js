import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Button, InputGroup, FormControl, Dropdown, Form, Table, Popover, OverlayTrigger } from "react-bootstrap";
import CreateNewCalendarTaskModal from "../components/CreateNewCalendarTaskModal";
import EditCalendarModal from "../components/EditCalendarModal";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import { listCalendar } from "../actions/calendarActions";

const CalendarScreen = ({ history }) => {
    const [scroll, setScroll] = useState(false);
    const [calendarTable, setCalendarTable] = useState([]);
    const [num, setNum] = useState(24);
    const [timeCalendar, setTimeCalendar] = useState([new Date().getMinutes() * ((8 / 60) - 0.005), false]);
    const [calendarWeek, setCalendarWeek] = useState(false);
    const [calendarEdit, setCalendarEdit] = useState(false);
    const [modalCreateShow, setModalCreateShow] = useState(false);
    const [modalEditShow, setModalEditShow] = useState(false);

    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.user)
    const { userInfo } = userLogin

    const calendarState = useSelector(state => state.calendar)
    const {
        loading,
        error,
        calendars
    } = calendarState

    useEffect(() => {
        if (userInfo) {
            !calendarWeek && dispatch(listCalendar(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)).toLocaleDateString()));
            !calendarWeek && setCalendarWeek(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)));
        }
        else if (!userInfo) {
            history.push("/login?redirect=calendar");
        }

        !timeCalendar[1] && (
            setInterval(() => {
                setTimeCalendar([new Date().getMinutes() * ((8 / 60) - 0.005), true])
            }, 60000)
        )

        if (!scroll && document.getElementById("time-calendar")) {
            document.getElementById("time-calendar").scrollIntoView({ block: "center", inline:"center" });
            document.getElementsByClassName("calendar-wrapper")[0].scrollIntoView();
            document.getElementById("time-calendar").scrollIntoView({ block: "center", inline:"center" });
            setScroll(true);
        }

        document.getElementById("header-title") && (document.getElementById("header-title").innerText = "CALENDAR");
    }, [dispatch, timeCalendar]);

    const handleSelect = (calendar) => {
        setCalendarEdit(calendar);
        setModalEditShow(true);
    }

    const previousWeek = () => {
        dispatch(listCalendar(new Date(new Date(calendarWeek).setDate(new Date(calendarWeek).getDate() - 7)).toLocaleDateString()));
        setCalendarWeek(new Date(calendarWeek).setDate(new Date(calendarWeek).getDate() - 7));
    }

    const nextWeek = () => {
        dispatch(listCalendar(new Date(new Date(calendarWeek).setDate(new Date(calendarWeek).getDate() + 7)).toLocaleDateString()));
        setCalendarWeek(new Date(calendarWeek).setDate(new Date(calendarWeek).getDate() + 7));
    }

    return (
        <div>
            <div className="d-flex justify-content-between calendar-header">
                <div className="d-flex align-items-center justify-content-between rounded calendar-week">
                    <span className="d-flex align-items-center justify-content-center calendar-week-previous" onClick={previousWeek}><NavigateBeforeIcon/></span>
                    <div className="d-flex align-items-center calendar-week-title">
                        {
                            new Date(calendarWeek).toLocaleDateString() == (new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)).toLocaleDateString()) ? (
                                <span>This week</span>
                            ) : (
                                <span>{new Date(calendarWeek).toLocaleDateString()}</span>
                                // <InputGroup>
                                //     <FormControl className="text-center rounded shadow-none calendar-header-title" type="date" value={`${new Date(calendarWeek).getFullYear()}-${("0" + (new Date(calendarWeek).getMonth() + 1)).slice(-2)}-${("0" + new Date(calendarWeek).getDate()).slice(-2)}`} onChange={(e) => setCalendarWeek(e.target.value)}/>
                                // </InputGroup>
                            )
                        }
                    </div>
                    <span className="d-flex align-items-center justify-content-center calendar-week-next" onClick={nextWeek}><NavigateNextIcon/></span>
                </div>
                <Button variant="outline-primary" className="d-flex align-items-center justify-content-center shadow-none" onClick={() => setModalCreateShow(true)}>+ ADD</Button>
            </div>
            <div className="calendar-wrapper">
                <Table bordered fixed>
                    <thead>
                        <tr>
                            <th>
                                <span className="d-flex justify-content-center">
                                    <span className="rounded-start"><RemoveIcon/></span>
                                    <span className="rounded-end" onClick={() => setNum(12)}><AddIcon/></span>
                                </span>
                            </th>
                            {
                                [
                                    ["Monday", 1],
                                    ["Tuesday", 2],
                                    ["Wednesday", 3],
                                    ["Thursday", 4],
                                    ["Friday", 5],
                                    ["Saturday", 6],
                                    ["Sunday", 0]
                                ].map((e, key) => (
                                    <th key={key}><span className="d-flex justify-content-center" style={{color: new Date().getDay() == e[1] ? "#000" : ""}}>{e[0]}</span></th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(num)].map((e, key) => (
                            <tr key={key}>
                                <th>
                                    <span className="d-flex justify-content-end calendar-new-time">{`${key}`}:00</span>
                                </th>
                                    {
                                        [0, 1, 2, 3, 4, 5, 6].map((eCol, keyCol) => (
                                                <td className="calendar-body">
                                                    {
                                                        (Object.prototype.toString.call(calendars) == "[object Array]" && calendars.length) ? (
                                                            calendars.map(calendar => (
                                                                ((new Date(calendar.time_start).getDate() == (new Date(calendarWeek).getDate() + keyCol)) && (new Date(calendar.time_start).getHours() == key)) && (
                                                                    <OverlayTrigger trigger="hover" placement={(keyCol < 5) ? "right" : "left"} overlay={
                                                                        <Popover className="calendar-popover">
                                                                            <Popover.Header>
                                                                                <div className="text-truncate calendar-popover-header-title">{calendar.title}</div>
                                                                            </Popover.Header>
                                                                            <Popover.Body>
                                                                                <div className="calendar-popover-content">
                                                                                    <div className="calendar-popover-title">Title</div>
                                                                                    <div className="calendar-popover-content-description">{calendar.title}</div>
                                                                                </div>
                                                                                <div className="calendar-popover-content">
                                                                                    <div className="calendar-popover-title">Task</div>
                                                                                    <div className="calendar-popover-content-description" style={{ color: calendar.related.task.color }}>{calendar.related.task.title}</div>
                                                                                </div>
                                                                                <div className="calendar-popover-content">
                                                                                    <div className="calendar-popover-title">Time</div>
                                                                                    <div className="calendar-popover-content-description">
                                                                                        {`${("0" + new Date(calendar.time_start).getHours()).slice(-2)}:${("0" + new Date(calendar.time_start).getMinutes()).slice(-2)}`} - {`${("0" + new Date(calendar.time_end).getHours()).slice(-2)}:${("0" + new Date(calendar.time_end).getMinutes()).slice(-2)}`}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="calendar-popover-content">
                                                                                    <div className="calendar-popover-title">Hours</div>
                                                                                    <div className="calendar-popover-content-description">
                                                                                        {`${("0" + Math.floor((Math.floor((new Date(calendar.time_end).getTime() - new Date(calendar.time_start).getTime()) / 60000)) / 60)).slice(-2)}:${("0" + Math.floor(((new Date(calendar.time_end).getTime() - new Date(calendar.time_start).getTime()) / 60000) % 60)).slice(-2)}`}
                                                                                    </div>
                                                                                </div>
                                                                            </Popover.Body>
                                                                        </Popover>
                                                                    }>
                                                                        <div className="d-flex calendar-task" style={{ height: `${(((new Date(calendar.time_end).getTime() - new Date(calendar.time_start).getTime())) / 60000) * (8 / 60)}vh`, top: `${(new Date(calendar.time_start).getMinutes() * (8 / 60))}vh` }} onClick={() => handleSelect(calendar)}>
                                                                            <span className="d-inline-block side" style={{ background: calendar.related.task.color }}></span>
                                                                            <span className="text-break calendar-task-content">
                                                                                <div className={`${(Math.floor(((new Date(calendar.time_end).getTime() - new Date(calendar.time_start).getTime())) / (60000 * 20))) < 1 && "d-none"} calendar-task-content-title`} style={{ webkitLineClamp: ((Math.floor(((new Date(calendar.time_end).getTime() - new Date(calendar.time_start).getTime())) / (60000 * 20)) - 1) <= 1) ? (
                                                                                    "1"
                                                                                ) : (
                                                                                    (calendar.title.length >= 16 && calendar.related.task.title.length >= 16 && Math.floor(((new Date(calendar.time_end).getTime() - new Date(calendar.time_start).getTime())) / (60000 * 20)) == 5) ? (
                                                                                        "2"
                                                                                    ) : (
                                                                                        `${Math.round((Math.floor(((new Date(calendar.time_end).getTime() - new Date(calendar.time_start).getTime())) / (60000 * 21))) / 2)}`
                                                                                    )
                                                                                ) }}>
                                                                                    {calendar.title}
                                                                                </div>
                                                                                <div className={`${(Math.floor(((new Date(calendar.time_end).getTime() - new Date(calendar.time_start).getTime())) / (60000 * 21)) <= 1) && "d-none"} calendar-task-content-task-title`} style={{
                                                                                    webkitLineClamp: `${((Math.floor(((new Date(calendar.time_end).getTime() - new Date(calendar.time_start).getTime())) / (60000 * 21)) - 1) <= 1) ? (
                                                                                        "1"
                                                                                    ) : (
                                                                                        `${Math.floor((Math.floor(((new Date(calendar.time_end).getTime() - new Date(calendar.time_start).getTime())) / (60000 * 21)) - 1) / 2)}`
                                                                                    )}`,
                                                                                    color: calendar.related.task.color
                                                                                }}>
                                                                                    {calendar.related.task.title}
                                                                                </div>
                                                                                <div className={`${(Math.floor(((new Date(calendar.time_end).getTime() - new Date(calendar.time_start).getTime())) / (60000 * 20)) - 1) <= 1 && "d-none"} calendar-content-time`}>
                                                                                    {`${("0" + new Date(calendar.time_start).getHours()).slice(-2)}:${("0" + new Date(calendar.time_start).getMinutes()).slice(-2)}`} - {`${("0" + new Date(calendar.time_end).getHours()).slice(-2)}:${("0" + new Date(calendar.time_end).getMinutes()).slice(-2)}`}
                                                                                </div>
                                                                            </span>
                                                                        </div>
                                                                    </OverlayTrigger>
                                                                    )
                                                                )
                                                            )
                                                        ) : (
                                                            ""
                                                        )
                                                    }
                                                    {
                                                        ((new Date().getDay() == eCol) && (new Date().getHours() == key)) && (
                                                            <div className="time-calendar" id="time-calendar" style={{ top: `${timeCalendar[0]}vh` }}></div>
                                                        )
                                                    }
                                                </td>
                                            )
                                        )
                                    }
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <CreateNewCalendarTaskModal show={modalCreateShow} onHide={() => setModalCreateShow(false)}/>
            <EditCalendarModal calendar={calendarEdit} show={modalEditShow} onHide={() => setModalEditShow(false)}/>
        </div>
    )
}

export default CalendarScreen
