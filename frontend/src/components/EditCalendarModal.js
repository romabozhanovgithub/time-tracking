import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, InputGroup, FormControl, Dropdown, Modal } from "react-bootstrap";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CustomToggle from "../components/CustomToggle";
import { updateCalendar, deleteCalendar } from "../actions/calendarActions";
import { listTasks } from "../actions/taskActions";

const EditCalendarModal = ({ calendar, show, onHide }) => {
    const [calendarDate, setCalendarDate] = useState(`${new Date().getFullYear()}-${("0" + (new Date().getMonth() + 1)).slice(-2)}-${("0" + new Date().getDate()).slice(-2)}`);
    const [calendarTitle, setCalendarTitle] = useState("");
    const [calendarTimeStart, setCalendarTimeStart] = useState("");
    const [calendarTimeEnd, setCalendarTimeEnd] = useState("");
    const [searchTask, setSearchTask] = useState("");
    const [related, setRelated] = useState(false);
    const [calendarDelete, setCalendarDelete] = useState(false);

    const dispatch = useDispatch();

    const taskState = useSelector(state => state.task)
    const {
        loading: loadingTask,
        error: errorTask,
        tasks
    } = taskState

    useEffect(() => {
        !(Object.prototype.toString.call(tasks) == "[object Array]") && dispatch(listTasks());

        if (show) {
            setCalendarTitle(calendar.title);
            setCalendarDate(
                `${
                    new Date(calendar.time_start).getFullYear()
                }-${
                    ("0" + (new Date(calendar.time_start).getMonth() + 1)).slice(-2)
                }-${
                    ("0" + new Date(calendar.time_start).getDate()).slice(-2)
                }`
            );
            setCalendarTimeStart(`${("0" + new Date(calendar.time_start).getHours()).slice(-2)}:${("0" + new Date(calendar.time_start).getMinutes()).slice(-2)}`);
            setCalendarTimeEnd(`${("0" + new Date(calendar.time_end).getHours()).slice(-2)}:${("0" + new Date(calendar.time_end).getMinutes()).slice(-2)}`);
            setRelated(calendar.related);
            setCalendarDelete(false);
        }
    }, [show]);

    const setInputFocus = () => {
        document.getElementById("dropdown-input").focus();
    }

    const editCalendar = () => {
        dispatch(updateCalendar({
            id: calendar.id,
            title: calendarTitle,
            timeStart: (new Date((new Date(calendarDate).setHours(Number(calendarTimeStart.split(":")[0].slice(-2)), Number(calendarTimeStart.split(":")[1].slice(-2)))))),
            timeEnd: (new Date((new Date(calendarDate).setHours(Number(calendarTimeEnd.split(":")[0].slice(-2)), Number(calendarTimeEnd.split(":")[1].slice(-2)))))),
            related
        }));
        onHide();
    }

    const deleteCalendarHandler = () => {
        dispatch(deleteCalendar(calendar.id));
        onHide();
    }

    return (
        calendarDelete ? (
                <Modal aria-labelledby="modal-title" show={show} onHide={onHide} centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="modal-title">
                            Delete task
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex align-items-center justify-content-center">
                            <span>You sure you want to delete task?</span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" className="shadow-none" onClick={() => setCalendarDelete(false)}>Cancel</Button>
                        <Button variant="danger" className="shadow-none" onClick={deleteCalendarHandler}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            ) : (
                <Modal aria-labelledby="modal-title" show={show} onHide={onHide} centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="modal-title">
                            Edit task
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={4}>
                                <span className="d-flex align-items-center justify-content-start calendar-create-name-title">Title</span>
                            </Col>
                            <Col md={8}>
                                <div className="calendar-create-name">
                                    <InputGroup>
                                        <FormControl className="rounded-0 shadow-none" placeholder="Task name" type="name" value={calendarTitle} onChange={
                                            (e) => setCalendarTitle(e.target.value)
                                        }/>
                                    </InputGroup>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <span className="d-flex align-items-center justify-content-start calendar-create-task-title">Task</span>
                            </Col>
                            <Col md={8}>
                                <div className="calendar-create-task">
                                    <Dropdown focusFirstItemOnShow>
                                        <Dropdown.Toggle as={CustomToggle} id="calendar-create-task-dropdown">
                                            {
                                                related ? (
                                                    <span className="d-flex calendar-create-task-name"><span className="track-task-color" style={
                                                        { color: related.task.color }
                                                    }> &#9679;</span><span className="text-truncate track-task-title"> {related.task.title}</span></span>
                                                ) : (
                                                    <span><AddCircleOutlineIcon/> Task</span>
                                                )
                                            }
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="track-dropdown-body">
                                            <div className="track-dropdown-task-search">
                                                <Dropdown.Item className="dropdown-input" onFocus={setInputFocus}>
                                                    <InputGroup>
                                                        <FormControl className="border-0 shadow-none" id="dropdown-input" placeholder="Find task" value={searchTask} onChange={
                                                            (e) => setSearchTask(e.target.value)
                                                        }/>
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
                                                                        <span className="d-flex rounded-circle track-dropdown-task-color" style={
                                                                            { background: task.color }
                                                                        }></span>
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
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <span className="d-flex align-items-center justify-content-start calendar-create-date-title">Date</span>
                            </Col>
                            <Col md={8}>
                                <div className="calendar-create-date">
                                    <InputGroup>
                                        <FormControl className="text-center rounded-0 shadow-none" type="date" value={calendarDate} onChange={
                                            (e) => setCalendarDate(e.target.value)
                                        }/>
                                    </InputGroup>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <span className="d-flex align-items-center justify-content-start calendar-create-time-start-title">Time start</span>
                            </Col>
                            <Col md={8}>
                                <div className="calendar-create-time-start">
                                    <InputGroup>
                                        <FormControl className="text-center rounded-0 shadow-none" type="time" value={calendarTimeStart} onChange={
                                            (e) => setCalendarTimeStart(e.target.value)
                                        }/>
                                    </InputGroup>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <span className="d-flex align-items-center justify-content-start calendar-create-time-end-title">Time end</span>
                            </Col>
                            <Col md={8}>
                                <div className="calendar-create-time-end">
                                    <InputGroup>
                                        <FormControl className="text-center rounded-0 shadow-none" type="time" value={calendarTimeEnd} onChange={
                                            (e) => setCalendarTimeEnd(e.target.value)
                                        }/>
                                    </InputGroup>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" className="shadow-none" onClick={() => setCalendarDelete(true)}>Delete</Button>
                        <Button variant="success" className="shadow-none" onClick={editCalendar} disabled={
                            (
                                calendarDate && calendarTitle && calendarTimeStart && calendarTimeEnd && related && (
                                    (
                                        (
                                            new Date(
                                                (
                                                    new Date(calendarDate).setHours(
                                                        Number(calendarTimeEnd.split(":")[0].slice(-2)), Number(calendarTimeEnd.split(":")[1].slice(-2))
                                                    )
                                                )
                                            )
                                        ).getTime() - (
                                            new Date(
                                                (
                                                    new Date(calendarDate).setHours(
                                                        Number(calendarTimeStart.split(":")[0].slice(-2)), Number(calendarTimeStart.split(":")[1].slice(-2))
                                                    )
                                                )
                                            )
                                        ).getTime()
                                    ) > 0
                                )
                            ) ? false : true
                        }>Edit</Button>
                    </Modal.Footer>
                </Modal>
            )
    )
}

export default EditCalendarModal
