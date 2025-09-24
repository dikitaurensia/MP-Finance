import React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./styles.scss";
import "antd/dist/antd.css";
import { Basic, MasterData, Report } from "..";

export default function HomePage(props) {
  return (
    <div className="kanban-wrapper">
      <div className="kanban">
        <Header />
        <Sidebar />
        <Switch>
          <Route exact path="/app" component={Basic} />
          <Route path="/app/master" component={MasterData} />
          <Route path="/app/report" component={Report} />
        </Switch>
      </div>
    </div>
  );
}
