import React, { Component } from "react";
import { Modal, Select, Form } from "antd";
// import Modal from "antd/lib/Modal";
// import Select from "antd/lib/Select";
// import Form from "antd/lib/Form";
import "antd/dist/antd.css";
import { get, create, sendNotif } from "../../../service/endPoint";
import {
  getDistance,
  ErrorMessage,
  getCoor,
  SuccessMessage,
} from "../../../helper/publicFunction";
import * as turf from "@turf/turf";
import { COORDINATE_MP_ARR } from "../../../helper/constanta";

const { Option } = Select;
export default class SearchCourier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      fetching: false,
      body: {
        arinvoiceid: null,
        kuririd: null,
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSearch = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      body: {
        ...this.state.body,
        [name]: value,
      },
    });
  };
  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      body: {
        ...this.state.body,
        [name]: value,
      },
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    let { body } = this.state;
    let { coordinate } = this.props.rowdata;

    let jarak = (getDistance(getCoor(aa.coordinate, "lat"), getCoor(aa.coordinate, "long")) + 2.32).toFixed(1) / 1

    let process = create("process", { ...body, jarak });
    process
      .then((response) => {
        this.props.onCancel();
        SuccessMessage();
      })
      .then(() => {
        let body = {
          to: "/topics/checker",
          collapse_key: "type_a",
          notification: {
            body: "Pengiriman Baru",
            title: "Mitran Pack",
            click_action: "MAIN_ACTIVITY",
          },
          data: {
            body: "Pengiriman Baru",
            title: "Mitran Pack",
          },
        };
        let pushNotif = sendNotif(body);
        pushNotif
          .then((response) => {
            console.log({
              status: "Berhasil",
              data: response,
            });
          })
          .catch((error) => {
            console.log({
              status: "Error",
              data: error,
            });
          });
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  };
  static getDerivedStateFromProps(props, state) {
    if (props.arinvoiceid !== state.body.arinvoiceid) {
      return {
        dataSource: props.dataSource,
        body: {
          ...state.body,
          arinvoiceid: props.rowdata ? props.rowdata.arinvoiceid : null,
        },
      };
    }
  }
  render() {
    const { onOk, onCancel, onChange, visible, body } = this.props;
    const { dataSource } = this.state;
    return (
      <Modal
        title="Search Courier"
        onCancel={onCancel}
        onOk={this.handleSubmit}
        visible={visible}
      >
        <Form>
          <Form.Item label="Pilih kurir">
            <Select
              showSearch
              value={this.state.body.kuririd}
              placeholder="Pilih kurir"
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              optionFilterProp="children"
              onSearch={(e) =>
                this.handleSearch({
                  target: {
                    value: e,
                    name: "kuririd",
                  },
                })
              }
              onChange={(e) =>
                this.handleChange({
                  target: {
                    value: e,
                    name: "kuririd",
                  },
                })
              }
              notFoundContent={null}
              loading={this.state.fetching}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {dataSource.map((data) => (
                <Option key={data.id} value={data.id}>
                  {data.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
