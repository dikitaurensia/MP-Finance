import React from "react";
import { NavLink } from "react-router-dom";
import ShareIcon from "@material-ui/icons/Share";

const Accurate = () => {
  return (
    <NavLink exact to="/app/accurate" activeClassName="active-area">
      <div className="sidebar-item">
        <ShareIcon className="icon-sidebar" />
        <span className="label-sidebar">Accurate</span>
      </div>
    </NavLink>
  );
};

export default Accurate;
