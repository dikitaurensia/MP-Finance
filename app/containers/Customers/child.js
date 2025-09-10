import React from "react";
import {
  Table,
  PageHeader,
  Button,
  Tag,
  Space,
  Popconfirm,
  Input,
  Checkbox,
} from "antd";

import Icon, {
  DeleteOutlined,
  EditOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import ReactExport from "react-export-excel-hot-fix";
import NewCustomers from "../../components/Modal/Customers";
import "antd/dist/antd.css";
import "../../assets/base.scss";
import {
  get,
  deleted,
  create,
  update,
  setcustEstimasi,
  getDataFromAccurate,
} from "../../service/endPoint";
import {
  ErrorMessage,
  SuccessMessage,
  search,
  getCoor,
} from "../../helper/publicFunction";
import { JAKARTA, MODE_LOGIN, MAPTOKEN } from "../../helper/constanta";
import Media from "react-media";
import autoBind from "react-autobind";
import NewCustomerSync from "../../components/Modal/CustomersSync";

const tableName = "customer";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const mode = localStorage.getItem(MODE_LOGIN);

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      filter: "",
      dataImport: [],
      viewport: {
        latitude: getCoor(JAKARTA, "lat"),
        longitude: getCoor(JAKARTA, "long"),
        zoom: 12,
        bearing: 0,
        pitch: 0,
        width: window.innerWidth - 100,
        height: window.innerHeight,
      },
      popupInfo: null,
      visibleModal: false,
      visibleModalSync: false,
      isInsert: true,
      body: {
        contact: "",
        company: "",
        phone: "",
        address: "",
        coordinate: "",
        address2: "",
        coordinate2: "",
        canupdate: "",
        canupdate2: "",
        whatsapp: "",
      },
      bodySync: {
        dbId: "",
      },
      dataSource: [],
      database: [],
      column: [
        {
          title: "Data",
          render: (record) => (
            <React.Fragment>
              <span className="judul">Company:</span>
              {`${record.company}`}
              <br />
              <span className="judul">Address:</span>
              {`${record.address}`}
              <br />
              <span className="judul">Address 2:</span>
              {`${record.address2 ? record.address2 : "-"}`}
            </React.Fragment>
          ),
          responsive: ["xs", "sm", "md"],
          hideOnLarge: true,
        },
        {
          title: "Action",
          width: "60px",
          render: (record) => (
            <React.Fragment>
              <Tag
                color="geekblue"
                key={1}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  this.showCloseModal({
                    type: "visibleModal",
                    isInsert: false,
                    idTable: record.id,
                  })
                }
                icon={<EditOutlined />}
              />
              <br />
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(tableName, record.id)}
              >
                <Tag
                  color="volcano"
                  key={2}
                  style={{ cursor: "pointer" }}
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </React.Fragment>
          ),
          responsive: ["xs", "sm", "md"],
          hideOnLarge: true,
        },
        {
          title: "Company",
          dataIndex: "company",
          key: "company",
          responsive: ["lg"],
          width: 150,
          sorter: (a, b) => {
            a = a.company || "";
            b = b.company || "";
            return a.localeCompare(b);
          },
        },

        {
          title: "Address",
          dataIndex: "address",
          key: "address",
          responsive: ["lg"],
          width: 300,
          sorter: (a, b) => {
            a = a.address || "";
            b = b.address || "";
            return a.localeCompare(b);
          },
        },
        {
          title: "Coordinate",
          dataIndex: "coordinate",
          key: "coordinate",
          responsive: ["lg"],
          width: 200,
          sorter: (a, b) => {
            a = a.coordinate || "";
            b = b.coordinate || "";
            return a.localeCompare(b);
          },
        },
        {
          title: "Aktual",
          dataIndex: "aktual1",
          key: "aktual1",
          responsive: ["lg"],
          width: 200,
          sorter: (a, b) => {
            a = a.aktual1 || "";
            b = b.aktual1 || "";
            return a.localeCompare(b);
          },
        },

        {
          title: "Estimasi",
          dataIndex: "estimasi1",
          key: "estimasi1",
          responsive: ["lg"],
          width: 100,
          sorter: (a, b) => {
            a = a.aktual1 || "";
            b = b.aktual1 || "";
            return a.localeCompare(b);
          },
        },

        {
          title: "Date Update",
          dataIndex: "dateupdate",
          key: "dateupdate",
          responsive: ["lg"],
          width: 110,
          sorter: (a, b) => {
            a = a.dateupdate || "";
            b = b.dateupdate || "";
            return a.localeCompare(b);
          },
        },

        {
          title: "Lock",
          dataIndex: "canupdate",
          key: "canupdate",
          width: 50,
          responsive: ["lg"],
          render: (canupdate) => (
            <div style={{ textAlign: "center" }}>
              <Checkbox checked={canupdate === "1" ? true : false} />
            </div>
          ),
        },

        {
          title: "Address 2",
          dataIndex: "address2",
          key: "address2",
          responsive: ["lg"],
          width: 150,
          sorter: (a, b) => {
            a = a.address2 || "";
            b = b.address2 || "";
            return a.localeCompare(b);
          },
        },
        {
          title: "Coordinate 2",
          dataIndex: "coordinate2",
          key: "coordinate2",
          responsive: ["lg"],
          width: 120,
          sorter: (a, b) => {
            a = a.coordinate2 || "";
            b = b.coordinate2 || "";
            return a.localeCompare(b);
          },
        },

        {
          title: "Aktual 2",
          dataIndex: "aktual2",
          key: "aktual2",
          responsive: ["lg"],
          width: 120,
          sorter: (a, b) => {
            a = a.aktual2 || "";
            b = b.aktual2 || "";
            return a.localeCompare(b);
          },
        },

        {
          title: "Estimasi 2",
          dataIndex: "estimasi2",
          key: "estimasi2",
          responsive: ["lg"],
          width: 100,
          sorter: (a, b) => {
            a = a.aktual2 || "";
            b = b.aktual2 || "";
            return a.localeCompare(b);
          },
        },

        {
          title: "Date Update 2",
          dataIndex: "dateupdate2",
          key: "dateupdate2",
          responsive: ["lg"],
          width: 118,
          sorter: (a, b) => {
            a = a.dateupdate2 || "";
            b = b.dateupdate2 || "";
            return a.localeCompare(b);
          },
        },
        {
          title: "Lock 2",
          dataIndex: "canupdate2",
          key: "canupdate2",
          responsive: ["lg"],
          width: 60,
          render: (canupdate2) => (
            <div style={{ textAlign: "center" }}>
              <Checkbox checked={canupdate2 === "1" ? true : false} />
            </div>
          ),
        },

        {
          title: "Whatsapp",
          dataIndex: "whatsapp",
          key: "whatsapp",
          responsive: ["lg"],
          width: 120,
          sorter: (a, b) => {
            a = a.whatsapp || "";
            b = b.whatsapp || "";
            return a.localeCompare(b);
          },
        },

        {
          title: "Action",
          key: "action",
          responsive: ["lg"],
          width: 300,
          render: (text, record) => (
            <Space size="middle">
              <Tag
                color="geekblue"
                key={1}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  this.showCloseModal({
                    type: "visibleModal",
                    isInsert: false,
                    idTable: record.id,
                  })
                }
                icon={<EditOutlined />}
              >
                Edit
              </Tag>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(tableName, record.id)}
              >
                <Tag
                  color="volcano"
                  key={2}
                  style={{ cursor: "pointer" }}
                  icon={<DeleteOutlined />}
                >
                  Delete
                </Tag>
              </Popconfirm>

              <Popconfirm
                title="Update Estimasi?"
                onConfirm={() =>
                  this.updateEstimasi(
                    record.id,
                    record.coordinate,
                    record.coordinate2
                  )
                }
              >
                <Tag
                  color="#476072"
                  key={2}
                  style={{ cursor: "pointer" }}
                  icon={<SyncOutlined />}
                >
                  Get Estimasi
                </Tag>
              </Popconfirm>
            </Space>
          ),
        },
      ],
    };

    autoBind(this);
  }

  changeFilter(e) {
    this.setState({
      filter: e.target.value,
    });
  }

  getImport(value) {
    this.setState({ dataImport: [...value] });
  }

  updateAllEstimasi = () => {
    let { dataSource } = this.state;
    this.setState({ loading: true });
    dataSource.map((x) => {
      this.updateEstimasiBatch(x);
      return null;
    });
    this.setState({ loading: false });
  };

  updateEstimasiBatch = async (x) => {
    if (x.coordinate !== "" && x.estimasi1 === "") {
      let point = [getCoor(x.coordinate, "long"), getCoor(x.coordinate, "lat")];

      await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/106.827043%2C-6.131488%3B${point.join()}?alternatives=true&geometries=geojson&steps=true&access_token=${MAPTOKEN}`
      )
        .then((res) => res.json())
        .then((json) => {
          let jarakestimasi = (json.routes[0].distance / 1000).toFixed(1);

          let getData = setcustEstimasi({
            id: x.id,
            addresstype: 1,
            jarakestimasi,
          });
          getData.then((response) => { }).catch((error) => { });
        });
    }

    if (x.coordinate2 !== "" && x.estimasi2 === "") {
      let point2 = [
        getCoor(x.coordinate2, "long"),
        getCoor(x.coordinate2, "lat"),
      ];

      await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/106.827043%2C-6.131488%3B${point2.join()}?alternatives=true&geometries=geojson&steps=true&access_token=${MAPTOKEN}`
      )
        .then((res) => res.json())
        .then((json) => {
          let jarakestimasi = (json.routes[0].distance / 1000).toFixed(1);

          let getData = setcustEstimasi({
            id: x.id,
            addresstype: 2,
            jarakestimasi,
          });
          getData.then((response) => { }).catch((error) => { });
        });
    }
  };

  updateEstimasi = async (id, coordinate, coordinate2) => {
    if (coordinate !== "" && coordinate !== null) {
      let point = [getCoor(coordinate, "long"), getCoor(coordinate, "lat")];

      await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/106.827043%2C-6.131488%3B${point.join()}?alternatives=true&geometries=geojson&steps=true&access_token=${MAPTOKEN}`
      )
        .then((res) => res.json())
        .then((json) => {
          let jarakestimasi = (json.routes[0].distance / 1000).toFixed(1);

          let getData = setcustEstimasi({ id, addresstype: 1, jarakestimasi });
          getData
            .then((response) => {
              this.getData();
            })
            .catch((error) => {
              ErrorMessage(error);
            });
        });
    }

    if (coordinate2 !== "" && coordinate2 !== null) {
      let point = [getCoor(coordinate2, "long"), getCoor(coordinate2, "lat")];

      await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/106.827043%2C-6.131488%3B${point.join()}?alternatives=true&geometries=geojson&steps=true&access_token=${MAPTOKEN}`
      )
        .then((res) => res.json())
        .then((json) => {
          let jarakestimasi = (json.routes[0].distance / 1000).toFixed(1);

          let getData = setcustEstimasi({ id, addresstype: 2, jarakestimasi });
          getData
            .then((response) => {
              SuccessMessage(response.status);
              this.getData();
            })
            .catch((error) => {
              ErrorMessage(error);
            });
        });
    }
  };

  getData() {
    let getData = get(tableName);
    getData
      .then((response) => {
        this.setState({
          dataSource: response.data,
          isInsert: true,
          body: {
            contact: "",
            company: "",
            phone: "",
            address: "",
            coordinate: "",
            address2: "",
            coordinate2: "",
            canupdate: "",
            canupdate2: "",
            whatsapp: "",
          },
          visibleModal: false,
        });
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  }

  handleDelete(table, id) {
    let getData = deleted(table, Number(id));
    getData
      .then((response) => {
        SuccessMessage(response.status);
        this.getData();
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  }

  handleSaveSync() {
    if (this.state.bodySync.dbId === "") {
      ErrorMessage({ status: 409, message: "Silahkan pilih Database" });
      return;
    }
    this.setState({ visibleModalSync: false });

    this.getTotalPage(100);
  }

  getTotalPage = (pagesize) => {
    const db = this.state.database.find(
      (x) => x.id === this.state.bodySync.dbId
    );
    let { token, host, session } = db;
    const body = {
      session,
      token,
      api_url: `${host}/accurate/api/customer/list.do?fields=name&sp.pageSize=${pagesize}`,
    };
    const getData = getDataFromAccurate(body);

    getData
      .then((response) => {
        if (response.sp.rowCount === 0)
          ErrorMessage({ status: 409, message: "Tidak ada data customer" });
        for (let i = 1; i <= response.sp.pageCount; i++) {
          this.getSync(pagesize, i);

          if (i == response.sp.pageCount) {
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getSync = (pagesize, page) => {
    const db = this.state.database.find(
      (x) => x.id === this.state.bodySync.dbId
    );
    let { token, host, session } = db;

    const body = {
      session,
      token,
      api_url: `${host}/accurate/api/customer/list.do?fields=id,name&sp.pageSize=${pagesize}&sp.page=${page}`,
    };
    const getData = getDataFromAccurate(body);
    getData
      .then((response) => {
        const customers = this.state.dataSource.map((x) => x.company);

        let filteredArray = response.d.filter(
          (obj1) => !customers.some((obj2) => obj2 === obj1.name)
        );

        if (filteredArray.length == 0) {
          SuccessMessage("updated page " + page);
        }

        filteredArray.forEach((x) => {
          this.getDetailCust(x.id);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getDetailCust = (id) => {
    const db = this.state.database.find(
      (x) => x.id === this.state.bodySync.dbId
    );
    let { token, host, session } = db;

    const body = {
      session,
      token,
      api_url: `${host}/accurate/api/customer/detail.do?id=${id}`,
    };
    const getData = getDataFromAccurate(body);
    getData
      .then((response) => {
        const data = response.d;
        const customer = {
          contact:
            data.detailContact.length > 0 ? data.detailContact[0].name : "",
          company: data.name,
          phone: data.workPhone,
          address2: data.shipStreet,
          coordinate: "-6.131445374213353, 106.8259288826466",
          address: data.billStreet,
          coordinate2: "-6.131445374213353, 106.8259288826466",
          whatsapp: data.bbmPin,
          estimasi1: data.charField6 || 0,
        };

        // console.log(customer);
        this.saveToDB(customer);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  saveToDB(customer) {
    let getData = [create("customer_import", [customer])];
    Promise.all(getData)
      .then((values) => {
        SuccessMessage("Sync " + customer.company);
        this.getData();
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  }

  handleSave() {
    let getData =
      this.state.isInsert === true
        ? create(tableName, this.state.body)
        : update(tableName, this.state.body);
    getData
      .then((response) => {
        SuccessMessage(response.status);
        this.getData();
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  }

  componentDidMount() {
    this.getData();
    this.getDatabase();
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
          database: response.data,
        });
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

  showCloseModal(e) {
    let body = {
      contact: "",
      company: "",
      phone: "",
      address: "",
      coordinate: "",
      address2: "",
      coordinate2: "",
      canupdate: "",
      canupdate2: "",
      whatsapp: "",
    };

    const bodySync = {
      dbId: "",
    };

    if (e.idTable !== null) {
      body = search("id", e.idTable, this.state.dataSource);
    }

    this.setState({
      [e.type]: !this.state[e.type],
      isInsert: e.isInsert,
      body: { ...body },
      bodySync: { ...bodySync },
    });
  }

  onChangeFields(e) {
    const name = e.target.name;
    let value = e.target.value;
    this.setState({
      body: {
        ...this.state.body,
        [name]: value,
      },
    });
  }

  onChangeFieldsSync(e, names) {
    const name = e.target.name ? e.target.name : names;
    const value = e.target.value;
    this.setState({
      bodySync: {
        ...this.state.bodySync,
        [name]: value,
      },
    });
  }

  getResponsiveColumns = (smallScreen) =>
    this.state.column.filter(
      ({ hideOnLarge = false }) => !(!smallScreen && hideOnLarge)
    );

  render() {
    let { dataSource, filter, column } = this.state;

    let ds = dataSource;
    if (filter != "") {
      ds = dataSource.filter((x) => {
        return x.company.toLowerCase().includes(filter.toLowerCase());
      });
    }

    return (
      <React.Fragment>
        <section className="kanban__main">
          <section className="kanban__nav">
            <PageHeader
              className="site-page-header"
              onBack={() => window.history.back()}
              title="Customers"
              extra={[
                <Button
                  size="small"
                  type="primary"
                  shape="round"
                  onClick={() =>
                    this.showCloseModal({
                      type: "visibleModal",
                      isInsert: true,
                    })
                  }
                >
                  Add Customer
                </Button>,

                <ExcelFile
                  filename="Data Customer"
                  element={
                    <Button
                      size="small"
                      type="primary"
                      shape="round"
                      disabled={mode !== "manager"}
                    >
                      Export Data
                    </Button>
                  }
                >
                  <ExcelSheet data={ds} name="Data Customer">
                    {column
                      .filter((x) => x.hideOnLarge !== true)
                      .map((data) => (
                        <ExcelColumn
                          label={data.title}
                          value={data.dataIndex}
                        />
                      ))}
                  </ExcelSheet>
                </ExcelFile>,

                <Button
                  size="small"
                  type="primary"
                  shape="round"
                  onClick={() =>
                    this.showCloseModal({
                      type: "visibleModalSync",
                      isInsert: true,
                    })
                  }
                >
                  Sync Data Accurate
                </Button>,
              ]}
            />
            <div className="kanban__nav-wrapper">
              <NewCustomers
                body={this.state.body}
                onChange={this.onChangeFields}
                onOk={this.handleSave}
                onCancel={() =>
                  this.showCloseModal({ type: "visibleModal", isInsert: true })
                }
                visible={this.state.visibleModal}
              />

              <NewCustomerSync
                body={this.state.bodySync}
                onChange={this.onChangeFieldsSync}
                onOk={this.handleSaveSync}
                onCancel={() =>
                  this.showCloseModal({
                    type: "visibleModalSync",
                    isInsert: true,
                  })
                }
                visible={this.state.visibleModalSync}
                database={this.state.database}
              />
            </div>
          </section>
          <div className="kanban__main-wrapper">
            <Input
              size="small"
              allowClear
              placeholder="Nama Customer"
              onChange={this.changeFilter}
              value={filter.cust}
              name="cust"
            />

            <Media query="(max-width: 991px)">
              {(smallScreen) => {
                return (
                  <Table
                    size="small"
                    dataSource={ds}
                    columns={this.getResponsiveColumns(smallScreen)}
                    bordered={true}
                    scroll={{ x: "100wh", y: "calc(50vh - 4em)" }}
                    pagination={{
                      position: "bottom",
                      defaultPageSize: 50,
                      showSizeChanger: true,
                      pageSizeOptions: ["20", "50", "100"],
                    }}
                  />
                );
              }}
            </Media>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Child;
