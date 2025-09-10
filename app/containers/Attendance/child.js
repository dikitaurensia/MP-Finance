import React, { createRef } from "react";
import { PageHeader } from "antd";
import "antd/dist/antd.css";
import "../../assets/base.scss";

import BarcodeScannerComponent from "react-qr-barcode-scanner";
import moment from "moment";
import "moment/locale/id"; // Import Indonesian locale

// import QrFrame from "../assets/qr-frame.svg";
class Child extends React.Component {
  constructor(props) {
    super(props);
    moment.locale("id");
    this.state = {
      data: "No result",
      currentTime: moment().format("LLLL"),
    };
  }

  handleScan = (result) => {
    if (result) {
      this.setState({ data: result });
    }
  };

  handleError = (error) => {
    console.error(error);
  };

  componentDidMount() {
    this.timerID = setInterval(() => this.updateTime(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  updateTime() {
    this.setState({
      currentTime: moment().format("LLLL"),
    });
  }

  render() {
    return (
      <React.Fragment>
        <section className="kanban__main">
          <section className="kanban__nav">
            <div className="kanban__nav-wrapper">
              <PageHeader
                className="site-page-header"
                onBack={() => window.history.back()}
                title="Attendance"
              />
            </div>
          </section>

          <div className="container">
            <header className="header">
              <h1>Attendance Mitran Pack</h1>
            </header>

            <p className="description">{this.state.currentTime} </p>

            <div className="image-container">
              <BarcodeScannerComponent
                onUpdate={(err, result) => {
                  if (result) this.handleScan(result.text);
                  else this.handleError("Not Found");
                }}
              />
            </div>

            <div className="tips">
              <p>Scan QR yang ada di aplikasi kurir.</p>
            </div>

            <div className="tips">
              <p>{this.state.data}</p>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Child;
