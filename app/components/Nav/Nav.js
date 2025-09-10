import React from "react";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { Button, DatePicker } from "antd";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "./Nav.scss";
import { FORMAT_DATE } from "../../helper/constanta";
function DatePickerComponent({ }) {
  return <Button>Date Pickker</Button>;
}
class Nav extends React.Component {
  render() {
    let { startDate, prevNextDay, changeDate } = this.props;
    return (
      <React.Fragment>
        <div className="kanban__nav-wrapper card-kanban">
          <button
            className="date yesterday"
            name="yesterday"
            onClick={() => prevNextDay("yesterday")}
          >
            <LeftCircleOutlined
              style={{ fontSize: "24px", color: "#08c", marginRight: 5 }}
            />
            <span className="label-btn">Yesterday</span>
          </button>

          <DatePicker
            clearIcon
            showToday
            value={moment(startDate, FORMAT_DATE)}
            format={FORMAT_DATE}
            defaultValue={moment(startDate, FORMAT_DATE)}
            onChange={(date, dateString) => changeDate(dateString)}
          />
          <button
            className="date tomorrow"
            name="tomorrow"
            onClick={() => prevNextDay("tomorrow")}
          >
            <span className="label-btn">Tomorrow</span>
            <RightCircleOutlined
              style={{ fontSize: "24px", color: "#08c", marginLeft: 5 }}
            />
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default Nav;
