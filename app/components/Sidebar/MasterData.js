import React from "react";
import { NavLink } from "react-router-dom";
import Assessment from "@material-ui/icons/Assessment";
class MasterData extends React.Component {
  render() {
    return (
      <NavLink to="/app/master" activeClassName="active-area">
        <div className="sidebar-item">
          <Assessment className="icon-sidebar" />
          <span className="label-sidebar">Master Data</span>
        </div>
      </NavLink>
    );
  }
}

export default MasterData;
