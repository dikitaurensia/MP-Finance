import React from "react";
import { NavLink } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";

class Employees extends React.Component {
  render() {
    return (
      <NavLink to="/app/employees" activeClassName="active-area">
        <div className="sidebar-item">
          <PersonIcon className="icon-sidebar" />
          <span className="label-sidebar">Employees</span>
        </div>
      </NavLink>
    );
  }
}

export default Employees;
