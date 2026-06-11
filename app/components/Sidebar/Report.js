import React from "react";
import { NavLink } from "react-router-dom";
import Assessment from "@material-ui/icons/Assessment";
class Report extends React.Component {
  render() {
    return (
      <NavLink to="/app/report" activeClassName="active-area">
        <div className="sidebar-item">
          <Assessment className="icon-sidebar" />
          <span className="label-sidebar">Reports</span>
        </div>
      </NavLink>
    );
  }
}

export default Report;
