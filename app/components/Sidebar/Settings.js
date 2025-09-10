import React from "react";
import { NavLink } from "react-router-dom";
import Setting from "@material-ui/icons/Settings";
class Settings extends React.Component {
  render() {
    return (
      <NavLink to="/app/settings" activeClassName="active-area">
        <div className="kanban__sidebar-settings">
          <Setting />
          <span className="label-sidebar">Settings</span>
        </div>
      </NavLink>
    );
  }
}

export default Settings;
