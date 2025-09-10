import React from "react";
import { NavLink } from "react-router-dom";
import BurstMode from "@material-ui/icons/BurstMode";

class Banners extends React.Component {
  render() {
    return (
      <NavLink to="/app/banners" activeClassName="active-area">
        <div className="kanban__sidebar-settings">
          <BurstMode />
          <span className="label-sidebar">Banners</span>
        </div>
      </NavLink>
    );
  }
}

export default Banners;
