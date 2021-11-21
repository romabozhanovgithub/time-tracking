import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import GridOnIcon from "@material-ui/icons/GridOn";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import ListAltIcon from "@material-ui/icons/ListAlt";
import BookmarkOutlinedIcon from "@material-ui/icons/BookmarkOutlined";
import "../index.css"

const Sidebar = () => {
    useEffect(() => {

    }, []);

    return (
        <div id="sidebar" className="sidebar shadow">
            <span className="logo">Logo</span>
            <NavLink to="/timetracker" activeClassName="active">
                <AccessTimeIcon/>
                <span>TIME TRACKER</span>
            </NavLink>
            <NavLink to="/timesheet" activeClassName="active">
                <GridOnIcon/>
                <span>TIMESHEET</span>
            </NavLink>
            <NavLink to="/calendar" activeClassName="active">
                <CalendarTodayIcon/>
                CALENDAR
            </NavLink>
            <span className="divider"></span>
            <NavLink to="/dashboard" activeClassName="active">
                <AssessmentOutlinedIcon/>
                DASHBOARD
            </NavLink>
            <NavLink to="/tasks" activeClassName="active">
                <ListAltIcon/>
                TASKS
            </NavLink>
            <NavLink to="/notations" activeClassName="active">
                <BookmarkOutlinedIcon/>
                NOTATIONS
            </NavLink>
        </div>
    )
}

export default Sidebar
