import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import GridOnIcon from "@material-ui/icons/GridOn";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import ListAltIcon from "@material-ui/icons/ListAlt";
import BookmarkOutlinedIcon from "@material-ui/icons/BookmarkOutlined";
import CloseIcon from "@material-ui/icons/Close";
import AccountBoxOutlinedIcon from "@material-ui/icons/AccountBoxOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import { logout } from "../actions/userActions";
import "../index.css"

const Sidebar = () => {
    const location = useLocation();

    const sidebarHandler = () => {
        document.getElementById("sidebar").style.left = "-250px";
    }

    const dispatch = useDispatch();

    useEffect(() => {
        
    }, []);

    const logoutHandler = () => {
        dispatch(logout())
    }

    return (
        <div id="sidebar" className={`sidebar shadow ${(location.pathname.includes("/login") || location.pathname.includes("/register")) ? "d-none" : "d-lg-block"}`}>
            <span className="d-flex justify-content-between">
                <span className="logo">Logo</span>
                <span className="d-flex justify-content-between d-xl-none sidebar-close" onClick={sidebarHandler}>
                    <CloseIcon/>
                </span>
            </span>
            <NavLink to="/timetracker" activeClassName="active" onClick={sidebarHandler}>
                <AccessTimeIcon/>
                TIME TRACKER
            </NavLink>
            <NavLink to="/timesheet" activeClassName="active" onClick={sidebarHandler}>
                <GridOnIcon/>
                TIMESHEET
            </NavLink>
            <NavLink to="/calendar" activeClassName="active" onClick={sidebarHandler}>
                <CalendarTodayIcon/>
                CALENDAR
            </NavLink>
            <span className="divider"></span>
            <NavLink to="/dashboard" activeClassName="active" onClick={sidebarHandler}>
                <AssessmentOutlinedIcon/>
                DASHBOARD
            </NavLink>
            <NavLink to="/tasks" activeClassName="active" onClick={sidebarHandler}>
                <ListAltIcon/>
                TASKS
            </NavLink>
            <NavLink to="/notations" activeClassName="active" onClick={sidebarHandler}>
                <BookmarkOutlinedIcon/>
                NOTATIONS
            </NavLink>
            <span className="divider"></span>
            <Accordion>
                <Accordion.Item className="border-0 shadow-none" eventKey="1">
                    <Accordion.Header>
                        <AccountBoxOutlinedIcon/>
                        PROFILE
                    </Accordion.Header>
                    <Accordion.Body className="px-0">
                        <NavLink to="/profile" activeClassName="active" onClick={sidebarHandler}>
                            <AccountBoxOutlinedIcon/>
                            PROFILE
                        </NavLink>
                        <NavLink to="/login" activeClassName="active" onClick={logoutHandler}>
                            <ExitToAppOutlinedIcon/>
                            LOGOUT
                        </NavLink>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export default Sidebar
