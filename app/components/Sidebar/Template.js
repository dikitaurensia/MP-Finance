import React from "react";
import { NavLink } from "react-router-dom";
import BookOutlined from "@material-ui/icons/BookOutlined";
class Template extends React.Component {
  render() {
    return (
      <NavLink to="/app/template" activeClassName="active-area">
        <div className="sidebar-item">
          <BookOutlined className="icon-sidebar" />
          <span className="label-sidebar">Template</span>
        </div>
      </NavLink>
    );
  }
}

export default Template;
