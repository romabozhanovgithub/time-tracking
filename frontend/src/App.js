import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/Header.js";
import Sidebar from "./components/Sidebar.js";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import TimeTrackerScreen from "./screens/TimeTrackerScreen";
import TasksScreen from "./screens/TasksScreen";
import CalendarScreen from "./screens/CalendarScreen";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

function App() {
  return (
    <Router>
      <Header/>
      <Sidebar/>
      <Route path="/login" exact component={LoginScreen}/>
      <Route path="/register" exact component={RegisterScreen}/>
      <div className="wrapper">
        <Route path="/" exact component={TimeTrackerScreen}/>
        <Route path="/calendar" exact component={CalendarScreen}/>
        <Route path="/tasks" exact component={TasksScreen}/>
      </div>
    </Router>
  );
}

export default App;
