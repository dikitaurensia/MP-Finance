import React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./styles.scss";
import "antd/dist/antd.css";
import { Basic, MasterData, Report, Template } from "..";

export default function HomePage(props) {
  return (
    <div className="kanban-wrapper">
      <div className="kanban">
        <Header />
        <Sidebar />
        <Switch>
          <Route exact path="/app" component={MasterData} />
          <Route path="/app/master" component={MasterData} />
          <Route path="/app/report" component={Report} />
          <Route path="/app/template" component={Template} />
        </Switch>
      </div>
    </div>
  );
}
