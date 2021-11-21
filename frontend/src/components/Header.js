import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Header = () => {
    return (
        <header>
            <Navbar bg="light" variant="light" expand="lg">
                <Container>
                    <Navbar.Brand>Brand</Navbar.Brand>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
