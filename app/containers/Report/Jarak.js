import React, { useState, useEffect } from "react";
import { Table, DatePicker, Button, Radio, Select, Input } from "antd";

import { FORMAT_DATE } from "../../helper/constanta";
import moment from "moment";
import { reportJarak, reportpengiriman } from "../../service/endPoint";
import { ErrorMessage, getJudulTgl } from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
import { Component } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function Jarak(props) {
  const [filter, setFilter] = useState({
    startDate: moment().format(FORMAT_DATE),
    endDate: moment().format(FORMAT_DATE),
    tipe: 1,
    value: "",
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
      width: 100,
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
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.invoiceno.localeCompare(b.invoiceno),
    },

    {
      title: "Note",
      dataIndex: "memo",
      key: "memo",
      width: 100,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Jarak Aktual",
      dataIndex: "jarakchain",
      key: "jarakchain",
      width: 100,
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
    let getData = reportJarak(filter);
    getData
      .then((response) => {
        setDataSource(
          response.data.map((x) => ({ ...x, jam: x.jam === null ? "" : x.jam }))
        );
        setDataFiltered(
          response.data.map((x) => ({ ...x, jam: x.jam === null ? "" : x.jam }))
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
    if (name === "tipe") {
      setDataFiltered(dataSource);
    }
    setFilter((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const doFilter = () => {
    if (filter.tipe === 1) {
      filter.value
        ? // ? setDataFiltered(dataSource.filter((x) => x.tipe === filter.value))
        setDataFiltered(
          dataSource.filter((x) => filter.value.includes(x.tipe))
        )
        : setDataFiltered(dataSource);
    } else if (filter.tipe === 2) {
      setDataFiltered(
        dataSource.filter((x) =>
          x.customername.toLowerCase().includes(filter.value)
        )
      );
    } else {
      setDataFiltered(
        dataSource.filter((x) =>
          x.invoiceno.toLowerCase().includes(filter.value)
        )
      );
    }
  };

  useEffect(() => {
    doFilter();
  }, [filter]);

  return (
    <div>
      <div className="widget-filter">
        <div />
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
          filename={`Laporan Jarak ${getJudulTgl(
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
export default Jarak;
