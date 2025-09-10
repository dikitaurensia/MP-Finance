import React from "react";
import { NavLink } from "react-router-dom";
import EventNote from "@material-ui/icons/EventNote";
class Schedule extends React.Component {
  render() {
    return (
      <NavLink to="/app/schedule" activeClassName="active-area">
        <div className="sidebar-item">
          <EventNote className="icon-sidebar" />
          <span className="label-sidebar">Schedule</span>
        </div>
      </NavLink>
    );
  }
}

export default Schedule;
