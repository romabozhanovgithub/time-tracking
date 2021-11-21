import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, InputGroup, Form, FormControl, Modal } from "react-bootstrap";

const CreateNewTaskModal = ({ show, onHide }) => {
    const [taskName, setTaskName] = useState("");
    const [taskColor, setTaskColor] = useState("");

    const createNewTask = () => {

    }

    return (
        <Modal aria-labelledby="modal-title" show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title id="modal-title">
                    Create new task
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={10}>
                        <InputGroup>
                            <FormControl className="shadow-none" placeholder="Task name" value={taskName} onChange={(e) => setTaskName(e.target.value)}/>
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
                <Button variant="success" className="shadow-none" onClick={createNewTask}>Create</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateNewTaskModal
