import React from "react";
import {
  Table,
  PageHeader,
  Tag,
  Space,
  DatePicker,
  Input,
  Popconfirm,
} from "antd";
import { EyeOutlined, CopyOutlined, DeleteOutlined } from "@ant-design/icons";

import "antd/dist/antd.css";
import "../../assets/base.scss";
import { get, copyDataKaryawan, deleted } from "../../service/endPoint";
import {
  ErrorMessage,
  formatCurrency,
  getUmur,
  SuccessMessage,
} from "../../helper/publicFunction";
import moment from "moment";
import { FORMAT_DATE } from "../../helper/constanta";
import Media from "react-media";
const { RangePicker } = DatePicker;
const tableName = "lamaran";

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      visibleModal: false,
      startDate: moment().format(FORMAT_DATE),
      tglLamaran: [
        moment()
          .clone()
          .startOf("month")
          .format(FORMAT_DATE),
        moment().format(FORMAT_DATE),
      ],
      isInsert: true,
      dataSource: [],
      column: [
        {
          title: "Pelamar",
          render: (record) => (
            <React.Fragment>
              <span className="judul">Nama:</span>
              {`${record.namadepan} ${record.namabelakang}`}
              <br />
              <span className="judul">Posisi:</span>
              {`${record.posisilamaran}`}
              <br />
              <span className="judul">Tgl:</span>
              {`${record.tgllamaran}`}
              <br />
              <span className="judul">Gaji:</span>
              {`${formatCurrency(record.minimalgaji)}`}
              <br />
              <span className="judul">Umur:</span>
              {`${record.umur} tahun`}
              <br />
              <span className="judul">Status:</span>
              {`${record.statuslamaran}`}
            </React.Fragment>
          ),
          responsive: ["xs", "sm", "md"],
          hideOnLarge: true,
        },

        {
          title: "Action",
          width: 60,
          render: (record) => (
            <React.Fragment>
              <Tag
                color="geekblue"
                key={1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={(e) =>
                  this.handleOpen(e, record.idlamaran, "portfolio")
                }
                icon={<EyeOutlined />}
              />
              <br />
              <Popconfirm
                disabled={record.statuslamaran !== "Diterima"}
                title="Sure to copy data?"
                onConfirm={() => this.handleCopy(record.idlamaran)}
              >
                <Tag
                  color="lime"
                  key={1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  icon={<CopyOutlined />}
                />
              </Popconfirm>
              <br />
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(tableName, record.idlamaran)}
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
          title: "Nama Depan",
          dataIndex: "namadepan",
          key: "namadepan",
          responsive: ["lg"],
          width: 150,
          sorter: (a, b) => a.namadepan.localeCompare(b.namadepan),
        },
        {
          title: "Nama Belakang",
          dataIndex: "namabelakang",
          key: "namabelakang",
          responsive: ["lg"],
          width: 150,
          sorter: (a, b) => a.namabelakang.localeCompare(b.namabelakang),
        },
        {
          title: "Posisi",
          dataIndex: "posisilamaran",
          key: "posisilamaran",
          width: 100,
          responsive: ["lg"],
          sorter: (a, b) => a.posisilamaran.localeCompare(b.posisilamaran),
        },
        {
          title: "Tgl. Lamaran",
          dataIndex: "tgllamaran",
          key: "tgllamaran",
          responsive: ["lg"],
          width: 130,
          sorter: (a, b) => a.tgllamaran.localeCompare(b.tgllamaran),
        },
        {
          title: "Permintaan Gaji",
          dataIndex: "minimalgaji",
          key: "minimalgaji",
          responsive: ["lg"],
          width: 150,
          sorter: (a, b) => a.minimalgaji - b.minimalgaji,
          render: (value, item, index) => {
            return formatCurrency(value);
          },
          align: "right",
        },
        {
          title: "Umur",
          dataIndex: "umur",
          key: "umur",
          responsive: ["lg"],
          width: 80,
          sorter: (a, b) => a.umur - b.umur,
        },
        {
          title: "Catatan",
          dataIndex: "catatan",
          key: "catatan",
          responsive: ["lg"],
          width: 100,
          sorter: (a, b) => {
            a = a.catatan || "";
            b = b.catatan || "";
            return a.localeCompare(b);
          },
        },
        {
          title: "Status",
          dataIndex: "statuslamaran",
          key: "statuslamaran",
          responsive: ["lg"],
          width: 100,
          sorter: (a, b) => a.statuslamaran.localeCompare(b.statuslamaran),
        },
        {
          title: "Action",
          key: "action",
          align: "center",
          responsive: ["lg"],
          width: 300,
          render: (text, record) => (
            <Space size="middle">
              <Tag
                color="geekblue"
                key={1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={(e) =>
                  this.handleOpen(e, record.idlamaran, "portfolio")
                }
                icon={<EyeOutlined />}
              >
                Preview
              </Tag>

              <Popconfirm
                disabled={record.statuslamaran !== "Diterima"}
                title="Sure to copy data?"
                onConfirm={() => this.handleCopy(record.idlamaran)}
              >
                <Tag
                  color="lime"
                  key={1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  icon={<CopyOutlined />}
                >
                  Employee
                </Tag>
              </Popconfirm>

              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(tableName, record.idlamaran)}
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
    this.handleOpen = this.handleOpen.bind(this);
    this.onChange = this.onChange.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
  }

  changeFilter(e) {
    this.setState({
      filter: e.target.value,
    });
  }

  handleCopy = (id) => {
    let getData = copyDataKaryawan({ idlamaran: id });
    getData
      .then((response) => {
        SuccessMessage();
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  };

  handleOpen = (e, id, type) => {
    e.preventDefault();
    // const { history } = this.props;
    // history.push(`/${type}/${id}`);
    const win = window.open(`/${type}/${id}`, "_blank");
    win.focus();
  };

  getData() {
    let { tglLamaran } = this.state;
    let getData = get(tableName, tglLamaran[0], tglLamaran[1]);
    getData
      .then((response) => {
        this.setState({
          dataSource: response.data.map((x) => {
            return { ...x, umur: getUmur(x.tgllahir) };
          }),
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

  componentDidMount() {
    this.getData();
  }

  onChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(
      {
        [name]: value,
      },
      () => this.getData()
    );
  }

  getResponsiveColumns = (smallScreen) =>
    this.state.column.filter(
      ({ hideOnLarge = false }) => !(!smallScreen && hideOnLarge)
    );

  render() {
    const { dataSource, column, tglLamaran, filter } = this.state;

    let ds = dataSource;
    if (filter != "") {
      ds = dataSource.filter((x) => {
        return (
          x.namabelakang.toLowerCase().includes(filter.toLowerCase()) ||
          x.namadepan.toLowerCase().includes(filter.toLowerCase()) ||
          x.posisilamaran.toLowerCase().includes(filter.toLowerCase())
        );
      });
    }

    return (
      <React.Fragment>
        <section className="kanban__main">
          <section className="kanban__nav">
            <PageHeader
              className="site-page-header"
              onBack={() => window.history.back()}
              title="Job Application"
              extra={[
                <RangePicker
                  defaultValue={[
                    moment(tglLamaran[0], FORMAT_DATE),
                    moment(tglLamaran[1], FORMAT_DATE),
                  ]}
                  format={FORMAT_DATE}
                  onChange={(value, dateString) =>
                    this.onChange({
                      target: { name: "tglLamaran", value: dateString },
                    })
                  }
                />,
              ]}
            />
            <div className="kanban__nav-wrapper" />
          </section>
          <div className="kanban__main-wrapper">
            <Input
              size="small"
              allowClear
              placeholder="Nama Pelamar / Posisi Lamaran"
              onChange={this.changeFilter}
              value={filter}
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
                    scroll={{ y: 350 }}
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
