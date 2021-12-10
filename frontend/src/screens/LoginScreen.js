import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, ListGroup, Button, InputGroup, FormControl, Dropdown, Form } from "react-bootstrap";
import Header from "../components/Header.js";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { login } from "../actions/userActions";

const LoginScreen = ({ location, history }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const redirect = location.search ? location.search.split("=")[1] : "/timetracker";

    const user = useSelector(state => state.user)
    const { loading, error, userInfo } = user

    useEffect(() => {
        if (userInfo) {
            history.push(redirect);
        }
        document.getElementById("header-title") &&  (document.getElementById("header-title").innerText = "Login")
    }, [history, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    }

    return (
        <div>
            <div className="d-flex align-items-center justify-content-center">
                <div className="rounded shadow p-5 login-wrapper">
                    <span className="d-flex justify-content-center login-header">
                        <h1>Sign In</h1>
                    </span>
                    {error && <Message variant="danger">{error}</Message>}
                    {loading && <Loader/>}
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="email">
                            <Form.Label className="fw-bold">Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label className="fw-bold">Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Button type="submit" variant="primary" className="shadow-none my-2">Log In</Button>
                    </Form>
                    <p>
                        New? <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginScreen
