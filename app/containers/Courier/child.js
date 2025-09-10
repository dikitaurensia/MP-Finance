import React from "react";
import {
  Table,
  PageHeader,
  Button,
  Tag,
  Space,
  Popconfirm,
  Input,
  Select,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import NewCourier from "../../components/Modal/Courier";
import moment from "moment";
import "antd/dist/antd.css";
import "../../assets/base.scss";
import { get, deleted, create, update } from "../../service/endPoint";
import {
  ErrorMessage,
  SuccessMessage,
  search,
  formatCurrency,
} from "../../helper/publicFunction";
import Media from "react-media";
import { FORMAT_DATE } from "../../helper/constanta";
const tableName = "courier";

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      status: "all",
      visibleModal: false,
      isInsert: true,
      body: {
        name: "",
        username: "",
        password: "",
        status: "",
        uuid: "",
        type: "",
        kode: "",
        jammasuk: "",
        telat: "",
        bpjspendapatan: "",
        bpjspotongan: "",
        bpjsefektif: moment().format(FORMAT_DATE),
        kategori: 1,
        ritpendapatan: "15000",
      },
      dataSource: [],
      column: [
        {
          title: "Data",
          render: (record) => (
            <React.Fragment>
              <span className="judul">Kode:</span>
              {`${record.kode}`}
              <br />
              <span className="judul">Name:</span>
              {`${record.name}`}
              <br />
              <span className="judul">Type:</span>
              {`${record.type}`}
              <br />
              <span className="judul">Username:</span>
              {`${record.username}`}
              <br />
              <span className="judul">Status:</span>
              {`${record.status}`}
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
          title: "Kode",
          dataIndex: "kode",
          key: "kode",
          width: 100,
          responsive: ["lg"],
          sorter: (a, b) => a.kode.localeCompare(b.kode),
        },
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          width: 150,
          responsive: ["lg"],
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: "Username",
          dataIndex: "username",
          key: "username",
          width: 150,
          responsive: ["lg"],
          sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
          title: "Type",
          dataIndex: "type",
          key: "type",
          width: 100,
          responsive: ["lg"],
          sorter: (a, b) => a.type.localeCompare(b.type),
        },
        {
          title: "Kategori",
          dataIndex: "kategori",
          key: "kategori",
          width: 100,
          responsive: ["lg"],
          render: (value, item, index) =>
            item.type === "Supir" ? `Supir ${value}` : "",
        },
        {
          title: "Status",
          dataIndex: "status",
          responsive: ["lg"],
          width: 100,
          sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
          title: "Jam Masuk",
          dataIndex: "jammasuk",
          responsive: ["lg"],
          width: 100,
        },
        {
          title: "Potongan Telat",
          dataIndex: "telat",
          responsive: ["lg"],
          width: 150,
          render: (value, item, index) => formatCurrency(value),
        },
        {
          title: "Efektif BPJS",
          dataIndex: "bpjsefektif",
          responsive: ["lg"],
          width: 150,
        },
        {
          title: "Potongan BPJS",
          dataIndex: "bpjspotongan",
          responsive: ["lg"],
          width: 150,
          render: (value, item, index) => formatCurrency(value),
        },
        {
          title: "Pendapatan BPJS",
          dataIndex: "bpjspendapatan",
          responsive: ["lg"],
          width: 150,
          render: (value, item, index) => formatCurrency(value),
        },
        {
          title: "Pendapatan 1 Rit",
          dataIndex: "ritpendapatan",
          responsive: ["lg"],
          width: 150,
          render: (value, item, index) => formatCurrency(value),
        },
        {
          title: "Action",
          key: "action",
          width: 180,
          responsive: ["lg"],
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
            </Space>
          ),
        },
      ],
    };
    this.getData = this.getData.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.showCloseModal = this.showCloseModal.bind(this);
    this.onChangeFields = this.onChangeFields.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
  }

  changeFilter(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  getData() {
    let getData = get(tableName);
    getData
      .then((response) => {
        this.setState({
          dataSource: response.data,
          //.filter((x) => x.status === "active"),
          isInsert: true,
          body: {
            name: "",
            username: "",
            password: "",
            status: "",
            uuid: "",
            type: "",
            kode: "",
            jammasuk: "",
            telat: "",
            bpjspendapatan: "",
            bpjspotongan: "",
            bpjsefektif: moment().format(FORMAT_DATE),
            kategori: 1,
            ritpendapatan: "15000",
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

  handleSave() {
    let getData =
      this.state.isInsert === true
        ? create(tableName, { ...this.state.body })
        : update(tableName, { ...this.state.body });
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
  }

  showCloseModal(e) {
    let body = {
      name: "",
      username: "",
      password: "",
      status: "active",
      uuid: "",
      type: "Kurir",
      kode: "",
      jammasuk: "08:00",
      telat: "50000",
      bpjspendapatan: "0",
      bpjspotongan: "0",
      bpjsefektif: moment().format(FORMAT_DATE),
      kategori: 1,
      ritpendapatan: "15000",
    };
    if (e.idTable !== null && e.isInsert === false) {
      body = search("id", e.idTable, this.state.dataSource);
    }

    this.setState({
      [e.type]: !this.state[e.type],
      isInsert: e.isInsert,
      body: { ...body, password: "" },
    });
  }

  onChangeFields(e, names) {
    const name = e.target.name ? e.target.name : names;
    const value = e.target.value;
    this.setState({
      body: {
        ...this.state.body,
        [name]: value,
      },
    });
  }

  getResponsiveColumns = (smallScreen) =>
    this.state.column.filter(
      ({ hideOnLarge = false }) => !(!smallScreen && hideOnLarge)
    );

  render() {
    const { dataSource, status, filter } = this.state;

    let ds = dataSource;
    if (filter != "") {
      ds = dataSource.filter((x) =>
        x.name.toLowerCase().includes(filter.toLowerCase())
      );
    }

    if (status != "all") {
      ds = ds.filter((x) => x.status === status);
    }

    return (
      <React.Fragment>
        <section className="kanban__main">
          <section className="kanban__nav">
            <PageHeader
              className="site-page-header"
              onBack={() => window.history.back()}
              title="Courier"
              extra={[
                <Select
                  allowClear
                  style={{ width: "100px" }}
                  defaultValue={status}
                  onChange={(value) =>
                    this.changeFilter({ target: { name: "status", value } })
                  }
                >
                  <Select.Option value="all">All</Select.Option>
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="non-active">Non Active</Select.Option>
                </Select>,
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
                  Add Courier
                </Button>,
              ]}
            />
            <div className="kanban__nav-wrapper">
              <NewCourier
                body={this.state.body}
                onChange={this.onChangeFields}
                onOk={this.handleSave}
                onCancel={() =>
                  this.showCloseModal({ type: "visibleModal", isInsert: true })
                }
                visible={this.state.visibleModal}
              />
            </div>
          </section>
          <div className="kanban__main-wrapper">
            <Input
              size="small"
              allowClear
              placeholder="Nama Kurir"
              onChange={this.changeFilter}
              value={filter}
              name="filter"
            />

            <Media query="(max-width: 991px)">
              {(smallScreen) => (
                <Table
                  size="small"
                  dataSource={ds}
                  columns={this.getResponsiveColumns(smallScreen)}
                  bordered={true}
                  scroll={{ y: 350, x: 200 }}
                  pagination={{
                    position: "bottom",
                    defaultPageSize: 50,
                    showSizeChanger: true,
                    pageSizeOptions: ["20", "50", "100"],
                  }}
                />
              )}
            </Media>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Child;
