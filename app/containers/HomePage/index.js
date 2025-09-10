import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./styles.scss";
import "antd/dist/antd.css";
import {
  Customers,
  Basic,
  Courier,
  Report,
  Schedule,
  Settings,
  MasterData,
  JobApplication,
  Employees,
  Penghasilan,
  Presensi,
  Accurate,
  Attendance,
  Category,
  Banners,
  Merk,
  Color,
  ImportAccurate,
  Users,
  // Checker
} from "..";


export default function HomePage(props) {
  const [state, setstate] = useState({
    modalChat: false,
  });
  const showCloseModal = (e) => {
    setstate((prevState) => ({
      ...prevState,
      [e.name]: !state[e.name],
    }));
  };

  return (
    <div className="kanban-wrapper">
      <div className="kanban">
        {/* <Logo /> */}
        <Header />
        <Sidebar />
        <Switch>
          <Route exact path="/app" component={Basic} />
          <Route path="/app/customer" component={Customers} />
          <Route path="/app/courier" component={Courier} />
          <Route path="/app/report" component={Report} />
          <Route path="/app/schedule" component={Schedule} />
          <Route path="/app/settings" component={Settings} />
          <Route path="/app/master" component={MasterData} />
          <Route
            path="/app/jobapplication"
            component={JobApplication}
            {...props}
          />
          <Route path="/app/penghasilan" component={Penghasilan} />
          <Route path="/app/presensi" component={Presensi} />
          <Route path="/app/employees" component={Employees} {...props} />
          <Route path="/app/accurate" component={Accurate} />
          <Route path="/app/attendance" component={Attendance} />

          {/* <Route path="/app/checker" component={Checker} /> */}

          <Route path="/app/users" component={Users} />
          <Route path="/app/product-category" component={Category} />
          <Route path="/app/banners" component={Banners} />
          <Route path="/app/merks" component={Merk} />
          <Route path="/app/colors" component={Color} />
          <Route path="/app/import-accurate" component={ImportAccurate} />
        </Switch>
      </div>
    </div>
  );
}
