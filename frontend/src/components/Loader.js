import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = ({ loaderSize }) => {
    return (
        <Spinner animation="border" variant="primary" role="status" style={{
            height: loaderSize ? loaderSize : "100px",
            width: loaderSize ? loaderSize : "100px",
            margin: "auto",
            display: "block"
        }}>
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )
}

export default Loader
