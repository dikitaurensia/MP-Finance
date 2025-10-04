import React from "react";
import { MODE_LOGIN } from "../../helper/constanta";
import Master from "./MasterData";
import "al-styles/components/sidebar.scss";
import Report from "./Report";
import Template from "./Template";

class Sidebar extends React.Component {
  render() {
    let mode = localStorage.getItem(MODE_LOGIN);
    return (
      <section className="kanban__sidebar">
        <div className="kanban__sidebar-menu">
          <Master />
          <Report />
          <Template />
        </div>
      </section>
    );
  }
}

export default Sidebar;
