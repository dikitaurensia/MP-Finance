import React from "react";
import { MODE_LOGIN } from "../../helper/constanta";
import Master from "./MasterData";
import "al-styles/components/sidebar.scss";
class Sidebar extends React.Component {
  render() {
    let mode = localStorage.getItem(MODE_LOGIN);
    return (
      <section className="kanban__sidebar">
        <div className="kanban__sidebar-menu">
          <Master />
        </div>
      </section>
    );
  }
}

export default Sidebar;
