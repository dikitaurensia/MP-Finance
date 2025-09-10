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
  EyeOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import "antd/dist/antd.css";
import "../../assets/base.scss";
import { get, deleted, create, update } from "../../service/endPoint";
import {
  ErrorMessage,
  formatCurrency,
  getJudulTgl,
  getUmur,
  search,
  SuccessMessage,
} from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
import moment from "moment";
import { FORMAT_DATE, MODE_LOGIN } from "../../helper/constanta";
import Media from "react-media";
import NewPendapatan from "../../components/Modal/Pendapatan";
const { RangePicker } = DatePicker;
const tableName = "penghasilan";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const mode = localStorage.getItem(MODE_LOGIN);

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      visibleModal: false,
      isInsert: true,
      dataCourier: [],
      tglPenghasilan: [
        moment()
          .clone()
          .startOf("month")
          .format(FORMAT_DATE),
        moment().format(FORMAT_DATE),
      ],
      body: {
        courierid: "",
        tgl: moment().format(FORMAT_DATE),
        jenis: "Pendapatan",
        keterangan: "",
        nilai: "0",
      },
      isInsert: true,
      dataSource: [],
      column: [
        {
          title: "Pelamar",
          render: (record) => (
            <React.Fragment>
              <span className="judul">Kode:</span>
              {`${record.kode}`}
              <br />
              <span className="judul">Nama:</span>
              {`${record.name}`}
              <br />
              <span className="judul">Tgl:</span>
              {`${record.tgl}`}
              <br />
              <span className="judul">Jenis:</span>
              {`${formatCurrency(record.jenis)}`}
              <br />
              <span className="judul">Keterangan:</span>
              {`${record.keterangan}`}
              <br />
              <span className="judul">Nilai:</span>
              {`${record.nilai}`}
            </React.Fragment>
          ),
          responsive: ["xs", "sm", "md"],
          hideOnLarge: true,
        },
        {
          title: "Kode",
          dataIndex: "kode",
          key: "kode",
          responsive: ["lg"],
          width: 100,
          sorter: (a, b) => a.kode.localeCompare(b.kode),
        },
        {
          title: "Nama",
          dataIndex: "name",
          key: "name",
          responsive: ["lg"],
          width: 100,
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: "Tanggal",
          dataIndex: "tgl",
          key: "tgl",
          width: 100,
          responsive: ["lg"],
          sorter: (a, b) => a.tgl.localeCompare(b.tgl),
        },
        {
          title: "Jenis",
          dataIndex: "jenis",
          key: "jenis",
          responsive: ["lg"],
          width: 100,
          sorter: (a, b) => a.jenis.localeCompare(b.jenis),
        },
        {
          title: "Keterangan",
          dataIndex: "keterangan",
          key: "keterangan",
          responsive: ["lg"],
          width: 200,
          sorter: (a, b) => {
            a = a.keterangan || "";
            b = b.keterangan || "";
            return a.localeCompare(b);
          },
        },
        {
          title: "Nilai",
          dataIndex: "nilai",
          key: "nilai",
          responsive: ["lg"],
          width: 100,
          sorter: (a, b) => a.nilai - b.nilai,
          render: (value, item, index) => {
            return formatCurrency(value);
          },
        },
        {
          title: "Action",
          key: "action",
          width: 100,
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
                    idTable: record.rowid,
                  })
                }
                icon={<EditOutlined />}
              >
                Edit
              </Tag>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(tableName, record.rowid)}
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
    this.handleOpen = this.handleOpen.bind(this);
    this.onChange = this.onChange.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.showCloseModal = this.showCloseModal.bind(this);
    this.getDataCourier = this.getDataCourier.bind(this);
    this.onChangeFields = this.onChangeFields.bind(this);
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

  getDataCourier() {
    let getData = get("courier");
    getData
      .then((response) => {
        this.setState({
          dataCourier: response.data,
        });
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  }

  showCloseModal(e) {
    let body = {
      courierid: "",
      tgl: moment().format(FORMAT_DATE),
      jenis: "Pendapatan",
      keterangan: "",
      nilai: "0",
    };
    if (e.idTable !== null && e.isInsert === false) {
      body = search("rowid", e.idTable, this.state.dataSource);
    }

    this.setState({
      [e.type]: !this.state[e.type],
      isInsert: e.isInsert,
      body,
    });
  }

  changeFilter(e) {
    this.setState({
      filter: e.target.value,
    });
  }

  handleOpen = (e, id, type) => {
    e.preventDefault();
    const win = window.open(`/${type}/${id}`, "_blank");
    win.focus();
  };

  getData() {
    let { tglPenghasilan } = this.state;
    let getData = get(tableName, tglPenghasilan[0], tglPenghasilan[1]);
    getData
      .then((response) => {
        this.setState({
          dataSource: response.data,
          visibleModal: false,
          body: {
            courierid: "",
            tgl: moment().format(FORMAT_DATE),
            jenis: "Pendapatan",
            keterangan: "",
            nilai: "0",
          },
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
    this.getDataCourier();
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

  handleSave() {
    let { courierid, tgl, jenis, keterangan, nilai } = this.state.body;
    if (
      courierid === "" ||
      tgl === "" ||
      jenis === "" ||
      keterangan === "" ||
      nilai === ""
    )
      return;
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

  render() {
    const { dataSource, column, tglPenghasilan } = this.state;

    return (
      <React.Fragment>
        <section className="kanban__main">
          <section className="kanban__nav">
            <PageHeader
              className="site-page-header"
              onBack={() => window.history.back()}
              title="Pendapatan & Potongan"
              extra={[
                <RangePicker
                  defaultValue={[
                    moment(tglPenghasilan[0], FORMAT_DATE),
                    moment(tglPenghasilan[1], FORMAT_DATE),
                  ]}
                  format={FORMAT_DATE}
                  onChange={(value, dateString) =>
                    this.onChange({
                      target: { name: "tglPenghasilan", value: dateString },
                    })
                  }
                />,
                <Button
                  type="primary"
                  onClick={() =>
                    this.showCloseModal({
                      type: "visibleModal",
                      isInsert: true,
                    })
                  }
                >
                  Tambah Data
                </Button>,
                <ExcelFile
                  filename={`Data Pendapatan & Potongan ${getJudulTgl(
                    tglPenghasilan[0],
                    tglPenghasilan[1]
                  )}`}
                  element={
                    <Button type="primary" disabled={mode !== "manager"}>
                      Export Data
                    </Button>
                  }
                >
                  <ExcelSheet
                    data={dataSource}
                    name={getJudulTgl(tglPenghasilan[0], tglPenghasilan[1])}
                  >
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
              ]}
            />
            <div className="kanban__nav-wrapper">
              <NewPendapatan
                body={this.state.body}
                onChange={this.onChangeFields}
                onOk={this.handleSave}
                onCancel={() =>
                  this.showCloseModal({ type: "visibleModal", isInsert: true })
                }
                visible={this.state.visibleModal}
                dataCourier={this.state.dataCourier}
              />
            </div>
          </section>
          <div className="kanban__main-wrapper">
            <Media query="(max-width: 991px)">
              {(smallScreen) => {
                return (
                  <Table
                    size="small"
                    dataSource={dataSource}
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
