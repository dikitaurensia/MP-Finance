import React from "react";
import { NavLink } from "react-router-dom";
import Label from "@material-ui/icons/Label";

class Merk extends React.Component {
  render() {
    return (
      <NavLink to="/app/merks" activeClassName="active-area">
        <div className="kanban__sidebar-settings">
          <Label />
          <span className="label-sidebar">Merk</span>
        </div>
      </NavLink>
    );
  }
}

export default Merk;
