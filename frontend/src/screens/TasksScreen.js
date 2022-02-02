import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Button, InputGroup, FormControl, Dropdown} from "react-bootstrap";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CustomToggle from "../components/CustomToggle";
import CreateNewTaskModal from "../components/CreateNewTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import DeleteTaskModal from "../components/DeleteTaskModal";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listTasks } from "../actions/taskActions";

const TasksScreen = ({ history }) => {
    const [search, setSearch] = useState("");
    const [modalCreateShow, setModalCreateShow] = useState(false);
    const [modalEditShow, setModalEditShow] = useState(false);
    const [modalEditTask, setModalEditTask] = useState("");
    const [modalDeleteShow, setModalDeleteShow] = useState(false);
    const [modalDeleteTask, setModalDeleteTask] = useState("");

    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.user)
    const { userInfo } = userLogin

    const taskState = useSelector(state => state.task)
    const {
        loading,
        error,
        tasks,
        loadingCreate,
        errorCreate,
        successCreate,
        loadingUpdate,
        errorUpdate,
        successUpdate
    } = taskState

    useEffect(() => {
        if (userInfo) {
            (!successCreate && !successUpdate) && dispatch(listTasks());
        }
        else if (!userInfo) {
            history.push("/login?redirect=tasks");
        }

        document.getElementById("header-title") &&  (document.getElementById("header-title").innerText = "TASKS")
    }, [dispatch, history, successCreate, successUpdate]);

    const handleSelect = (eventKey, task) => {
        if (eventKey === "edit") {
            setModalEditTask(task);
            setModalEditShow(true);
        }
        else if (eventKey === "delete") {
            setModalDeleteTask(task);
            setModalDeleteShow(true);
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-between tasks-header">
                <span className="tasks-header-title"><h2>Tasks</h2></span>
                <Button variant="outline-primary" className="btn-lg shadow-none tasks-header-button" onClick={() => setModalCreateShow(true)}>CREATE NEW TASK</Button>
            </div>
            <ListGroup className="tasks-search">
                <ListGroup.Item>
                    <InputGroup>
                        <FormControl className="border-0 shadow-none" placeholder="Task name" value={search} onChange={(e) => setSearch(e.target.value)}/>
                        <span><Button variant="primary" className="shadow-none">Search</Button></span>
                    </InputGroup>
                </ListGroup.Item>
            </ListGroup>
            <ListGroup className="tasks-body">
                <ListGroup.Item className="tasks-body-header">
                    <Row className="d-flex align-items-center">
                        <Col md={8}>
                            <span>Tasks</span>
                        </Col>
                        <Col md={4}>
                            <div className="d-flex align-items-center justify-content-between">
                                <span>Status</span>
                                <span>Hours</span>
                                <span className="tasks-body-header-content-more"></span>
                            </div>
                        </Col>
                    </Row>
                </ListGroup.Item>
                {
                    loading ? (
                        <Loader/>
                    ) : error ? (
                        <Message variant="danger">{error}</Message>
                    ) : (Object.prototype.toString.call(tasks) === "[object Array]" && tasks.length) ? (
                        tasks.map(task => (
                            <ListGroup.Item className="tasks-body-content" key={task.id}>
                                <Row className="d-flex align-items-center">
                                    <Col md={8}>
                                        <div className="d-flex align-items-center">
                                            <span className="d-flex task-color" style={{ color: task.color }}>&#9679;</span>
                                            <span className="text-truncate">{task.title}</span>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span>{task.status ? "Done" : "Active"}</span>
                                            <span>{(Math.floor(task.hours) / 60 / 60).toFixed(2)}h</span>
                                            <span className="tasks-body-content-more">
                                                <Dropdown onSelect={(eventKey) => handleSelect(eventKey, task)}>
                                                    <Dropdown.Toggle as={CustomToggle}>
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
                            </ListGroup.Item>
                        ))
                    ) : (
                        <ListGroup.Item className="tasks-body-content">
                            <div className="d-flex align-items-center justify-content-center">
                                <span className="text-muted">No task</span>
                            </div>
                        </ListGroup.Item>
                    )
                }
                {
                    loadingCreate && (
                        <ListGroup.Item className="tasks-body-content">
                            <div className="d-flex align-items-center justify-content-center">
                                <Loader loaderSize="50px"/>
                            </div>
                        </ListGroup.Item>
                    )
                }
            </ListGroup>
            <CreateNewTaskModal show={modalCreateShow} onHide={() => setModalCreateShow(false)}/>
            <EditTaskModal task={modalEditTask} show={modalEditShow} onHide={() => setModalEditShow(false)}/>
            <DeleteTaskModal task={modalDeleteTask} show={modalDeleteShow} onHide={() => setModalDeleteShow(false)}/>
        </div>
    )
}

export default TasksScreen
