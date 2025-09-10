import React from "react";
import Customers from "./Customers.js";
import { MODE_LOGIN } from "../../helper/constanta";
import Reports from "./Reports.js";
import Schedule from "./Schedule";
import Settings from "./Settings";
import Courier from "./Courier";
import Master from "./MasterData";
import JobApplication from "./JobApplication";
import Employees from "./Employees";
import Penghasilan from "./Penghasilan";
import Presensi from "./Presensi";
import "al-styles/components/sidebar.scss";
import Accurate from "./Accurate.js";
import Attendance from "./Attendance.js";
import Users from "./Users.js";
import Category from "./Category.js";
import Banners from "./Banners.js";
import Merk from "./Merk.js";
import Color from "./Color.js";
import Checker from "./Checker.js";
import ImportAccurate from "./Import.js";
class Sidebar extends React.Component {
  render() {
    let mode = localStorage.getItem(MODE_LOGIN);
    return (
      <section className="kanban__sidebar">
        <div className="kanban__sidebar-menu">
          {/* {mode === "supervisor" || mode === "manager" ? <Attendance /> : null} */}
          {/* {mode === "supervisor" || mode === "manager" ? <Accurate /> : null}
          <ImportAccurate /> */}
          <Master />
          {/* <Schedule />
          {mode === "superadmin" ||
          mode === "supervisor" ||
          mode === "manager" ? (
            <Customers />
          ) : null}
          <Courier />
          <Checker />

          {mode === "supervisor" || mode === "manager" ? (
            <JobApplication />
          ) : null}
          {mode === "supervisor" || mode === "manager" ? <Employees /> : null}
          <Presensi />
          <Penghasilan />
          <Reports />

          <Settings /> */}

          {/* <Users />
          <Category />
          <Banners />
          <Merk />
          <Color /> */}
        </div>
      </section>
    );
  }
}

export default Sidebar;
