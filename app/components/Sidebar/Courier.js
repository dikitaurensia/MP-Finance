import React from "react";
import { NavLink } from "react-router-dom";
import Motorcycle from "@material-ui/icons/Motorcycle";
class Boards extends React.Component {
  render() {
    return (
      <NavLink exact to="/app/courier" activeClassName="active-area">
        <div className="sidebar-item">
          <Motorcycle />
          <span className="label-sidebar">Courier</span>
        </div>
      </NavLink>
    );
  }
}

export default Boards;
