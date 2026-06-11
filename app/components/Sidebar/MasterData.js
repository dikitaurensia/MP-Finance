import React from "react";
import { NavLink } from "react-router-dom";
import ViewList from "@material-ui/icons/ViewList";
class MasterData extends React.Component {
  render() {
    return (
      <NavLink to="/app/master" activeClassName="active-area">
        <div className="sidebar-item">
          <ViewList className="icon-sidebar" />
          <span className="label-sidebar">Sales Invoice</span>
        </div>
      </NavLink>
    );
  }
}

export default MasterData;
