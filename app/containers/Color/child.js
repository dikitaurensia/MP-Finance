import React from "react";
import { Table, PageHeader, Button, Tag, Space, Popconfirm, Input } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import NewColor from "../../components/Modal/Color";
import "antd/dist/antd.css";
import "../../assets/base.scss";
import { get, deleted, create, update } from "../../service/endPoint";
import {
  ErrorMessage,
  SuccessMessage,
  search,
} from "../../helper/publicFunction";

import Media from "react-media";
const tableName = "colors";

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
      },
      dataSource: [],
      column: [
        {
          title: "Data",
          render: (record) => (
            <React.Fragment>
              <span className="judul">Name:</span>
              {`${record.name}`}
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
          title: "Name",
          dataIndex: "name",
          key: "name",
          responsive: ["lg"],
          sorter: (a, b) => a.name.localeCompare(b.name),
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
          isInsert: true,
          body: {
            name: "",
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
    };
    if (e.idTable !== null && e.isInsert === false) {
      body = search("id", e.idTable, this.state.dataSource);
      if (body.image == null) body.image = "";
    }

    this.setState({
      [e.type]: !this.state[e.type],
      isInsert: e.isInsert,
      body: { ...body },
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
    const { dataSource, filter } = this.state;

    let ds = dataSource;
    if (filter != "") {
      ds = dataSource.filter((x) =>
        x.name.toLowerCase().includes(filter.toLowerCase())
      );
    }

    return (
      <React.Fragment>
        <section className="kanban__main">
          <section className="kanban__nav">
            <div className="kanban__nav-wrapper">
              <PageHeader
                className="site-page-header"
                onBack={() => window.history.back()}
                title="Color"
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
                    Add Color
                  </Button>,
                ]}
              />

              <NewColor
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
              placeholder="Color"
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
