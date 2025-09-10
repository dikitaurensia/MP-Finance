import React from "react";
import {
  Table,
  PageHeader,
  Tag,
  Space,
  DatePicker,
  Input,
  Popconfirm,
  Button,
} from "antd";
import {
  ExportOutlined,
  UsergroupAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import "../../assets/base.scss";
import { get, createAcountKurir, deleted } from "../../service/endPoint";
import {
  ErrorMessage,
  getUmur,
  SuccessMessage,
} from "../../helper/publicFunction";
import moment from "moment";
import { FORMAT_DATE } from "../../helper/constanta";
import Media from "react-media";
import ReactExport from "react-export-excel-hot-fix";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const tableName = "karyawan";

const fieldExport = [
  {
    title: "Kode Karyawan",
    dataIndex: "kodekaryawan",
  },
  {
    title: "Tgl. Masuk",
    dataIndex: "tglmasuk",
  },

  {
    title: "Nama Depan",
    dataIndex: "namadepan",
  },

  {
    title: "Nama Belakang",
    dataIndex: "namabelakang",
  },
  {
    title: "Posisi",
    dataIndex: "posisilamaran",
  },

  {
    title: "Tempat Lahir",
    dataIndex: "tempatlahir",
  },
  {
    title: "Tanggal Lahir",
    dataIndex: "tgllahir",
  },

  {
    title: "No. Telp",
    dataIndex: "notelp",
  },
  {
    title: "Alamat",
    dataIndex: "alamatktp",
  },

  {
    title: "Kota",
    dataIndex: "kotaktp",
  },
  {
    title: "Kecamatan",
    dataIndex: "kecamatanktp",
  },

  {
    title: "Kelurahan",
    dataIndex: "kelurahanktp",
  },
  {
    title: "Agama",
    dataIndex: "agama",
  },
  {
    title: "KTP",
    dataIndex: "ktp",
  },
  {
    title: "NPWP",
    dataIndex: "npwm",
  },
  {
    title: "Status Pernikahan",
    dataIndex: "statuspernikahan",
  },
  {
    title: "Jumlah Anak",
    dataIndex: "jmlanak",
  },
];

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
          title: "Karyawan",
          render: (record) => (
            <React.Fragment>
              <span className="judul">Kode karyawan:</span>
              {`${record.kodekaryawan}`}
              <br />
              <span className="judul">Nama:</span>
              {`${record.namadepan} ${record.namabelakang}`}
              <br />
              <span className="judul">Umur:</span>
              {`${record.umur} tahun`}
              <br />
              <span className="judul">Posisi:</span>
              {`${record.posisilamaran}`}
              <br />
              <span className="judul">Tgl. Masuk:</span>
              {`${record.tglmasuk}`}
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
              <Popconfirm
                title="Sure to create account?"
                onConfirm={() => this.handleCreate(record.idkaryawan)}
              >
                <Tag
                  color="magenta"
                  key={1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  icon={<UsergroupAddOutlined />}
                />
              </Popconfirm>
              <br />
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() =>
                  this.handleDelete(tableName, record.idkaryawan)
                }
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
          title: "Kode Karyawan",
          dataIndex: "kodekaryawan",
          key: "kodekaryawan",
          responsive: ["lg"],
          width: 150,
          sorter: (a, b) => a.kodekaryawan.localeCompare(b.kodekaryawan),
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
          responsive: ["lg"],
          width: 150,
          sorter: (a, b) => a.posisilamaran.localeCompare(b.posisilamaran),
        },
        {
          title: "Umur",
          dataIndex: "umur",
          key: "umur",
          responsive: ["lg"],
          width: 150,
          sorter: (a, b) => a.umur - b.umur,
        },
        {
          title: "Tgl. Masuk",
          dataIndex: "tglmasuk",
          key: "tglmasuk",
          responsive: ["lg"],
          width: 150,
          sorter: (a, b) => a.tglmasuk.localeCompare(b.tglmasuk),
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
          title: "Action",
          key: "action",
          align: "center",
          responsive: ["lg"],
          width: 250,
          render: (text, record) => (
            <Space size="middle">
              <Popconfirm
                title="Sure to create account?"
                onConfirm={() => this.handleCreate(record.idkaryawan)}
              >
                <Tag
                  color="magenta"
                  key={1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  icon={<UsergroupAddOutlined />}
                >
                  Create Account
                </Tag>
              </Popconfirm>

              <Popconfirm
                title="Sure to delete?"
                onConfirm={() =>
                  this.handleDelete(tableName, record.idkaryawan)
                }
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
    this.handleCreate = this.handleCreate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
  }

  changeFilter(e) {
    this.setState({
      filter: e.target.value,
    });
  }

  handleCreate = (id) => {
    let getData = createAcountKurir({ idkaryawan: id });
    getData
      .then((response) => {
        SuccessMessage();
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  };

  getData() {
    let getData = get(tableName, "x");
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
    const { dataSource, filter } = this.state;

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
              title="Employees"
              extra={[
                <ExcelFile
                  filename="Data Karyawan"
                  element={
                    <Button type="danger" className="btn-attendance">
                      <ExportOutlined className="ic-attendance" />
                      <span className="label-btn">Export</span>
                    </Button>
                  }
                >
                  <ExcelSheet data={dataSource} name="Data Karyawan">
                    {fieldExport.map((data) => (
                      <ExcelColumn label={data.title} value={data.dataIndex} />
                    ))}
                  </ExcelSheet>
                </ExcelFile>,
              ]}
            />
            <div className="kanban__nav-wrapper" />
          </section>
          <div className="kanban__main-wrapper">
            <Input
              size="small"
              allowClear
              placeholder="Nama Karyawan / Posisi"
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
