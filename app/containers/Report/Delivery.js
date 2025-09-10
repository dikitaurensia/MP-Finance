import React, { useState, useEffect } from "react";
import { Table, DatePicker, Button, Radio, Select, Input } from "antd";

import { FORMAT_DATE } from "../../helper/constanta";
import moment from "moment";
import { reportpengiriman } from "../../service/endPoint";
import { ErrorMessage, getJudulTgl } from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
import { Component } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function Delivery(props) {
  // const { column } = props;

  const [filter, setFilter] = useState({
    startDate: moment().format(FORMAT_DATE),
    endDate: moment().format(FORMAT_DATE),
    tipe: 1,
    value: "",
  });

  const [page, setPage] = useState(0);

  const [dataSource, setDataSource] = useState([]);

  const [dataFiltered, setDataFiltered] = useState([]);

  const [column, setColumn] = useState({
    1: [
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
        title: "Jam Checker",
        dataIndex: "tglcek",
        key: "tglcek",
        width: 100,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        title: "Jam Kirim",
        dataIndex: "tglditerima",
        key: "tglditerima",
        width: 100,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        title: "Jam Terkirim",
        dataIndex: "tglsampai",
        key: "tglsampai",
        width: 100,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        title: "Estimasi",
        dataIndex: "jarakestimasi",
        key: "jarakestimasi",
        width: 120,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.jarakestimasi - b.jarakestimasi,
      },
      {
        title: "Aktual",
        dataIndex: "jarakaktual",
        key: "jarakaktual",
        width: 120,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.jarakaktual - b.jarakaktual,
      },
      {
        title: "Poin",
        dataIndex: "jarak",
        key: "jarak",
        width: 120,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.jarak - b.jarak,
      },
    ],
    2: [
      {
        title: "No",
        dataIndex: "no",
        key: "no",
        render: (value, item, index) => index + 1,
        width: 50,
        ellipsis: {
          showTitle: false,
        },
        fixed: "left",
      },
      {
        title: "Nama Customer",
        dataIndex: "customername",
        key: "customername",
        width: 120,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.customername.localeCompare(b.customername),
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
        title: "Kurir/Supir",
        dataIndex: "name",
        key: "name",
        width: 120,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: "Jam Checker",
        dataIndex: "tglcek",
        key: "tglcek",
        width: 100,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        title: "Jam Kirim",
        dataIndex: "tglditerima",
        key: "tglditerima",
        width: 100,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        title: "Jam Terkirim",
        dataIndex: "tglsampai",
        key: "tglsampai",
        width: 100,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        title: "Estimasi",
        dataIndex: "jarakestimasi",
        key: "jarakestimasi",
        width: 120,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.jarakestimasi - b.jarakestimasi,
      },
      {
        title: "Aktual",
        dataIndex: "jarakaktual",
        key: "jarakaktual",
        width: 120,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.jarakaktual - b.jarakaktual,
      },
      {
        title: "Poin",
        dataIndex: "jarak",
        key: "jarak",
        width: 100,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.jarak - b.jarak,
      },
    ],
    3: [
      {
        title: "No",
        dataIndex: "no",
        key: "no",
        ellipsis: {
          showTitle: false,
        },
        render: (value, item, index) => index + 1,
        width: 50,
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
        title: "Nama Customer",
        dataIndex: "customername",
        key: "customername",
        width: 120,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.customername.localeCompare(b.customername),
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
      },
      {
        title: "Jam Checker",
        dataIndex: "tglcek",
        key: "tglcek",
        width: 100,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        title: "Jam Kirim",
        dataIndex: "tglditerima",
        key: "tglditerima",
        width: 100,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        title: "Jam Terkirim",
        dataIndex: "tglsampai",
        key: "tglsampai",
        width: 100,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        title: "Estimasi",
        dataIndex: "jarakestimasi",
        key: "jarakestimasi",
        width: 120,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.jarakestimasi - b.jarakestimasi,
      },
      {
        title: "Aktual",
        dataIndex: "jarakaktual",
        key: "jarakaktual",
        width: 120,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.jarakaktual - b.jarakaktual,
      },
      {
        title: "Poin",
        dataIndex: "jarak",
        key: "jarak",
        width: 100,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.jarak - b.jarak,
      },
    ],
  });

  const changepage = (pages) => {
    // this.pagesize = (page.current - 1) * page.pageSize;
    let xx = (pages.current - 1) * pages.pageSize;
    setPage(xx);
  };

  const getData = () => {
    let getData = reportpengiriman(filter);
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
        <Radio.Group onChange={onChange} name="tipe" value={filter.tipe}>
          <Radio value={1}>Kurir</Radio>
          <Radio value={2}>Customer</Radio>
          <Radio value={3}>SJ</Radio>
        </Radio.Group>
        <div className="report-filter">
          {filter.tipe !== 1 ? (
            <Input value={filter.value} name="value" onChange={onChange} />
          ) : (
            <Select
              allowClear
              defaultValue={filter.value}
              onChange={(value) =>
                onChange({ target: { name: "value", value } })
              }
            >
              <Select.Option value="Kurir">Kurir</Select.Option>
              <Select.Option value="Supir">Supir</Select.Option>
            </Select>
          )}
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
          filename={`Laporan Poin ${getJudulTgl(
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
            {column[filter.tipe].map((data) => (
              <ExcelColumn label={data.title} value={data.dataIndex} />
            ))}
          </ExcelSheet>
        </ExcelFile>
      </div>

      <Table
        id="table-to-xls"
        columns={column[filter.tipe]}
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
export default Delivery;
