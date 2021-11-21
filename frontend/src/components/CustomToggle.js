import React, { useEffect } from "react";
import { Button } from "react-bootstrap";

const CustomToggle = React.forwardRef(({ children, onClick, id }, ref) => {
    return (
        <Button variant="outline" className="shadow-none px-0" id={id ? id : ""} ref={ref} onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}>
            {children}
        </Button>
    )
});

export default CustomToggle
