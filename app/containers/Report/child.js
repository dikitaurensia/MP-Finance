import React from "react";
import { PageHeader, Tabs } from "antd";

import "antd/dist/antd.css";
import "../../assets/base.scss";
import Delivery from "./Delivery";
import Courier from "./Courier";
import Performa from "./Performa";
import SJalan from "./SJ";
import Presensi from "./Presensi";
import Tolak from "./Tolak";
import Jarak from "./Jarak";
import Checker from "./Checker";

const { TabPane } = Tabs;
const ItemTabs = [
  { name: "Pengiriman", key: 2, comp: Delivery },
  { name: "Poin Kurir", key: 3, comp: Courier },
  { name: "Performa", key: 4, comp: Performa },
  { name: "Gudang", key: 5, comp: SJalan },
  { name: "Presensi", key: 6, comp: Presensi },
  { name: "Tolak", key: 7, comp: Tolak },
  { name: "Jarak", key: 8, comp: Jarak },
  { name: "Checker", key: 9, comp: Checker },
];
class Child extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <section className="kanban__main">
          <section className="kanban__nav">
            <PageHeader
              className="site-page-header"
              onBack={() => window.history.back()}
              title="Report"
            />
            <div className="kanban__nav-wrapper" />
          </section>
          <div className="kanban__main-wrapper">
            <Tabs>
              {ItemTabs.map((tab) => (
                <TabPane tab={tab.name} key={tab.key}>
                  <tab.comp />
                </TabPane>
              ))}
            </Tabs>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Child;
