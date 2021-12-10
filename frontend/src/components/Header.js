import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import MenuIcon from "@material-ui/icons/Menu";

const Header = ({ title }) => {
    const location = useLocation();
    
    const sidebarHandler = () => {
        document.getElementById("sidebar").style.left = "0px";
    }

    return (
        <header>
            <Navbar bg="primary" variant="dark" expand="lg" className={`d-flex align-items-center ${
                (location.pathname.includes("/login") || location.pathname.includes("/register")) ? "d-flex justify-content-center" : "d-xl-none justify-content-between"
            }`}>
                {!(location.pathname.includes("/login") || location.pathname.includes("/register")) && <span className="float-start sidebar-open" onClick={sidebarHandler}><MenuIcon/></span>}
                <Navbar.Brand className="header-title" id="header-title">{title}</Navbar.Brand>
                {!(location.pathname.includes("/login") || location.pathname.includes("/register")) && <span> </span>}
            </Navbar>
        </header>
    )
}

export default Header
