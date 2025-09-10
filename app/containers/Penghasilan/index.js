import React, { Component } from "react";
import Child from "./child";
import "al-styles/main.scss";
import "al-styles/base.scss";
import "al-styles/components/nav.scss";
export default class Penghasilan extends Component {
  render() {
    return <Child {...this.props} />;
  }
}
