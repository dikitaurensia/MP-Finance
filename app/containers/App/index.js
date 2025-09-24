import React from "react";
import { Switch, Route } from "react-router-dom";

import GlobalStyle from "../../global-styles";
import { HomePage, NotFoundPage, Auth } from "..";
import "../../assets/base.scss";
import { PrivateRoute } from "../../helper/PrivateRoute";
import { PublicRoute } from "../../helper/PublicRoute";
export default function App() {
  return (
    <React.Fragment>
      <Switch>
        <PublicRoute exact path="/" component={Auth} />
        <PrivateRoute path="/app" component={HomePage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </React.Fragment>
  );
}
