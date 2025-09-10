import React from "react";
import { NavLink } from "react-router-dom";
import ImportExport from "@material-ui/icons/ImportExport";
class ImportAccurate extends React.Component {
  render() {
    return (
      <NavLink exact to="/app/import-accurate" activeClassName="active-area">
        <div className="sidebar-item">
          <ImportExport className="icon-sidebar" />
          <span className="label-sidebar">Import</span>
        </div>
      </NavLink>
    );
  }
}

export default ImportAccurate;
