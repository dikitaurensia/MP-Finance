import React from "react";
import { NavLink } from "react-router-dom";
import FingerprintIcon from "@material-ui/icons/Fingerprint";
class Presensi extends React.Component {
  render() {
    return (
      <NavLink to="/app/presensi" activeClassName="active-area">
        <div className="sidebar-item">
          <FingerprintIcon className="icon-sidebar" />
          <span className="label-sidebar">Presensi</span>
        </div>
      </NavLink>
    );
  }
}

export default Presensi;
