import React from "react";
import { Table, Button, Popconfirm, Space, Tag, PageHeader } from "antd";
import moment from "moment";
import { deleted, getPresensi, create, get } from "../../service/endPoint";
import { ErrorMessage, SuccessMessage } from "../../helper/publicFunction";
import { DeleteOutlined } from "@ant-design/icons";
import Nav from "../../components/Nav/Nav";
import { FORMAT_DATE } from "../../helper/constanta";
import Media from "react-media";
import NewPresensi from "../../components/Modal/Presensi";

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment().format(FORMAT_DATE),
      modalAdd: false,
      modalSearchCourier: false,
      modalTolak: false,
      loading_table: false,
      visibleModal: false,
      dataSource: [],
      dataCourier: [],
      arinvoiceid: null,
      rowdata: null,
      dataTolak: [],
      body: {
        courierid: "",
        tglabsen: moment().format(FORMAT_DATE),
        statusabsen: "Masuk",
      },
      columnTolak: [
        {
          key: "name",
          name: "Nama Kurir/ Supir",
          width: 200,
        },
        {
          key: "tgltolak",
          name: "Tgl. Tolak",
          width: 200,
        },
      ],
      column: [
        {
          title: "Data",
          render: (record, item, index) => (
            <React.Fragment>
              <span className="judul">No:</span>
              {`${this.pagesize + index + 1}`}
              <br />
              <span className="judul">Kode:</span>
              {`${record.kode}`}
              <br />
              <span className="judul">Nama:</span>
              {`${record.name}`}
              <br />
              <span className="judul">Jam Masuk:</span>
              {`${record.absenmasuk}`}
              <br />
              <span className="judul">Jam Pulang:</span>
              {`${record.absenpulang}`}
              <br />
              <span className="judul">Status:</span>
              {`${record.statusabsen}`}
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
          render: (value, item, index) => {
            return this.pagesize + index + 1;
          },
        },
        {
          title: "Kode",
          dataIndex: "kode",
          key: "kode",
          responsive: ["lg"],
          width: 150,
          sorter: (a, b) => {
            a = a.kode || "";
            b = b.kode || "";
            return a.localeCompare(b);
          },
        },
        {
          title: "Nama",
          dataIndex: "name",
          key: "name",
          responsive: ["lg"],
          width: 150,
          sorter: (a, b) => {
            a = a.name || "";
            b = b.name || "";
            return a.localeCompare(b);
          },
        },
        {
          title: "Jam Masuk",
          dataIndex: "absenmasuk",
          key: "absenmasuk",
          width: 150,
          sorter: (a, b) => {
            a = a.absenmasuk || "";
            b = b.absenmasuk || "";
            return a.localeCompare(b);
          },
          responsive: ["lg"],
        },
        {
          title: "Jam Pulang",
          dataIndex: "absenpulang",
          sorter: (a, b) => {
            a = a.absenpulang || "";
            b = b.absenpulang || "";
            return a.localeCompare(b);
          },
          key: "absenpulang",
          width: 150,
          responsive: ["lg"],
        },
        {
          title: "Status",
          dataIndex: "statusabsen",
          sorter: (a, b) => {
            a = a.statusabsen || "";
            b = b.statusabsen || "";
            return a.localeCompare(b);
          },
          key: "statusabsen",
          width: 50,
          responsive: ["lg"],
          render: (value) => {
            return this.renderStatus(value);
          },
        },
        {
          title: "Action",
          key: "action",
          width: 60,
          render: (text, record) => (
            <Space size="small">
              <Popconfirm
                disabled={record.rowid === null}
                title="Sure to delete?"
                onConfirm={() => this.handleDelete("presensi", record.rowid)}
              >
                <Button
                  shape="round"
                  className="btn-delete-courier"
                  size="small"
                  type="danger"
                  key={2}
                  style={{ cursor: "pointer" }}
                  icon={<DeleteOutlined />}
                >
                  <span className="label-btn">Delete</span>
                </Button>
              </Popconfirm>
            </Space>
          ),
        },
      ],
    };
    this.changeDate = this.changeDate.bind(this);
    this.onChangeFields = this.onChangeFields.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.showCloseModal = this.showCloseModal.bind(this);
    this.getDataCourier = this.getDataCourier.bind(this);

    this.pagesize = 0;
  }

  renderStatus = (value) => {
    let colors = {
      Masuk: "green",
      Absen: "volcano",
      Ijin: "geekblue",
      Sakit: "geekblue",
    };

    let color = colors[value];
    return (
      <Tag color={color} key={value}>
        {value}
      </Tag>
    );
  };

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

  changepage = (page) => {
    this.pagesize = (page.current - 1) * page.pageSize;
  };

  componentDidMount() {
    this.getData();
    this.getDataCourier();
  }

  prevNextDay = (tipe) => {
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
      () => this.getData()
    );
  };

  changeDate(date) {
    this.setState(
      {
        startDate: date,
      },
      () => this.getData()
    );
  }

  getData() {
    let date = this.state.startDate;
    this.setState({ loading_table: true });
    let data = getPresensi(date);
    data
      .then((response) => {
        this.setState({
          dataSource: response.data,
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

  onChangeFilter = (e) => {
    this.setState({
      filter: e.target.value,
    });
  };

  getResponsiveColumns = (smallScreen) =>
    this.state.column.filter(
      ({ hideOnLarge = false }) => !(!smallScreen && hideOnLarge)
    );

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

  handleSave() {
    if (this.state.body.courierid === "") {
      ErrorMessage({ status: 409, message: "Silahkan pilih Kurir" });
      return;
    }
    let getData = create("presensi", { ...this.state.body });
    getData
      .then((response) => {
        SuccessMessage(response.status);
        this.getData();
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  }

  showCloseModal(e) {
    let body = {
      courierid: "",
      tglabsen: moment().format(FORMAT_DATE),
      statusabsen: "Masuk",
    };

    this.setState({
      [e.type]: !this.state[e.type],
      body: { ...body },
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

  render() {
    const { dataSource } = this.state;
    return (
      <React.Fragment>
        <section className="kanban__main">
          <section className="kanban__nav">
            <PageHeader
              className="site-page-header"
              onBack={() => window.history.back()}
              title="Presensi"
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
                  Add Presensi
                </Button>,
              ]}
            />
            <div className="kanban__nav-wrapper">
              <NewPresensi
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
            <Nav
              startDate={this.state.startDate}
              prevNextDay={this.prevNextDay}
              changeDate={this.changeDate}
            />
          </section>
          <div className="kanban__main-wrapper">
            <Media query="(max-width: 991px)">
              {(smallScreen) => {
                return (
                  <Table
                    key="masterdata"
                    size="small"
                    dataSource={dataSource}
                    columns={this.getResponsiveColumns(smallScreen)}
                    bordered={true}
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
