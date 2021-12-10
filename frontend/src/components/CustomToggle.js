import React, { useEffect } from "react";
import { Button } from "react-bootstrap";

const CustomToggle = React.forwardRef(({ children, onClick, id, color }, ref) => {
    return (
        <Button variant="outline" className={`${id == "track-header-input-dropdown-md" && "d-inline-block d-sm-none d-md-inline-block"} ${id == "track-header-input-dropdown" && "d-none d-sm-inline-block d-md-none"} ${id == "track-edit-input-dropdown-md" && "d-none d-md-inline-block"} text-truncate shadow-none px-0`} id={id ? id : ""} ref={ref} onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}>
            {children}
        </Button>
    )
});

export default CustomToggle
