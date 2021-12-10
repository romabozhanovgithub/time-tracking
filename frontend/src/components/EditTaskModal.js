import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, InputGroup, Form, FormControl, Modal } from "react-bootstrap";
import { updateTask } from "../actions/taskActions";

const EditTaskModal = ({ task, show, onHide }) => {
    const [taskName, setTaskName] = useState("");
    const [taskColor, setTaskColor] = useState("#rrggbb");
    const [taskStatus, setTaskStatus] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        setTaskName(task.title);
        setTaskColor(task.color);
        setTaskStatus(task.status);
    }, [show]);

    const editTask = () => {
        dispatch(updateTask({
            id: task.id,
            title: taskName,
            color: taskColor,
            status: taskStatus
        }));
        onHide();
    }

    return (
        <Modal aria-labelledby="modal-title" show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title id="modal-title">
                    Edit task
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={7}>
                        <InputGroup>
                            <FormControl className="shadow-none" placeholder="Task name" value={taskName} onChange={(e) => setTaskName(e.target.value)}/>
                        </InputGroup>
                    </Col>
                    <Col md={3}>
                        <InputGroup>
                            <Form.Select className="shadow-none" value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)}>
                                <option value={true}>Done</option>
                                <option value={false}>Active</option>
                            </Form.Select>
                        </InputGroup>
                    </Col>
                    <Col md={2}>
                        <InputGroup>
                            <FormControl type="color" className="shadow-none" placeholder="Task name" value={taskColor} onChange={(e) => setTaskColor(e.target.value)}/>
                        </InputGroup>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" className="shadow-none" onClick={onHide}>Cancel</Button>
                <Button variant="success" className="shadow-none" onClick={editTask}>Edit</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditTaskModal
