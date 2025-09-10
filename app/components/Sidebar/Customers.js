import React from "react";
import { NavLink } from "react-router-dom";
import PeopleIcon from "@material-ui/icons/People";
class Customers extends React.Component {
  render() {
    return (
      <NavLink to="/app/customer" activeClassName="active-area">
        <div className="sidebar-item">
          <PeopleIcon className="icon-sidebar" />
          <span className="label-sidebar">Customer</span>
        </div>
      </NavLink>
    );
  }
}

export default Customers;
