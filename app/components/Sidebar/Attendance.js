import React from "react";
import { NavLink } from "react-router-dom";
import ChromeReaderMode from "@material-ui/icons/ChromeReaderMode";
class Attendance extends React.Component {
  render() {
    return (
      <NavLink exact to="/app/attendance" activeClassName="active-area">
        <div className="sidebar-item">
          <ChromeReaderMode className="icon-sidebar" />
          <span className="label-sidebar">Attendance</span>
        </div>
      </NavLink>
    );
  }
}

export default Attendance;
