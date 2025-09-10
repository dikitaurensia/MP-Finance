import React from "react";
import { NavLink } from "react-router-dom";
import Palette from "@material-ui/icons/Palette";

class Color extends React.Component {
  render() {
    return (
      <NavLink to="/app/colors" activeClassName="active-area">
        <div className="kanban__sidebar-settings">
          <Palette />
          <span className="label-sidebar">Color</span>
        </div>
      </NavLink>
    );
  }
}

export default Color;
