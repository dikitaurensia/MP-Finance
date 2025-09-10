import React from "react";
import { NavLink } from "react-router-dom";
import AccountCircle from "@material-ui/icons/AccountCircle";
class Boards extends React.Component {
  render() {
    return (
      <NavLink exact to="/app/checker" activeClassName="active-area">
        <div className="sidebar-item">
          <AccountCircle />
          <span className="label-sidebar">Checker</span>
        </div>
      </NavLink>
    );
  }
}

export default Boards;
