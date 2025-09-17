import React, { Component } from "react";
import SalesInvoiceTable from "./child";
import "al-styles/main.scss";
import "al-styles/base.scss";
import "al-styles/components/nav.scss";
export default class MasterData extends Component {
  render() {
    return <SalesInvoiceTable />;
  }
}
