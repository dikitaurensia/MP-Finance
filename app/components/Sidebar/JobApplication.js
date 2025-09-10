import React from "react";
import { NavLink } from "react-router-dom";
import WorkIcon from "@material-ui/icons/Work";
class JobApplication extends React.Component {
  render() {
    return (
      <NavLink to="/app/jobapplication" activeClassName="active-area">
        <div className="sidebar-item">
          <WorkIcon className="icon-sidebar" />
          <span className="label-sidebar">Job Application</span>
        </div>
      </NavLink>
    );
  }
}

export default JobApplication;
