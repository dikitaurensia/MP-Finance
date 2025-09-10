import React from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Popconfirm,
  Modal,
  Input,
  DatePicker,
  PageHeader,
} from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  NotificationOutlined,
  UserOutlined,
  CheckCircleOutlined,
  HighlightOutlined,
  VerticalAlignBottomOutlined,
  ExportOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import moment from "moment";
import MapGL, { NavigationControl, Marker, Popup } from "react-map-gl";
import { MAPSTYLE, MAPTOKEN, JAKARTA } from "../../helper/constanta";
import "antd/dist/antd.css";
import "al-styles/base.scss";
import "al-styles/schedule.scss";
import {
  get,
  deleted,
  sendNotif,
  getPengiriman,
  getExportData,
  setDelivery,
  setEstimasi,
  getAbsensi,
  putAbsensi,
  setUrgent,
} from "../../service/endPoint";
import Nav from "../../components/Nav/Nav";
import NewDelivery from "../../components/Modal/Delivery";
import {
  ErrorMessage,
  SuccessMessage,
  search,
  makeid,
  getCoor,
  getDistance,
  getJudulTgl,
} from "../../helper/publicFunction";
import { FORMAT_DATE, IMAGE_ROOT, API_ROOT } from "../../helper/constanta";
import { replace } from "lodash";
import MarkerIcon from "../../assets/img/marker.png";
import MarkerKurir from "../../assets/img/kurir.png";
import ReactExport from "react-export-excel-hot-fix";
import Media from "react-media";
import ImgKosong from "../../assets/img/ic_image.png";
import ReactDataGrid from "react-data-grid";
import { Editors } from "react-data-grid-addons";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const { RangePicker } = DatePicker;
const tableName = "transaction";

const { DropDownEditor } = Editors;
const issueTypes = [
  { id: "Masuk", value: "Masuk" },
  { id: "Sakit", value: "Sakit" },
  { id: "Ijin", value: "Ijin" },
  { id: "Absen", value: "Absen" },
];
const IssueTypeEditor = <DropDownEditor options={issueTypes} />;

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notif: {},
      filter: {
        kurir: "",
        sj: "",
        cust: "",
      },
      viewport: {
        latitude: getCoor(JAKARTA, "lat"),
        longitude: getCoor(JAKARTA, "long"),
        zoom: 10,
        bearing: 0,
        pitch: 0,
        width: 470,
        height: 300,
      },
      record: null,
      kurirTdkMasuk: "",
      startDate: moment().format(FORMAT_DATE),
      exportDate: [moment().format(FORMAT_DATE), moment().format(FORMAT_DATE)],
      modalAdd: false,
      modalDetail: false,
      loading_table: false,
      visible: false,
      visiblePosisiKurir: false,
      visibleAbsensi: false,
      isInsert: true,
      body: {
        courierid: "",
        customerid: "",
        name: "",
        company: [],
        invoiceno: [],
        ststransaksi: "",
        tgltransaksi: "",
        disabled: true,
      },
      dataSource: [],
      dataSourceExport: [],
      dataSourceCustomer: [],
      dataSourceAbsensi: [],
      columnAbsensi: [
        {
          key: "kode",
          name: "Kode",
          width: 150,
        },
        {
          key: "name",
          name: "Name",
          width: 150,
        },
        {
          key: "statusabsen",
          name: "Status",
          width: 100,
          editor: IssueTypeEditor,
        },
      ],
      column: [
        {
          title: "Data",
          width: 100,
          render: (record) => (
            <React.Fragment>
              <span className="judul">No:</span>
              {`${record.no}`}
              <br />
              <span className="judul">Kode:</span>
              {`${record.kode}`}
              <br />
              <span className="judul">Name:</span>
              {`${record.name}`}
            </React.Fragment>
          ),
          responsive: ["xs", "sm", "md"],
          hideOnLarge: true,
        },
        {
          title: "Pengiriman",
          width: 100,
          render: (record) => (
            <React.Fragment>
              <span className="judul">Point:</span>
              {`${record.jarak}`}
              <br />
              <span className="judul">SJ:</span>
              {`${record.totalsj}`}
              <br />
              <span className="judul">Rit:</span>
              {`${record.totalrit ? record.totalrit : "0"}`}
            </React.Fragment>
          ),
          responsive: ["xs", "sm", "md"],
          hideOnLarge: true,
        },
        {
          title: "No",
          dataIndex: "no",
          key: "no",
          width: 50,
          responsive: ["lg"],
        },
        {
          title: "Kode",
          dataIndex: "kode",
          key: "kode",
          width: 50,
          responsive: ["lg"],
        },
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          width: 100,
          responsive: ["lg"],
        },
        {
          title: "Estimasi",
          dataIndex: "jarakestimasi",
          key: "jarakestimasi",
          width: 80,
          responsive: ["lg"],
        },
        {
          title: "Aktual",
          dataIndex: "jarakaktual",
          key: "jarakaktual",
          width: 80,
          responsive: ["lg"],
        },
        {
          title: "Point",
          dataIndex: "jarak",
          key: "jarak",
          width: 70,
          responsive: ["lg"],
        },
        {
          title: "No. Surat Jalan",
          key: "invoiceno",
          dataIndex: "invoiceno",
          responsive: ["lg"],
          // width: 250,
          render: (no, record) =>
            no
              ? this.filterStatusByInv(no, record.customername, record.memo)
              : null,
        },
        {
          title: "SJ",
          dataIndex: "totalsj",
          key: "totalsj",
          width: 40,
          responsive: ["lg"],
        },
        {
          title: "Rit",
          dataIndex: "totalrit",
          key: "totalrit",
          width: 40,
          responsive: ["lg"],
        },
        {
          title: "Nota",
          dataIndex: "nota",
          key: "nota",
          width: 50,
          responsive: ["lg"],
          // render: (no, record) => <div>{record.jarakaktual > 0 && record.selesai > 0 ? (record.jarakaktual / record.selesai).toFixed(1) : ""}</div>
        },
        {
          title: "Action",
          key: "action",
          width: 100,
          render: (text, record) => (
            <Space size="middle" direction="vertical">
              <Tag
                color="#87d068"
                key={1}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  this.showCloseModal({
                    type: "modalAdd",
                    isInsert: true,
                    idKurir: record.courierid,
                    rit: Number(record.lastrit) + 1,
                  })
                }
                icon={<PlusOutlined />}
              >
                Add
              </Tag>
            </Space>
          ),
        },
      ],
      columnExpand: [
        {
          title: "Surat Jalan",
          render: (record) => (
            <React.Fragment>
              <span className="judul">No. SJ:</span>
              {`${record.invoiceno}`}
              <br />
              <span className="judul">Company:</span>
              {`${record.company}`}
              <br />
              <span className="judul">Tipe Rit:</span>
              {`${record.typerit}`}
              <br />
              <span className="judul">Status:</span>
              {`${record.ststransaksi}`}
            </React.Fragment>
          ),
          responsive: ["xs", "sm", "md"],
          hideOnLarge: true,
        },
        {
          title: "Action",
          key: "action1",
          responsive: ["xs", "sm", "md"],
          hideOnLarge: true,
          width: 50,
          render: (record) => (
            <React.Fragment>
              <Tag
                color="purple"
                key={1}
                style={{ cursor: "pointer" }}
                onClick={() => this.showModalKurir(record)}
                icon={<UserOutlined />}
              />
              <br />
              <Popconfirm
                disabled={record.ststransaksi === "closed"}
                title="Sure to delete?"
                onConfirm={() =>
                  this.handleDelete(tableName, record.id, record.invoiceno)
                }
              >
                <Tag
                  color={record.ststransaksi === "closed" ? "default" : "#f50"}
                  key={2}
                  style={{ cursor: "pointer" }}
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
              <br />
              <Popconfirm
                disabled={
                  record.ststransaksi !== "checker" &&
                  record.ststransaksi !== "diterima"
                }
                title="Sure to update?"
                onConfirm={() =>
                  this.updateDelivered(record.id, record.invoiceno)
                }
              >
                <Tag
                  color={
                    record.ststransaksi !== "checker" &&
                      record.ststransaksi !== "diterima"
                      ? "default"
                      : "#87d068"
                  }
                  key={2}
                  style={{ cursor: "pointer" }}
                  icon={<CheckCircleOutlined />}
                />
              </Popconfirm>
              <br />
              <Popconfirm
                title="Update Estimasi Jarak?"
                onConfirm={() =>
                  this.updateEstimasi(
                    record.id,
                    record.invoiceno,
                    record.coorupdate
                  )
                }
              >
                <Tag
                  color={"#4F0E0E"}
                  key={5}
                  style={{ cursor: "pointer" }}
                  icon={<SyncOutlined />}
                />
              </Popconfirm>
            </React.Fragment>
          ),
        },

        {
          title: "No Invoice",
          dataIndex: "invoiceno",
          key: "no1",
          width: 150,
          responsive: ["lg"],
        },
        {
          title: "Company",
          dataIndex: "company",
          key: "company1",
          width: 200,
          responsive: ["lg"],
        },
        {
          title: "Estimasi",
          dataIndex: "jarakestimasi",
          key: "jarakestimasi",
          width: 80,
          responsive: ["lg"],
        },
        {
          title: "Aktual",
          dataIndex: "jarakaktual",
          key: "jarakaktual",
          width: 80,
          responsive: ["lg"],
        },
        {
          title: "Poin",
          dataIndex: "jarak",
          key: "jarak",
          width: 80,
          responsive: ["lg"],
        },
        {
          title: "Tipe Rit",
          dataIndex: "typerit",
          key: "typerit",
          width: 100,
          responsive: ["lg"],
        },
        {
          title: "Penerima",
          dataIndex: "penerima",
          key: "penerima",
          width: 100,
          responsive: ["lg"],
        },
        {
          title: "Photo From Checker",
          dataIndex: "imageChecker",
          key: "imageChecker",
          responsive: ["lg"],
          width: 100,
          render: (text, record) => (
            <img
              className="photo"
              src={text !== "" ? text : ImgKosong}
              alt={record.no}
              onClick={() => window.open(text)}
            />
          ),
        },
        {
          title: "Photo From Checker 2",
          dataIndex: "imageChecker2",
          key: "imageChecker2",
          responsive: ["lg"],
          width: 100,
          render: (text, record) => (
            <img
              className="photo"
              src={text !== "" ? text : ImgKosong}
              alt={record.no}
              onClick={() => window.open(text)}
            />
          ),
        },
        {
          title: "Photo From Checker 3",
          dataIndex: "imageChecker3",
          key: "imageChecker3",
          responsive: ["lg"],
          width: 100,
          render: (text, record) => (
            <img
              className="photo"
              src={text !== "" ? text : ImgKosong}
              alt={record.no}
              onClick={() => window.open(text)}
            />
          ),
        },
        {
          title: "Photo From Courier",
          dataIndex: "imageCourier",
          key: "imageCourier",
          responsive: ["lg"],
          width: 100,
          render: (text, record) => (
            <img
              className="photo"
              src={text !== "" ? text : ImgKosong}
              alt={record.no}
              onClick={() => window.open(text)}
            />
          ),
        },
        {
          title: "Photo From Admin",
          dataIndex: "imageAdmin",
          key: "imageAdmin",
          responsive: ["lg"],
          width: 100,
          render: (text, record) => (
            <img
              className="photo"
              src={text !== "" ? text : ImgKosong}
              alt={record.no}
              onClick={() => window.open(text)}
            />
          ),
        },
        {
          title: "Action",
          key: "action1",
          width: 300,
          responsive: ["lg"],
          render: (text, record) => (
            <React.Fragment>
              <Space size="small">
                <Tag
                  color="purple"
                  key={1}
                  style={{ cursor: "pointer", width: "100px" }}
                  onClick={() => this.showModalKurir(record)}
                  icon={<UserOutlined />}
                >
                  Posisi Kurir
                </Tag>

                <Tag
                  color="yellow"
                  key={1}
                  style={{ cursor: "pointer", width: "100px" }}
                  onClick={() => this.Notif(record)}
                  icon={<NotificationOutlined />}
                >
                  Notif Kurir
                </Tag>

                <Popconfirm
                  disabled={record.ststransaksi === "closed"}
                  title="Sure to delete?"
                  onConfirm={() =>
                    this.handleDelete(tableName, record.id, record.invoiceno)
                  }
                >
                  <Tag
                    color={
                      record.ststransaksi === "closed" ? "default" : "#f50"
                    }
                    key={2}
                    style={{ cursor: "pointer", width: "100px" }}
                    icon={<DeleteOutlined />}
                  >
                    Delete
                  </Tag>
                </Popconfirm>
              </Space>
              <br />
              <Space size="small" style={{ marginTop: "5px" }}>
                <Popconfirm
                  disabled={
                    record.ststransaksi !== "checker" &&
                    record.ststransaksi !== "diterima"
                  }
                  title="Sure to update?"
                  onConfirm={() =>
                    this.updateDelivered(record.id, record.invoiceno)
                  }
                >
                  <Tag
                    color={
                      record.ststransaksi !== "checker" &&
                        record.ststransaksi !== "diterima"
                        ? "default"
                        : "#87d068"
                    }
                    key={2}
                    style={{ cursor: "pointer", width: "100px" }}
                    icon={<CheckCircleOutlined />}
                  >
                    Set Deliver
                  </Tag>
                </Popconfirm>

                <Popconfirm
                  title="Update Estimasi Jarak?"
                  onConfirm={() =>
                    this.updateEstimasi(
                      record.id,
                      record.invoiceno,
                      record.coorupdate
                    )
                  }
                >
                  <Tag
                    color={"#4F0E0E"}
                    key={5}
                    style={{ cursor: "pointer", width: "100px" }}
                    icon={<SyncOutlined />}
                  >
                    Set Estimasi
                  </Tag>
                </Popconfirm>

                {record.ststransaksi === "proses" ? (
                  record.urgent === "no" ? (
                    <Popconfirm
                      title="Update status delivery to urgent?"
                      onConfirm={() =>
                        this.updateUrgent(record.id, record.invoiceno, "yes")
                      }
                    >
                      <Tag
                        color={"cyan"}
                        key={5}
                        style={{ cursor: "pointer", width: "100px" }}
                        icon={<SyncOutlined />}
                      >
                        Urgent
                      </Tag>
                    </Popconfirm>
                  ) : (
                    <Popconfirm
                      title="Update status delivery to urgent?"
                      onConfirm={() =>
                        this.updateUrgent(record.id, record.invoiceno, "no")
                      }
                    >
                      <Tag
                        color={"cyan"}
                        key={5}
                        style={{ cursor: "pointer", width: "100px" }}
                        icon={<SyncOutlined />}
                      >
                        Not Urgent
                      </Tag>
                    </Popconfirm>
                  )
                ) : null}
              </Space>
            </React.Fragment>
          ),
        },
      ],
    };
    this.getData = this.getData.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.showCloseModal = this.showCloseModal.bind(this);
    this.onChangeFields = this.onChangeFields.bind(this);
    this.prevNextDay = this.prevNextDay.bind(this);
    this.getDataCustomer = this.getDataCustomer.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getListAbsen = this.getListAbsen.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.fetchCount = this.fetchCount.bind(this);
  }

  Notif(record) {
    if (record.token !== "") {
      let body = {
        // "condition": "!('anytopicyoudontwanttouse' in topics)",
        to: record.token,
        collapse_key: "type_a",
        notification: {
          body: "Pengiriman Baru",
          title: "Mitran Pack",
          click_action: "MAIN_ACTIVITY",
        },
        data: {
          body: "Pengiriman Baru",
          title: "Mitran Pack",
          ...record,
        },
      };
      let pushNotif = sendNotif(body);
      pushNotif
        .then((response) => {
          SuccessMessage("sukses");
        })
        .catch((error) => {
          ErrorMessage("gagal");
        });
    } else {
      ErrorMessage("Token Firebase belum terisi.");
    }
  }

  prevNextDay = (tipe) => {
    // const name = e.target.parentElement.name
    let date;
    if (tipe === "tomorrow") {
      date = moment(this.state.startDate).add(1, "day");
    } else {
      date = moment(this.state.startDate).add(-1, "day");
    }
    this.setState(
      {
        startDate: date.format(FORMAT_DATE),
      },
      () => {
        this.getData();
        this.getDataCustomer();
        this.getDataAbsensi();
      }
    );
  };

  changeDate(date) {
    this.setState(
      {
        startDate: date,
      },
      () => {
        this.getData();
        this.getDataCustomer();
        this.getDataAbsensi();
      }
    );
  }

  changeFilter(e) {
    let { name, value } = e.target;
    this.setState({
      filter: { ...this.state.filter, [name]: value },
    });
  }

  getData() {
    this.setState({ loading_table: true });
    let getData = get(tableName, this.state.startDate);
    getData
      .then((response) => {
        let dataTemp = response.data.map((x) => {
          let lastrit = x.invoiceno ? x.invoiceno.split("|").length : 0;
          // x.lastrit = lastrit.length();
          let totalsj = 0;
          if (x.invoiceno !== null) {
            let xx = x.invoiceno.replace(/ \| /g, ",");
            let yy = xx.split(",");
            totalsj = yy.length;
          }

          let imageChecker = x.imagechecker
            ? `${API_ROOT}/${x.imagechecker}`
            : "";

          let imageChecker2 = x.imagechecker2
            ? `${API_ROOT}/${x.imagechecker2}`
            : "";

          let imageChecker3 = x.imagechecker3
            ? `${API_ROOT}/${x.imagechecker3}`
            : "";
          let imageCourier = x.imagecourier
            ? `${API_ROOT}/${x.imagecourier}`
            : "";
          let imageAdmin = x.imageadmin ? `${API_ROOT}/${x.imageadmin}` : "";

          return {
            ...x,
            lastrit,
            totalsj,
            totalrit: x.totalsj,
            nota:
              x.jarakaktual > 0 && x.selesai > 0
                ? (x.jarakaktual / x.selesai).toFixed(1) / 1
                : "",
            imageChecker,
            imageChecker2,
            imageChecker3,
            imageCourier,
            imageAdmin,
          };
        });

        this.setState({
          dataSource: dataTemp,
          isInsert: true,
          body: {
            courierid: "",
            customerid: "",
            name: "",
            company: [],
            invoiceno: [],
            ststransaksi: "",
            tgltransaksi: "",
            disabled: true,
          },
          visibleModal: false,
        });
      })
      .catch((error) => {
        ErrorMessage(error);
      })
      .finally(() => {
        this.setState({
          loading_table: false,
        });
      });
  }

  filterStatusByInv = (invoiceno, customername, memo) => {
    let { dataSource } = this.state;
    let invoiceRit = invoiceno.split("|").map((x) => x.replace(/ /g, ""));

    let customernameRit = customername.split("|");

    let memoRit;

    if (memo === null || memo === "") {
      memoRit = [
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
        "-",
      ];
    } else {
      memoRit = memo.split("|");
    }

    let invoiceDet = dataSource.filter((data) => data.id !== "-");
    return invoiceRit.map((rit, index) => {
      let inv = rit.split(",");

      let custname = customernameRit[index].split(",");

      let dsFilter = dataSource.filter(
        (x) => x.id !== "-" && inv.includes(x.invoiceno)
      );

      let urgent = dsFilter.filter((x) => x.urgent === "yes");

      let terjauh = Math.max(...dsFilter.map((o) => o.jarak));

      let jauh = terjauh >= 13;

      return (
        <Tag
          color={urgent.length > 0 ? "#9c27b0" : jauh ? "#01c5c4" : "#556052"}
          key={index}
          className="tag-rit"
        >
          {inv.map((x, index) => {
            let status = invoiceDet.find((det) => det.invoiceno === x);
            let color = "#87d068";
            if (status.ststransaksi === "closed") {
              color = "#fd3a69";
            } else if (status.ststransaksi === "checker") {
              color = "#fecd1a";
            } else if (status.ststransaksi === "proses") {
              color = "#54e346";
            } else if (status.ststransaksi === "deliver") {
              color = "#fca3cc";
            } else if (status.ststransaksi === "diterima") {
              color = "#2541b2";
            }
            return (
              <Tag color={color} key={x} className="tags-status">
                {custname[index]}
              </Tag>
            );
          })}
          <div style={{ textAlign: "center" }}>{memoRit[index]}</div>
        </Tag>
      );
    });
  };

  getDataCustomer() {
    let getData = getPengiriman(this.state.startDate);
    getData
      .then((response) => {
        this.setState({ dataSourceCustomer: response.data });
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  }

  handleDelete(table, id, invoiceno) {
    let getData = deleted(table, Number(id), invoiceno);
    getData
      .then((response) => {
        SuccessMessage(response.status);
        this.getData();
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  }

  updateDelivered(id, invoiceno) {
    let getData = setDelivery({ arinvoiceid: id, invoiceno });
    getData
      .then((response) => {
        SuccessMessage(response.status);
        this.getData();
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  }

  getEstimate = async (point, name) => {
    let allData = this.state.body["estimasi"].filter((x) => x.name !== name);
    let allPoins = this.state.body["poins"].filter((x) => x.name !== name);

    await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/106.827043%2C-6.131488%3B${point.join()}?alternatives=true&geometries=geojson&steps=true&access_token=${MAPTOKEN}`
    )
      .then((res) => res.json())
      .then((json) => {
        let est = (json.routes[0].distance / 1000).toFixed(1);
        let arrEstimasi = [...allData, { name, value: est }];

        let poin = (getDistance(point[1], point[0]) + 2.32).toFixed(1) / 1;
        let arrPoins = [...allPoins, { name, value: poin }];

        this.setState({
          body: {
            ...this.state.body,
            jarakestimasi: Math.max(...arrEstimasi.map((x) => x.value)),
            estimasi: arrEstimasi,
            poin,
            poins: arrPoins,
          },
        });
      });
  };

  updateEstimasi = async (id, invoiceno, coordinate) => {
    let point = [getCoor(coordinate, "long"), getCoor(coordinate, "lat")];

    await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/106.827043%2C-6.131488%3B${point.join()}?alternatives=true&geometries=geojson&steps=true&access_token=${MAPTOKEN}`
    )
      .then((res) => res.json())
      .then((json) => {
        let jarakestimasi = (json.routes[0].distance / 1000).toFixed(1);

        let poin = (getDistance(point[1], point[0]) + 2.32).toFixed(1) / 1;

        let getData = setEstimasi({
          arinvoiceid: id,
          invoiceno,
          jarakestimasi,
          jarak: poin,
        });
        getData
          .then((response) => {
            SuccessMessage(response.status);
            this.getData();
          })
          .catch((error) => {
            ErrorMessage(error);
          });
      });
  };

  updateUrgent = (id, invoiceno, urgent) => {
    let getData = setUrgent({ arinvoiceid: id, invoiceno, urgent });
    getData
      .then((response) => {
        SuccessMessage(response.status);
        this.getData();
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  };

  getListAbsen() {
    this.setState({ kurirTdkMasuk: localStorage.getItem("kurirTdkMasuk", "") });
  }

  getDataAbsensi() {
    let getData = getAbsensi(this.state.startDate);
    getData
      .then((response) => {
        this.setState({ dataSourceAbsensi: response.data });
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  }

  fetchCount = (id) => {
    const query = db
      .collection("channels")
      .doc(id)
      .collection("messages");
    query.get().then((snapshot) => {
      // let { notif } = this.state
      let notif = JSON.parse(localStorage.getItem("notifState")) || {};
      let notifLocal = JSON.parse(localStorage.getItem("notif")) || {};
      let ob = { [id]: snapshot.docs.length };

      if (notif[id] === undefined) {
        if (ob[id] > 0) {
          let xx = { ...notif, ...ob };
          localStorage.setItem("notifState", JSON.stringify(xx));
        }
      } else if (notif[id] !== ob[id]) {
        let count = Number(ob[id]) - Number(notif[id]);
        notifLocal = { ...notifLocal, [id]: count };
        localStorage.setItem("notif", JSON.stringify(notifLocal));
      }
    });
  };

  componentDidMount() {
    this.getDataAbsensi();
    this.getListAbsen();
    this.getData();
    this.getDataCustomer();
  }

  onChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
  }

  showCloseModal(e) {
    let body = {
      idcourier: "",
      idcustomer: "",
      name: "",
      company: [],
      invoiceno: [],
      status: "",
      tgl: "",
      rit: e.rit,
      typerit: "biasa",
      tgltransaksi: moment().format(FORMAT_DATE),
      jarakestimasi: 0,
      estimasi: [],
    };
    if (e.idTable !== undefined) {
      body = search("id", e.idTable, this.state.dataSource);
    } else if (e.idKurir !== undefined) {
      let xxx = search("courierid", e.idKurir, this.state.dataSource);
      body = {
        ...body,
        courierid: xxx.courierid,
        name: xxx.name,
        tgl: this.state.startDate,
        disabled: true,
      };
    }

    this.setState({
      [e.type]: !this.state[e.type],
      isInsert: e.isInsert,
      body: { ...body },
    });
  }

  onChangeFields(e) {
    const parent = e.target.parent;
    const value = e.target.value;
    const number = e.target.name;
    const updated = {
      name: number,
      value,
    };
    let allData = this.state.body[parent];
    const index = allData.findIndex((idx) => idx.name === number);
    if (index === -1) {
      allData = [...allData, updated];
    } else {
      allData[index] = updated;
    }

    this.setState({
      body: {
        ...this.state.body,
        [parent]: allData,
      },
    });
  }

  onClickCell(record, rowIndex) {
    return {
      onClick: (event) => {
        console.log(`click${record}`);
      },
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  showModalAbsen = () => {
    this.setState({
      visibleAbsensi: true,
    });
  };

  showModalKurir = (record) => {
    this.setState({
      visiblePosisiKurir: true,
      record,
    });
  };

  handleOk = (e) => {
    console.log(e);
    localStorage.setItem("kurirTdkMasuk", this.state.kurirTdkMasuk);
    this.setState({
      visible: false,
    });
  };

  handleOkAbsensi = (e) => {
    let { dataSourceAbsensi, startDate } = this.state;
    let updateData = putAbsensi({
      absensi: JSON.stringify(dataSourceAbsensi),
      tglabsen: startDate,
    });
    updateData
      .then((response) => {
        SuccessMessage();
        this.getDataAbsensi();
      })
      .catch((error) => {
        ErrorMessage(error);
      });
    this.setState({
      visibleAbsensi: false,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancelAbsensi = (e) => {
    console.log(e);
    this.setState({
      visibleAbsensi: false,
    });
  };

  handleOkKurir = (e) => {
    this.setState({
      visiblePosisiKurir: false,
    });
  };

  handleCancelKurir = (e) => {
    console.log(e);
    this.setState({
      visiblePosisiKurir: false,
    });
  };

  handleExport = () => {
    const { column, columnExpand } = this.state;

    let getData = getExportData(
      this.state.exportDate[0],
      this.state.exportDate[1]
    );
    getData
      .then((response) => {
        let dataTemp = response.data.map((x) => {
          let lastrit = x.invoiceno ? x.invoiceno.split("|").length : 0;
          let totalsj = 0;
          if (x.invoiceno !== null) {
            let xx = x.invoiceno.replace(/ \| /g, ",");
            let yy = xx.split(",");
            totalsj = yy.length;
          }
          return {
            ...x,
            lastrit,
            totalsj,
            totalrit: x.totalsj,
            nota:
              x.jarakaktual > 0 && x.selesai > 0
                ? (x.jarakaktual / x.selesai).toFixed(1) / 1
                : "",
            imageChecker:
              x.ststransaksi !== "proses"
                ? IMAGE_ROOT +
                "checker_(" +
                replace(x.company, /\s/g, "-") +
                ") " +
                replace(x.invoiceno, "/", "-") +
                ".JPG"
                : "",
            imageChecker2:
              x.ststransaksi !== "proses"
                ? IMAGE_ROOT +
                "checker2_(" +
                replace(x.company, /\s/g, "-") +
                ") " +
                replace(x.invoiceno, "/", "-") +
                ".JPG"
                : "",
            imageChecker3:
              x.ststransaksi !== "proses"
                ? IMAGE_ROOT +
                "checker3_(" +
                replace(x.company, /\s/g, "-") +
                ") " +
                replace(x.invoiceno, "/", "-") +
                ".JPG"
                : "",
            imageCourier:
              x.ststransaksi === "deliver" || x.ststransaksi === "closed"
                ? IMAGE_ROOT +
                "kurir_(" +
                x.company +
                ") " +
                replace(x.invoiceno, "/", "-") +
                ".JPG"
                : "",
            imageAdmin:
              x.ststransaksi === "closed"
                ? IMAGE_ROOT +
                "(" +
                x.company +
                ") " +
                replace(x.invoiceno, "/", "-") +
                ".JPG"
                : "",
          };
        });

        SuccessMessage("Data Export Berhasil diambil");
        this.setState({
          dataSourceExport: dataTemp,
        });
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  };

  getResponsiveColumns = (smallScreen) =>
    this.state.column.filter(
      ({ hideOnLarge = false }) => !(!smallScreen && hideOnLarge)
    );

  getResponsiveColumnsExpand = (smallScreen) =>
    this.state.columnExpand.filter(
      ({ hideOnLarge = false }) => !(!smallScreen && hideOnLarge)
    );

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let { dataSourceAbsensi } = this.state;
    let Alldata = dataSourceAbsensi;
    let rowdata = dataSourceAbsensi[fromRow];
    rowdata = {
      ...rowdata,
      ...updated,
    };
    Alldata[fromRow] = rowdata;

    this.setState({ dataSourceAbsensi: Alldata });
  };

  RowRenderer = ({ renderBaseRow, ...props }) => {
    let color = "black";
    switch (this.state.dataSourceAbsensi[props.idx].statusabsen) {
      case "Masuk":
        color = "green";
        break;
      case "Ijin":
      case "Sakit":
        color = "Blue";
        break;
      case "Absen":
        color = "red";
        break;
      default:
        color = "black";
        break;
    }
    return <div style={{ color }}>{renderBaseRow(props)}</div>;
  };

  render() {
    const {
      dataSource,
      dataSourceExport,
      column,
      columnExpand,
      body,
      dataSourceCustomer,
      viewport,
      record,
      filter,
      exportDate,
      columnAbsensi,
      dataSourceAbsensi,
    } = this.state;

    let ds = dataSource.filter((x) => {
      return x.id === "-" && x.type === "Kurir";
    });

    let dsSupir = dataSource.filter((x) => {
      return x.id === "-" && x.type === "Supir";
    });

    //filter
    if (filter.kurir != "") {
      ds = ds.filter((x) => {
        return x.name.toLowerCase().includes(filter.kurir.toLowerCase());
      });

      dsSupir = dsSupir.filter((x) => {
        return x.name.toLowerCase().includes(filter.kurir.toLowerCase());
      });
    }

    if (filter.sj != "") {
      ds = ds.filter((x) => {
        return x.invoiceno
          ? x.invoiceno.toLowerCase().includes(filter.sj.toLowerCase())
          : false;
      });

      dsSupir = dsSupir.filter((x) => {
        return x.invoiceno
          ? x.invoiceno.toLowerCase().includes(filter.sj.toLowerCase())
          : false;
      });
    }

    //jika tgl lebih dari hari ini, abaikan
    let g1 = new Date();
    let g2 = new Date(this.state.startDate);

    g1 = new Date(g1.toDateString());
    g2 = new Date(g2.toDateString());

    if (g2 <= g1) {
      let xx = this.state.dataSourceAbsensi
        .filter((x) => x.statusabsen !== "Masuk")
        .map((x) => x.kode);
      if (xx.length > 0) {
        ds = ds.filter((x) => {
          return !xx.includes(x.kode);
        });

        dsSupir = dsSupir.filter((x) => {
          return !xx.includes(x.kode);
        });
      }
    }

    ds.map((data, index) => {
      data.key = makeid();
      data.no = index + 1;

      //** jarak */

      // let distance = 0;
      // let invoices = "";
      // if (data.invoiceno !== null) {
      //   invoices = data.invoiceno;

      //   invoices = data.invoiceno.split("|");
      //   let newInvoices = invoices.map((x) => x.split(",")[0]);
      //   invoices = newInvoices.join("|");

      //   invoices = invoices.replace(/ \| /g, ",");
      //   invoices = invoices.split(",");
      //   invoices.map((x) => {
      //     let aa = search(
      //       "invoiceno",
      //       x.trim(),
      //       dataSource.filter((x) => x.id !== "-")
      //     );

      //     distance = distance + parseFloat(aa.jarak);
      //   });
      // }

      // data.jarak = distance.toFixed(1) / 1;

      return data;
    });

    let dsLength = ds.length;

    dsSupir.map((data, index) => {
      data.key = makeid();
      data.no = index + dsLength + 1;

      //** jarak */

      // let distance = 0;
      // let invoices = "";
      // if (data.invoiceno !== null) {
      //   invoices = data.invoiceno;

      //   invoices = data.invoiceno.split("|");
      //   let newInvoices = invoices.map((x) => x.split(",")[0]);
      //   invoices = newInvoices.join("|");

      //   invoices = invoices.replace(/ \| /g, ",");
      //   invoices = invoices.split(",");
      //   invoices.map((x) => {
      //     let aa = search(
      //       "invoiceno",
      //       x.trim(),
      //       dataSource.filter((x) => x.id !== "-")
      //     );

      //     distance = distance + parseFloat(aa.jarak);
      //   });
      // }

      // data.jarak = distance.toFixed(2) / 1;

      return data;
    });

    let ds2 = dataSource.filter((x) => {
      return x.id !== "-";
    });

    if (filter.cust != "") {
      ds2 = ds2.filter((x) => {
        return x.company
          ? x.company.toLowerCase().includes(filter.cust.toLowerCase())
          : false;
      });

      let idKurir = ds2.map((x) => x.courierid);

      ds = ds.filter((item) => idKurir.includes(item.courierid));

      dsSupir = dsSupir.filter((item) => idKurir.includes(item.courierid));
    }

    const expandedRow = (row) => {
      let inTable = ds2.filter((x) => {
        return x.courierid === row.courierid;
      });
      return (
        <Media query="(max-width: 991px)">
          {(smallScreen) => {
            return (
              <Table
                columns={this.getResponsiveColumnsExpand(smallScreen)}
                dataSource={inTable}
                pagination={false}
                scroll={{ y: 350, x: 200 }}
                rowClassName={(record, index) =>
                  record.urgent === "yes" ? "redCaption" : "defaultCaption"
                }
              />
            );
          }}
        </Media>
      );
    };

    let pos = [];
    if (record !== null) {
      pos.push({ coordinate: record.pos_coordinate, type: "Kurir" });
      pos.push({ coordinate: record.coorupdate, type: "Company" });
    }

    return (
      <React.Fragment>
        <section className="kanban__main">
          <section className="kanban__nav">
            <PageHeader
              className="site-page-header"
              onBack={() => window.history.back()}
              title="Schedule"
            />
            <Nav
              startDate={this.state.startDate}
              prevNextDay={this.prevNextDay}
              changeDate={this.changeDate}
            />
          </section>
          <div className="kanban__main-wrapper">
            <div className="header-schedule">
              <div className="kanban__widget">
                <div className="import-layout-widget">
                  <RangePicker
                    defaultValue={[
                      moment(exportDate[0], FORMAT_DATE),
                      moment(exportDate[1], FORMAT_DATE),
                    ]}
                    format={FORMAT_DATE}
                    onChange={(value, dateString) =>
                      this.onChange({
                        target: { name: "exportDate", value: dateString },
                      })
                    }
                  />
                  <Button
                    type="ghost"
                    onClick={this.handleExport}
                    className="btn-attendance"
                  >
                    <VerticalAlignBottomOutlined className="ic-attendance" />
                    <span className="label-btn">Get Data</span>
                  </Button>

                  <ExcelFile
                    filename={`Schedule ${getJudulTgl(
                      exportDate[0],
                      exportDate[1]
                    )}`}
                    element={
                      <Button type="danger" className="btn-attendance">
                        <ExportOutlined className="ic-attendance" />
                        <span className="label-btn">Export</span>
                      </Button>
                    }
                  >
                    <ExcelSheet
                      data={dataSourceExport.filter((x) => {
                        return x.id === "-";
                      })}
                      name="Rangkuman"
                    >
                      {[
                        ...column,
                        {
                          title: "Customer",
                          dataIndex: "customername",
                        },
                      ].map((data) => (
                        <ExcelColumn
                          label={data.title}
                          value={data.dataIndex}
                        />
                      ))}
                    </ExcelSheet>
                    <ExcelSheet
                      data={dataSourceExport.filter((x) => {
                        return x.id !== "-";
                      })}
                      name="Rincian"
                    >
                      {[
                        {
                          title: "Kode",
                          dataIndex: "kode",
                        },
                        {
                          title: "Name",
                          dataIndex: "name",
                        },
                        ...columnExpand,
                      ].map((data) => (
                        <ExcelColumn
                          label={data.title}
                          value={data.dataIndex}
                        />
                      ))}
                    </ExcelSheet>
                  </ExcelFile>
                </div>
                <div className="flex gap-5">
                  <Input
                    size="small"
                    allowClear
                    placeholder="Nama Kurir/ Supir"
                    onChange={this.changeFilter}
                    value={filter.kurir}
                    name="kurir"
                  />
                  <Input
                    size="small"
                    allowClear
                    placeholder="Nomor SJ"
                    onChange={this.changeFilter}
                    value={filter.sj}
                    name="sj"
                  />
                  <Input
                    size="small"
                    allowClear
                    placeholder="Nama Customer"
                    onChange={this.changeFilter}
                    value={filter.cust}
                    name="cust"
                  />
                </div>
              </div>
              <div className="tags-color">
                <Tag color="#9c27b0">Urgent</Tag>
                <Tag color="#01c5c4">Jauh</Tag>
                <Tag color="#556052">Dekat</Tag>
                <Tag color="#54e346">Proses</Tag>
                <Tag color="#fecd1a">Checker</Tag>
                <Tag color="#2541b2">Diterima</Tag>
                <Tag color="#fca3cc">Terkirim</Tag>
                <Tag color="#fd3a69">Selesai</Tag>
              </div>
            </div>
            <Modal
              closable={false}
              title="Kurir Tidak Masuk"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <Input.TextArea
                rows={4}
                value={this.state.kurirTdkMasuk}
                name="kurirTdkMasuk"
                onChange={this.onChange}
              />
            </Modal>

            <Modal
              closable={false}
              title="Posisi Kurir"
              visible={this.state.visiblePosisiKurir}
              onOk={this.handleOkKurir}
              onCancel={this.handleCancelKurir}
            >
              <MapGL
                {...viewport}
                onViewportChange={(viewport) => this.setState({ viewport })}
                mapStyle={MAPSTYLE}
                mapboxApiAccessToken={MAPTOKEN}
              >
                <div className="nav">
                  <NavigationControl
                    onViewportChange={(viewport) => this.setState({ viewport })}
                  />

                  {pos.map((marker, index) => {
                    return marker.coordinate ? (
                      <div key={index}>
                        <Marker
                          longitude={getCoor(marker.coordinate, "long")}
                          latitude={getCoor(marker.coordinate, "lat")}
                        >
                          <img
                            src={
                              marker.type === "Kurir" ? MarkerKurir : MarkerIcon
                            }
                          />
                        </Marker>
                      </div>
                    ) : null;
                  })}
                </div>
              </MapGL>
            </Modal>

            <Media query="(max-width: 991px)">
              {(smallScreen) => {
                return (
                  <Table
                    style={{ zIndex: 100 }}
                    className="table-antd"
                    onRow={this.onClickCell}
                    size="small"
                    columns={this.getResponsiveColumns(smallScreen)}
                    expandable={{
                      expandedRowRender: expandedRow,
                      rowExpandable: (record) => record.invoiceno !== null,
                    }}
                    dataSource={ds}
                    bordered={true}
                    scroll={{ x: "100wh" }}
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

            <Media query="(max-width: 991px)">
              {(smallScreen) => {
                return (
                  <Table
                    className="table-antd"
                    onRow={this.onClickCell}
                    size="small"
                    columns={this.getResponsiveColumns(smallScreen)}
                    expandable={{
                      expandedRowRender: expandedRow,
                      rowExpandable: (record) => record.invoiceno !== null,
                    }}
                    dataSource={dsSupir}
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

            <NewDelivery
              type=""
              body={body}
              onChange={this.onChangeFields}
              onOk={this.handleSave}
              onCancel={() =>
                this.showCloseModal({ type: "modalAdd", isInsert: true })
              }
              visible={this.state.modalAdd}
              dataSource={dataSource}
              startDate={this.state.startDate}
              getData={this.getData}
            />
          </div>
        </section>

        <Modal
          height={400}
          closable={false}
          title="Absensi Kurir/Supir"
          visible={this.state.visibleAbsensi}
          onOk={this.handleOkAbsensi}
          onCancel={this.handleCancelAbsensi}
        >
          <div style={{ width: "100%", zIndex: 200 }}>
            <ReactDataGrid
              onCellCopyPaste={null}
              columns={columnAbsensi}
              rowGetter={(i) => dataSourceAbsensi[i]}
              rowsCount={dataSourceAbsensi.length}
              onGridRowsUpdated={this.onGridRowsUpdated}
              enableCellSelect={true}
              rowRenderer={this.RowRenderer}
            />
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Child;
