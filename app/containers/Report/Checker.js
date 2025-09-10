import React, { useState, useEffect } from "react";
import { Table, DatePicker, Button, Radio, Select, Input } from "antd";

import { API_ROOT, FORMAT_DATE } from "../../helper/constanta";
import moment from "moment";
import { reportChecker, reportJarak } from "../../service/endPoint";
import { ErrorMessage, getJudulTgl } from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
import ImgKosong from "../../assets/img/ic_image.png";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function Checker(props) {
  const [filter, setFilter] = useState({
    startDate: moment().format(FORMAT_DATE),
    endDate: moment().format(FORMAT_DATE),
    // tipe: 1,
    // value: "",
    sj: "",
    cust: "",
  });

  const [page, setPage] = useState(0);

  const [dataSource, setDataSource] = useState([]);

  const [dataFiltered, setDataFiltered] = useState([]);

  const [column, setColumn] = useState([
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (value, item, index) => page + index + 1,
      width: 50,
      ellipsis: {
        showTitle: false,
      },
      fixed: "left",
    },
    {
      title: "Tanggal",
      dataIndex: "tgltransaksi",
      key: "tgltransaksi",
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.tgltransaksi.localeCompare(b.tgltransaksi),
    },

    {
      title: "Kurir/Supir",
      dataIndex: "name",
      key: "name",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
      fixed: "left",
    },
    {
      title: "Rit",
      dataIndex: "rit",
      key: "rit",
      width: 50,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Nama Customer",
      dataIndex: "customername",
      key: "customername",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.customername.localeCompare(b.customername),
    },
    {
      title: "No. SJ",
      dataIndex: "invoiceno",
      key: "invoiceno",
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.invoiceno.localeCompare(b.invoiceno),
    },
    {
      title: "Jam Mulai",
      dataIndex: "tglmulaicek",
      key: "tglmulaicek",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Foto unload 1",
      dataIndex: "imageCheckerbongkar",
      key: "imageCheckerbongkar",
      responsive: ["lg"],
      width: 110,
      render: (text, record) => (
        <img
          className="photo"
          style={{ width: "100px", height: "100px" }}
          src={text !== "" ? text : ImgKosong}
          alt={record.no}
        />
      ),
    },
    {
      title: "Foto unload 2",
      dataIndex: "imageChecker2bongkar",
      key: "imageChecker2bongkar",
      responsive: ["lg"],
      width: 110,
      render: (text, record) => (
        <img
          className="photo"
          style={{ width: "100px", height: "100px" }}
          src={text !== "" ? text : ImgKosong}
          alt={record.no}
          onClick={() => window.open(text)}
        />
      ),
    },
    {
      title: "Foto unload 3",
      dataIndex: "imageChecker3bongkar",
      key: "imageChecker3bongkar",
      responsive: ["lg"],
      width: 110,
      render: (text, record) => (
        <img
          className="photo"
          style={{ width: "100px", height: "100px" }}
          src={text !== "" ? text : ImgKosong}
          alt={record.no}
          onClick={() => window.open(text)}
        />
      ),
    },

    {
      title: "Foto load 1",
      dataIndex: "imageChecker",
      key: "imageChecker",
      responsive: ["lg"],
      width: 100,
      render: (text, record) => (
        <img
          className="photo"
          style={{ width: "100px", height: "100px" }}
          src={text !== "" ? text : ImgKosong}
          alt={record.no}
          onClick={() => window.open(text)}
        />
      ),
    },
    {
      title: "Foto load 2",
      dataIndex: "imageChecker2",
      key: "imageChecker2",
      responsive: ["lg"],
      width: 100,
      render: (text, record) => (
        <img
          className="photo"
          style={{ width: "100px", height: "100px" }}
          src={text !== "" ? text : ImgKosong}
          alt={record.no}
          onClick={() => window.open(text)}
        />
      ),
    },
    {
      title: "Foto load 3",
      dataIndex: "imageChecker3",
      key: "imageChecker3",
      responsive: ["lg"],
      width: 100,
      render: (text, record) => (
        <img
          className="photo"
          style={{ width: "100px", height: "100px" }}
          src={text !== "" ? text : ImgKosong}
          alt={record.no}
          onClick={() => window.open(text)}
        />
      ),
    },
    {
      title: "Jam Selesai",
      dataIndex: "tglcek",
      key: "tglcek",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Durasi",
      dataIndex: "duration",
      key: "duration",
      width: 80,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Note",
      dataIndex: "notecek",
      key: "notecek",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
    },
  ]);

  const changepage = (pages) => {
    let xx = (pages.current - 1) * pages.pageSize;
    setPage(xx);
  };

  const getData = () => {
    let getData = reportChecker(filter);
    getData
      .then((response) => {
        setDataSource(
          response.data.map((x) => ({
            ...x,
            imageChecker: x.imagechecker ? `${API_ROOT}/${x.imagechecker}` : "",
            imageChecker2: x.imagechecker2
              ? `${API_ROOT}/${x.imagechecker2}`
              : "",
            imageChecker3: x.imagechecker3
              ? `${API_ROOT}/${x.imagechecker3}`
              : "",
            imageCheckerbongkar: x.imagecheckerbongkar
              ? `${API_ROOT}/${x.imagecheckerbongkar}`
              : "",
            imageChecker2bongkar: x.imagechecker2bongkar
              ? `${API_ROOT}/${x.imagechecker2bongkar}`
              : "",
            imageChecker3bongkar: x.imagechecker3bongkar
              ? `${API_ROOT}/${x.imagechecker3bongkar}`
              : "",
            duration: x.tglmulaicek
              ? moment(x.tglcek).diff(moment(x.tglmulaicek), "minutes")
              : "-",
          }))
        );
        setDataFiltered(
          response.data.map((x) => ({
            ...x,
            imageChecker: x.imagechecker ? `${API_ROOT}/${x.imagechecker}` : "",
            imageChecker2: x.imagechecker2
              ? `${API_ROOT}/${x.imagechecker2}`
              : "",
            imageChecker3: x.imagechecker3
              ? `${API_ROOT}/${x.imagechecker3}`
              : "",
            imageCheckerbongkar: x.imagecheckerbongkar
              ? `${API_ROOT}/${x.imagecheckerbongkar}`
              : "",
            imageChecker2bongkar: x.imagechecker2bongkar
              ? `${API_ROOT}/${x.imagechecker2bongkar}`
              : "",
            imageChecker3bongkar: x.imagechecker3bongkar
              ? `${API_ROOT}/${x.imagechecker3bongkar}`
              : "",
            duration: x.tglmulaicek
              ? moment(x.tglcek).diff(moment(x.tglmulaicek), "minutes")
              : "-",
          }))
        );
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  };

  const openReport = () => {
    getData();
  };

  const onChange = (e) => {
    let { name, value } = e.target;

    setFilter((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const doFilter = () => {
    const data = dataSource.filter(
      (x) =>
        x.invoiceno.toLowerCase().includes(filter.sj.toLowerCase()) &&
        x.customername.toLowerCase().includes(filter.cust.toLowerCase())
    );
    setDataFiltered(data);
  };

  useEffect(() => {
    if (dataSource.length > 0) {
      doFilter();
    }
  }, [filter, dataSource]);

  return (
    <div>
      <div className="widget-filter">
        <div className="report-filter layout-4">
          <Input
            size="small"
            allowClear
            placeholder="Nomor SJ"
            onChange={onChange}
            value={filter.sj}
            name="sj"
          />
          <Input
            size="small"
            allowClear
            placeholder="Nama Customer"
            onChange={onChange}
            value={filter.cust}
            name="cust"
          />
        </div>

        <div className="report-filter layout-2">
          <DatePicker
            clearIcon
            showToday
            value={moment(filter.startDate, FORMAT_DATE)}
            format={FORMAT_DATE}
            defaultValue={moment(filter.startDate, FORMAT_DATE)}
            onChange={(date, dateString) =>
              onChange({ target: { name: "startDate", value: dateString } })
            }
          />
          <DatePicker
            clearIcon
            showToday
            value={moment(filter.endDate, FORMAT_DATE)}
            format={FORMAT_DATE}
            defaultValue={moment(filter.endDate, FORMAT_DATE)}
            onChange={(date, dateString) =>
              onChange({ target: { name: "endDate", value: dateString } })
            }
          />
        </div>

        <Button type="primary" onClick={openReport}>
          Lihat
        </Button>

        <ExcelFile
          filename={`Laporan Checker ${getJudulTgl(
            filter.startDate,
            filter.endDate
          )}`}
          element={
            <Button type="danger" className="btn-export">
              Export
            </Button>
          }
        >
          <ExcelSheet
            data={dataFiltered}
            name={getJudulTgl(filter.startDate, filter.endDate)}
          >
            {column.map((data) => (
              <ExcelColumn label={data.title} value={data.dataIndex} />
            ))}
          </ExcelSheet>
        </ExcelFile>
      </div>

      <Table
        id="table-to-xls"
        columns={column}
        dataSource={dataFiltered}
        bordered
        size="small"
        scroll={{ y: 350, x: 200 }}
        onChange={(page) => changepage(page)}
        pagination={{
          position: "bottom",
          defaultPageSize: 50,
          showSizeChanger: true,
          pageSizeOptions: ["20", "50", "100"],
        }}
      />
    </div>
  );
}
export default Checker;
