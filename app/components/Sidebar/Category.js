import React from "react";
import { NavLink } from "react-router-dom";
import Bookmark from "@material-ui/icons/Bookmark";

class Category extends React.Component {
  render() {
    return (
      <NavLink to="/app/product-category" activeClassName="active-area">
        <div className="kanban__sidebar-settings">
          <Bookmark />
          <span className="label-sidebar">Category</span>
        </div>
      </NavLink>
    );
  }
}

export default Category;
