import React from "react";
import { PageHeader, Tabs } from "antd";

import "antd/dist/antd.css";
import "../../assets/base.scss";
import HistoryCall from "./history-call";

const { TabPane } = Tabs;
const ItemTabs = [{ name: "History Call", key: 1, comp: HistoryCall }];
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
