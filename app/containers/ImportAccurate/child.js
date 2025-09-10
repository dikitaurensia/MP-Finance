import React from "react";
import {
  PageHeader,
  Button,
  Tag,
  Space,
  Popconfirm,
  Input,
  Tabs,
  Select,
} from "antd";
import "antd/dist/antd.css";
import "../../assets/base.scss";
import {
  get,
  getDataFromAccurate,
  postDataToAccurate2,
} from "../../service/endPoint";
import "al-styles/csvhtml.scss";
import { ErrorMessage, SuccessMessage } from "../../helper/publicFunction";

import Papa from "papaparse";
import { Table, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      databases: [],
      selectDB: 0,
      dataJO: [],
      dataRO: [],
      columns: {
        jo: [
          {
            title: "Tanggal",
            dataIndex: "transDate",
            key: "transDate",
            width: 300,
          },
          {
            title: "No Pekerjaan pesanan",
            dataIndex: "number",
            key: "number",
            width: 300,
          },
          {
            title: "Kode Barang",
            dataIndex: "itemNo",
            key: "itemNo",
            width: 300,
          },
          {
            title: "Kuantitas",
            dataIndex: "quantity",
            key: "quantity",
            width: 300,
          },
          {
            title: "Gudang",
            dataIndex: "warehouseName",
            key: "warehouseName",
            width: 300,
          },
          {
            title: "Cabang",
            dataIndex: "branchName",
            key: "branchName",
            width: 300,
          },
        ],
        ro: [
          {
            title: "Tanggal",
            dataIndex: "transDate",
            key: "transDate",
            width: 300,
          },
          {
            title: "No Pekerjaan pesanan",
            dataIndex: "jobOrderNumber",
            key: "jobOrderNumber",
            width: 300,
          },
          {
            title: "No Penyelesaian",
            dataIndex: "number",
            key: "number",
            width: 300,
          },
          {
            title: "Tipe Penyelesaian",
            dataIndex: "rollOverType",
            key: "rollOverType",
            width: 300,
          },
          {
            title: "Kode Barang",
            dataIndex: "itemNo",
            key: "itemNo",
            width: 300,
          },
          {
            title: "Kuantitas",
            dataIndex: "quantity",
            key: "quantity",
            width: 300,
          },
          {
            title: "Porsi",
            dataIndex: "portion",
            key: "portion",
            width: 300,
          },
          {
            title: "Gudang",
            dataIndex: "warehouseName",
            key: "warehouseName",
            width: 300,
          },
          {
            title: "Cabang",
            dataIndex: "branchName",
            key: "branchName",
            width: 300,
          },
        ],
      },
    };
    this.getDatabase = this.getDatabase.bind(this);
    this.changeDB = this.changeDB.bind(this);
    this.handleFileUploadJO = this.handleFileUploadJO.bind(this);
    this.handleFileUploadRO = this.handleFileUploadRO.bind(this);

    this.handleButtonClickJO = this.handleButtonClickJO.bind(this);
    this.handleButtonClickRO = this.handleButtonClickRO.bind(this);
  }

  componentDidMount() {
    this.getDatabase();
  }

  changeDB(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  getDatabase = () => {
    const tableName = "accurate";

    let getData = get(tableName);
    getData
      .then((response) => {
        this.setState({
          databases: response.data,
          selectDB: response.data[0].id,
        });
      })
      .catch((error) => {
        ErrorMessage(error);
      })
      .finally(() => {});
  };

  transformDataJO(inputArray) {
    // Extract common properties from the first element
    const { transDate, branchName, number } = inputArray[0];

    // Create the transformed object
    const transformedData = {
      transDate,
      branchName,
      number,
      detailItem: inputArray.map(({ itemNo, quantity, warehouseName }) => ({
        itemNo,
        quantity,
        warehouseName,
      })),
    };

    return transformedData;
  }

  transformDataRO(inputArray) {
    // Extract common properties from the first element
    const {
      transDate,
      branchName,
      number,
      jobOrderNumber,
      rollOverType,
    } = inputArray[0];

    // Create the transformed object
    const transformedData = {
      transDate,
      branchName,
      number,
      jobOrderNumber,
      rollOverType,
      detailItem: inputArray.map(
        ({ itemNo, quantity, portion, warehouseName }) => ({
          itemNo,
          quantity,
          portion,
          warehouseName,
        })
      ),
    };

    return transformedData;
  }

  handleButtonClickJO = () => {
    const { dataJO } = this.state;
    if (!dataJO.length) {
      ErrorMessage({ message: "Data is empty!" });
      return;
    }
    const data = this.transformDataJO(dataJO);

    const db = this.state.databases.find((x) => x.id === this.state.selectDB);
    let { token, host, session } = db;

    const body = {
      session,
      token,
      api_url: `${host}/accurate/api/job-order/save.do`,
      body: JSON.stringify(data),
    };
    const getData = postDataToAccurate2(body);
    getData
      .then((response) => {
        if (!response.s) {
          const err = response.d[0];
          ErrorMessage({ message: err });
          return;
        }
        SuccessMessage("File successfully Imported!");
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  };

  handleButtonClickRO = () => {
    const { dataRO } = this.state;
    if (!dataRO.length) {
      ErrorMessage({ message: "Data is empty!" });
      return;
    }
    const data = this.transformDataRO(dataRO);
    const db = this.state.databases.find((x) => x.id === this.state.selectDB);
    let { token, host, session } = db;

    const body = {
      session,
      token,
      api_url: `${host}/accurate/api/roll-over/save.do`,
      body: JSON.stringify(data),
    };
    const getData = postDataToAccurate2(body);
    getData
      .then((response) => {
        if (!response.s) {
          const err = response.d[0];
          ErrorMessage({ message: err });
          return;
        }
        SuccessMessage("File successfully Imported!");
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  };

  handleFileUploadJO = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          ErrorMessage("Error parsing the CSV file");
          return;
        }
        this.setState({ dataJO: result.data });
        SuccessMessage("File successfully loaded!");
      },
    });
    return false; // Prevent default upload behavior
  };

  handleFileUploadRO = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          ErrorMessage("Error parsing the CSV file");
          return;
        }
        this.setState({ dataRO: result.data });
        SuccessMessage("File successfully loaded!");
      },
    });
    return false; // Prevent default upload behavior
  };

  render() {
    const { dataRO, dataJO, columns } = this.state;
    return (
      <React.Fragment>
        <section className="kanban__main">
          <section className="kanban__nav">
            <PageHeader
              className="site-page-header"
              onBack={() => window.history.back()}
              title="Import Accurate"
            />
            <div className="kanban__nav-wrapper" />
          </section>
          <div className="kanban__main-wrapper">
            <Tabs defaultActiveKey="1">
              <TabPane tab="Import Pekerjaan Pesanan" key="1">
                <div style={{ padding: "20px" }}>
                  <Upload.Dragger
                    beforeUpload={this.handleFileUploadJO}
                    accept=".csv"
                    maxCount={1}
                    showUploadList={false}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag a CSV file to upload
                    </p>
                    <p className="ant-upload-hint">
                      Only CSV files are supported.
                    </p>
                  </Upload.Dragger>
                  <Table
                    dataSource={dataJO}
                    columns={columns["jo"]}
                    style={{ marginTop: "20px" }}
                    pagination={{ pageSize: 10 }}
                  />
                  <Space style={{ marginTop: "20px" }}>
                    <Select
                      allowClear
                      style={{ width: "300px" }}
                      value={this.state.selectDB}
                      onChange={(value) =>
                        this.changeDB({ target: { name: "selectDB", value } })
                      }
                    >
                      {this.state.databases.map((Item) => (
                        <Select.Option value={Item.id} key={Item.id}>
                          {Item.dbname}
                        </Select.Option>
                      ))}
                    </Select>
                    <Button type="primary" onClick={this.handleButtonClickJO}>
                      Import Data
                    </Button>
                    <Button
                      onClick={() => {
                        this.setState({
                          dataJO: [],
                        });
                        message.success("Table reset successfully!");
                      }}
                    >
                      Reset Table
                    </Button>
                  </Space>
                </div>
              </TabPane>
              <TabPane tab="Import Penyelesaian Pesanan" key="2">
                <div style={{ padding: "20px" }}>
                  <Upload.Dragger
                    beforeUpload={this.handleFileUploadRO}
                    accept=".csv"
                    maxCount={1}
                    showUploadList={false}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag a CSV file to upload
                    </p>
                    <p className="ant-upload-hint">
                      Only CSV files are supported.
                    </p>
                  </Upload.Dragger>
                  <Table
                    dataSource={dataRO}
                    columns={columns["ro"]}
                    style={{ marginTop: "20px" }}
                    pagination={{ pageSize: 10 }}
                  />
                  <Space style={{ marginTop: "20px" }}>
                    <Select
                      allowClear
                      style={{ width: "300px" }}
                      value={this.state.selectDB}
                      onChange={(value) =>
                        this.changeDB({ target: { name: "selectDB", value } })
                      }
                    >
                      {this.state.databases.map((Item) => (
                        <Select.Option value={Item.id} key={Item.id}>
                          {Item.dbname}
                        </Select.Option>
                      ))}
                    </Select>
                    <Button type="primary" onClick={this.handleButtonClickRO}>
                      Import Data
                    </Button>
                    <Button
                      onClick={() => {
                        this.setState({
                          dataRO: [],
                        });
                        message.success("Table reset successfully!");
                      }}
                    >
                      Reset Table
                    </Button>
                  </Space>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Child;
