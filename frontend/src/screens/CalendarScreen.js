import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Button, InputGroup, FormControl, Dropdown, Form, Table } from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const CalendarScreen = () => {
    const [scroll, setScroll] = useState(false);
    const [calendarTable, setCalendarTable] = useState([]);
    const [num, setNum] = useState(24);

    useEffect(() => {

    }, []);

    const select_scroll_2 = (e) => {
        const s1 = document.getElementById("calendar-table-header");
        const s2 = document.getElementById("calendar-table-body");

        s1.scrollLeft = s2.scrollLeft;

        setScroll(true);

        setTimeout(() => {
            setScroll(false);
        }, 500);
    }

    return (
        <div>
            <div className="d-flex justify-content-between calendar-header">
                <span className="tasks-header-title"><h2>Calendar</h2></span>
            </div>
            <div className="calendar">
                <div className="calendar-table-header" id="calendar-table-header">
                    <Table bordered>
                        <thead>
                            <tr className="rounded calendar-body-header">
                                <th className="calendar-body-header-size">
                                    <span className="d-flex justify-content-center">
                                        <span className="rounded-start calendar-body-header-size-remove"><RemoveIcon/></span>
                                        <span className="rounded-end calendar-body-header-size-add" onClick={() => setNum(12)}><AddIcon/></span>
                                    </span>
                                </th>
                                <th className="calendar-body-header-name"><span className="d-flex justify-content-center">Monday</span></th>
                                <th className="calendar-body-header-name"><span className="d-flex justify-content-center">Tuesday</span></th>
                                <th className="calendar-body-header-name"><span className="d-flex justify-content-center">Wednesday</span></th>
                                <th className="calendar-body-header-name"><span className="d-flex justify-content-center">Thursday</span></th>
                                <th className="calendar-body-header-name"><span className="d-flex justify-content-center">Friday</span></th>
                                <th className="calendar-body-header-name"><span className="d-flex justify-content-center">Saturday</span></th>
                                <th className="calendar-body-header-name"><span className="d-flex justify-content-center">Sunday</span></th>
                            </tr>
                        </thead>
                    </Table>
                </div>
                <div className={`calendar-table-body ${scroll && "scroll"}`} id="calendar-table-body" onScroll={select_scroll_2}>
                    <Table bordered>
                        <tbody className="calendar-body-table-body">
                            {[...Array(num)].map((e, key) => (
                                <tr className="calendar-row" key={key}>
                                    <td className="calendar-body-size calendar-time">
                                        <span className="d-flex justify-content-end">{`${key}`}:00</span>
                                    </td>
                                    <td className="calendar-body-name"></td>
                                    <td className="calendar-body-name"></td>
                                    <td className="p-0 calendar-body-name">
                                        {
                                            (key == 5) && (
                                                <div className="d-flex rounded test" id="test-block">
                                                    <span className="d-inline-block side"></span>
                                                    <span className="calendar-task-content">
                                                        <span className="text-wrap calendar-task-content-description">
                                                            Description dasdada dasd dasdada
                                                        </span>
                                                        <div className="text-wrap">
                                                            Task
                                                        </div>
                                                    </span>
                                                </div>
                                            )
                                        }
                                    </td>
                                    <td className="calendar-body-name"></td>
                                    <td className="calendar-body-name"></td>
                                    <td className="calendar-body-name"></td>
                                    <td className="calendar-body-name"></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default CalendarScreen
