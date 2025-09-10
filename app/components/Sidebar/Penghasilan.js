import React from "react";
import { NavLink } from "react-router-dom";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
class Penghasilan extends React.Component {
  render() {
    return (
      <NavLink to="/app/penghasilan" activeClassName="active-area">
        <div className="sidebar-item">
          <MonetizationOnIcon className="icon-sidebar" />
          <span className="label-sidebar">Penghasilan</span>
        </div>
      </NavLink>
    );
  }
}

export default Penghasilan;
