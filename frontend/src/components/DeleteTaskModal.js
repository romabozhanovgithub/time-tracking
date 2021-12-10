import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, InputGroup, Form, FormControl, Modal } from "react-bootstrap";
import { deleteTask } from "../actions/taskActions";

const EditTaskModal = ({ task, show, onHide }) => {
    const dispatch = useDispatch();

    useEffect(() => {

    }, [show]);

    const editTask = () => {
        dispatch(deleteTask(task.id));
        onHide();
    }

    return (
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
                <Button variant="danger" className="shadow-none" onClick={onHide}>Cancel</Button>
                <Button variant="success" className="shadow-none" onClick={editTask}>Delete</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditTaskModal
