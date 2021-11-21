import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Button, InputGroup, FormControl, Dropdown } from "react-bootstrap";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import ListOutlinedIcon from "@material-ui/icons/ListOutlined";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CustomToggle from "../components/CustomToggle";

const TimeTrackerScreen = () => {
    const [modeHeader, setModeHeader] = useState(1);

    const dispatch = useDispatch();

    useEffect(() => {

    }, [dispatch]);

    const setInputFocus = () => {
        document.getElementById("dropdown-input").focus();
    }

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
            <ListGroup className="track-header">
                <ListGroup.Item>
                    {modeHeader == 1 ? (
                        <Row className="d-flex align-items-center">
                            <Col md={7} lg={8} xl={9}>
                                <InputGroup>
                                    <FormControl className="border-0 shadow-none" placeholder="What are you working on?"/>
                                    <Dropdown focusFirstItemOnShow>
                                        <Dropdown.Toggle as={CustomToggle} id="track-header-input-dropdown">
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
                            <Col md={5} lg={4} xl={3}>
                                <div className="d-flex justify-content-end">
                                    <div className="d-inline-block my-auto mx-auto track-header-time">
                                        <span className="d-flex justify-content-end my-auto">00:00:00</span>
                                    </div>
                                    <div className="d-inline-block">
                                        <div className="d-flex justify-content-end">
                                            <div className="d-inline my-auto track-header-button">
                                                <Button variant="primary" className="btn-lg shadow-none">START</Button>
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
                            <Col md={6}>
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
                            <Col md={6}>
                                <div className="d-flex justify-content-end">
                                    <div className="d-inline-block my-auto mx-auto track-header-time-start">
                                        <InputGroup>
                                            <FormControl className="shadow-none" value="0:00"/>
                                            <span>-</span>
                                            <FormControl className="shadow-none" value="0:00"/>
                                        </InputGroup>
                                    </div>
                                    <div className="d-inline-block my-auto mx-auto track-header-time">
                                        <InputGroup>
                                            <FormControl className="shadow-none" value="0:00"/>
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
            <ListGroup className="track-body">
                <ListGroup.Item className="track-body-header">
                    <div className="d-flex align-items-center justify-content-between">
                        <span className="float-start">Today</span>
                        <span className="justify-content-end">Total: <span className="track-body-header-time">0:00</span></span>
                    </div>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row className="track-body-content">
                        <Col md={8}>
                            <div>
                                <span>Track name</span>
                                <span> &middot; Task</span>
                            </div>
                        </Col>
                        <Col md={2}>
                            <div className="d-flex align-items-center">
                                <span>0:00 - 0:00</span>
                                <span className="track-body-content-calendar"><CalendarTodayOutlinedIcon/></span>
                            </div>
                        </Col>
                        <Col md={2}>
                            <div className="d-flex align-items-center justify-content-between">
                                <span>0:00</span>
                                <span className="track-body-content-play"><PlayArrowIcon/></span>
                                <span className="track-body-content-more">
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
                <ListGroup.Item>
                    <Row className="track-body-content">
                        <Col md={8}>
                            <div>
                                <span>Track name</span>
                                <span> &middot; Task</span>
                            </div>
                        </Col>
                        <Col md={2}>
                            <div>
                                <span>0:00 - 0:00</span>
                                <span className="track-body-content-calendar"><CalendarTodayOutlinedIcon/></span>
                            </div>
                        </Col>
                        <Col md={2}>
                            <div className="d-flex align-items-center justify-content-between">
                                <span>0:00</span>
                                <span className="track-body-content-play"><PlayArrowIcon/></span>
                                <span className="track-body-content-more"><MoreVertIcon/></span>
                            </div>
                        </Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item className="track-body-footer">
                </ListGroup.Item>
            </ListGroup>
            <ListGroup className="track-body">
                <ListGroup.Item className="track-body-header">
                    <div className="d-flex align-items-center justify-content-between">
                        <span className="float-start">Today</span>
                        <span className="justify-content-end">Total: <span className="track-body-header-time">0:00</span></span>
                    </div>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row className="track-body-content">
                        <Col md={8}>
                            <div>
                                <span>Track name</span>
                                <span> &middot; Task</span>
                            </div>
                        </Col>
                        <Col md={2}>
                            <div className="d-flex align-items-center">
                                <span>0:00 - 0:00</span>
                                <span className="track-body-content-calendar"><CalendarTodayOutlinedIcon/></span>
                            </div>
                        </Col>
                        <Col md={2}>
                            <div className="d-flex align-items-center justify-content-between">
                                <span>0:00</span>
                                <span className="track-body-content-play"><PlayArrowIcon/></span>
                                <span className="track-body-content-more"><MoreVertIcon/></span>
                            </div>
                        </Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row className="track-body-content">
                        <Col md={8}>
                            <div>
                                <span>Track name</span>
                                <span> &middot; Task</span>
                            </div>
                        </Col>
                        <Col md={2}>
                            <div>
                                <span>0:00 - 0:00</span>
                                <span className="track-body-content-calendar"><CalendarTodayOutlinedIcon/></span>
                            </div>
                        </Col>
                        <Col md={2}>
                            <div className="d-flex align-items-center justify-content-between">
                                <span>0:00</span>
                                <span className="track-body-content-play"><PlayArrowIcon/></span>
                                <span className="track-body-content-more"><MoreVertIcon/></span>
                            </div>
                        </Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item className="track-body-footer">
                </ListGroup.Item>
            </ListGroup>
        </div>
    )
}

export default TimeTrackerScreen
