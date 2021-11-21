import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Button, InputGroup, FormControl, Dropdown, Form } from "react-bootstrap";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CustomToggle from "../components/CustomToggle";
import CreateNewTaskModal from "../components/CreateNewTaskModal";

const TasksScreen = () => {
    const [modalShow, setModalShow] = useState(false);

    const handleSelect = (e) => {
        if (e == "edit") {
            console.log("Edit");
        }
        else if (e == "delete") {
            console.log("Delete");
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-between tasks-header">
                <span className="tasks-header-title"><h2>Tasks</h2></span>
                <Button variant="outline-primary" className="btn-lg shadow-none tasks-header-button" onClick={() => setModalShow(true)}>CREATE NEW TASK</Button>
            </div>
            <ListGroup className="tasks-search">
                <ListGroup.Item>
                    <InputGroup>
                        <FormControl className="border-0 shadow-none" placeholder="Task name"/>
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
                <ListGroup.Item className="tasks-body-content">
                    <Row className="d-flex align-items-center">
                        <Col md={8}>
                            <span>Task name</span>
                        </Col>
                        <Col md={4}>
                            <div className="d-flex align-items-center justify-content-between">
                                <span>Active</span>
                                <span>0.00h</span>
                                <span className="tasks-body-content-more">
                                    <Dropdown onSelect={handleSelect}>
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
            </ListGroup>
            <CreateNewTaskModal show={modalShow} onHide={() => setModalShow(false)}/>
        </div>
    )
}

export default TasksScreen
