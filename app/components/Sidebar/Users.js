import React from "react";
import { NavLink } from "react-router-dom";
import TagFaces from "@material-ui/icons/TagFaces";

class Users extends React.Component {
  render() {
    return (
      <NavLink to="/app/users" activeClassName="active-area">
        <div className="kanban__sidebar-settings">
          <TagFaces />
          <span className="label-sidebar">User</span>
        </div>
      </NavLink>
    );
  }
}

export default Users;
