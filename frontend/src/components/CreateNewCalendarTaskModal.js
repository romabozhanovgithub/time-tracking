import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, InputGroup, Form, FormControl, Modal } from "react-bootstrap";

const CreateNewCalendarTaskModal = ({ show, onHide }) => {
    const [taskName, setTaskName] = useState("");
    const [taskColor, setTaskColor] = useState("");

    const createNewTask = () => {

    }

    return (
        <Modal aria-labelledby="modal-title" show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title id="modal-title">
                    Add new task
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={3}>
                        <InputGroup>
                            <Form.Label>Time and date</Form.Label>
                            <FormControl type="number" className="shadow-none" value={taskName} onChange={(e) => setTaskName(e.target.value)}/>
                        </InputGroup>
                    </Col>
                    <Col md={6}>
                        <InputGroup>
                            <FormControl type="number" className="shadow-none" value={taskName} onChange={(e) => setTaskName(e.target.value)}/>
                        </InputGroup>
                        <InputGroup>
                            <FormControl type="number" className="shadow-none" value={taskName} onChange={(e) => setTaskName(e.target.value)}/>
                        </InputGroup>
                    </Col>
                    <Col md={3}>
                        <InputGroup>
                            <FormControl type="number" className="shadow-none" value={taskName} onChange={(e) => setTaskName(e.target.value)}/>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <span>Description</span>
                    </Col>
                    <Col md={8}>
                        <FormControl type="text" className="shadow-none" placeholder="What hava you worked on?" value={taskName} onChange={(e) => setTaskName(e.target.value)}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <span>Description</span>
                    </Col>
                    <Col md={8}>
                        <FormControl type="text" className="shadow-none" placeholder="What hava you worked on?" value={taskName} onChange={(e) => setTaskName(e.target.value)}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <span>Description</span>
                    </Col>
                    <Col md={8}>
                        <FormControl type="text" className="shadow-none" placeholder="What hava you worked on?" value={taskName} onChange={(e) => setTaskName(e.target.value)}/>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" className="shadow-none" onClick={onHide}>Cancel</Button>
                <Button variant="success" className="shadow-none" onClick={createNewTask}>Add</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateNewCalendarTaskModal
