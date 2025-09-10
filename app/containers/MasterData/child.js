import React from "react";
import {
  Table,
  Button,
  Space,
  PageHeader,
  Select
} from "antd";

import moment from "moment";
import {
  get,
  getDataFromAccurate,
} from "../../service/endPoint";
import { ErrorMessage, formatCurrency } from "../../helper/publicFunction";
import { PrinterFilled } from "@ant-design/icons";
import { FORMAT_DATE } from "../../helper/constanta";
import autoBind from "react-autobind"
import "../../assets/base.scss";

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "semua",
      startDate: moment().format(FORMAT_DATE),
      modalAdd: false,
      modalSearchCourier: false,
      selectDB: 0,
      databases: [],

      modalTolak: false,
      loading_table: false,
      dataSource: {
        master_data: [],
        courier: [],
        database: [],
        categoryItem: [],
      },
      body: {
        dbId: "",
      },

      column: [
        {
          title: "No",
          dataIndex: "no",
          key: "no",
          width: 50,
          render: (value, item, index) => {
            return this.pagesize + index + 1;
          },
        },
        {
          title: "Nama Customer",
          dataIndex: "customerName",
          key: "customerName",
          width: 250,
        },
        {
          title: "No Invoice",
          dataIndex: "number",
          key: "number",
          width: 150,
        },
        {
          title: "No SJ",
          dataIndex: "deliveryPackingNumber",
          key: "deliveryPackingNumber",
          width: 150,
        },
        {
          title: "Total Invoice",
          dataIndex: "totalAmount",
          key: "totalAmount",
          width: 150,
          render: (value) => (
            <div style={{ textAlign: "right" }}>
              Rp. {formatCurrency(value)}
            </div>
          ),
        },
        {
          title: "Tgl faktur",
          dataIndex: "transDateView",
          key: "transDateView",
          width: 100,
        },
        {
          title: "Tgl Jatuh Tempo",
          dataIndex: "dueDateView",
          key: "dueDateView",
          width: 100,
        },
        {
          title: "Total Nominal",
          dataIndex: "totalAmount",
          key: "totalAmount",
          width: 150,
          render: (value) => (
            <div style={{ textAlign: "right" }}>
              Rp. {formatCurrency(value)}
            </div>
          ),
        },

        {
          title: "No. Whatsapp",
          dataIndex: "wanumber",
          key: "wanumber",
          width: 150,
        },

        {
          title: "Action",
          width: 100,
          key: "action",
          render: (text, record) => (
            <Space size="small">
              <Button
                className="btn-pick-courier"
                shape="round"
                type="primary"
                size="small"
                color="geekblue"
                key={1}
                style={{ cursor: "pointer" }}
                onClick={() => window.open(record.invoiceLink, "_blank")
                }
                icon={<PrinterFilled />}
              />
            </Space>
          ),
        },
      ],
    };
    this.pagesize = 0;
    autoBind(this);
  }

  changeDB(e) {
    this.setState({
      [e.target.name]: e.target.value,
    }, () => this.getData());
  }

  changepage = (page) => {
    this.pagesize = (page.current - 1) * page.pageSize;
  };

  componentDidMount() {
    this.getDatabase();
  }

  getData() {

    const db = this.state.databases.find((x) => x.id === this.state.selectDB);
    let { token, host, session, dbname } = db;

    const name = dbname.toLowerCase().includes("mitra") ? "mitra" : "boss";

    const body = {
      session,
      token,
      api_url: `${host}/accurate/api/sales-invoice/list.do?fields=id,number,transDate,currencyId,dueDate,customer,totalAmount&sp.pageSize=100`,
    };
    const getData = getDataFromAccurate(body);
    getData
      .then((response) => {
        const data = response.d;
        this.setState({
          dataSource: {
            ...this.state.dataSource,
            master_data: data.map((x) => {
              const link = btoa(`${name}:${x.id}`)
              return {
                ...x,
                invoiceLink: `https://invoice.mitranpack.com/index.php?q=${link}`,
                customerName: x.customer.name,
              }
            })
          },
        });

      })
      .catch((error) => { });

  }


  getDatabase = () => {
    const tableName = "accurate";
    this.setState({
      fetching: true,
    });
    let getData = get(tableName);
    getData
      .then((response) => {
        this.setState({
          databases: response.data,
          selectDB: response.data[0].id,
        }, () => this.getData()
        );
      })
      .catch((error) => {
        ErrorMessage(error);
      })
      .finally(() => {
        this.setState({
          fetching: false,
        });
      });
  };



  render() {
    const {
      dataSource,
    } = this.state;

    return (
      <React.Fragment>
        <section className="kanban__main">
          <section className="kanban__nav">
            <PageHeader
              className="site-page-header"
              onBack={() => window.history.back()}
              title="Faktur"
              extra={[

              ]}
            />
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
          </section>
          <div className="kanban__main-wrapper">
            <Table
              key="masterdata"
              size="middle"
              dataSource={dataSource.master_data}
              columns={this.state.column}
              bordered={false}
              scroll={{ y: 350 }}
              loading={this.state.loading_table}
              onChange={(page) => this.changepage(page)}
              pagination={{
                position: "bottom",
                defaultPageSize: 50,
                showSizeChanger: true,
                pageSizeOptions: ["20", "50", "100"],
              }}
            />
          </div>
        </section>
      </React.Fragment>
    );
  }
}
export default Child;
