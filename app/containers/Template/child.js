import React from "react";
import "antd/dist/antd.css";
import { PageHeader } from "antd";

class Template extends React.Component {
  render() {
    return (
      <React.Fragment>
        <section className="kanban__main">
          <section className="kanban__nav">
            <PageHeader
              className="site-page-header"
              onBack={() => window.history.back()}
              title="Template"
            />
          </section>

          <div className="kanban__main-wrapper">Coming soon</div>
        </section>
      </React.Fragment>
    );
  }
}

export default Template;
