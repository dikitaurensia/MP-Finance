import React, { useState, useEffect } from "react";
import { Table, DatePicker, Button, Radio, Checkbox } from "antd";

import { FORMAT_DATE } from "../../helper/constanta";
import moment from "moment";
import { reportpengiriman, reportpoin } from "../../service/endPoint";
import { ErrorMessage, getJudulTgl } from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
import { Component } from "react";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function Courier(props) {
  const [filter, setFilter] = useState({
    startDate: moment().format(FORMAT_DATE),
    endDate: moment().format(FORMAT_DATE),
    tipe: 1,
    value: "",
    punyanilai: true
  });

  const [dataSource, setDataSource] = useState([]);

  const [column, setColumn] = useState({
    1: [
      {
        title: "No",
        dataIndex: "no",
        key: "no",
        render: (value, item, index) => {
          return index + 1;
        },
        width: 50,
        ellipsis: {
          showTitle: false,
        },
        fixed: 'left',
      },
      {
        title: "Kode",
        dataIndex: "kode",
        key: "kode",
        width: 120,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.kode.localeCompare(b.kode),
        fixed: 'left',
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
        fixed: 'left',
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
      {
        title: "Jarak Estimasi",
        dataIndex: "jarakestimasi",
        key: "jarakestimasi",
        width: 100,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.jarakestimasi - b.jarakestimasi,
      },
      {
        title: "Jarak Aktual",
        dataIndex: "jarakaktual",
        key: "jarakaktual",
        width: 100,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.jarakaktual - b.jarakaktual,
      },
    ],
    2: [
      {
        title: "No",
        dataIndex: "no",
        key: "no",
        render: (value, item, index) => {
          return index + 1;
        },
        width: 50,
        ellipsis: {
          showTitle: false,
        },
        fixed: 'left',
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
      {
        title: "Jarak Estimasi",
        dataIndex: "jarakestimasi",
        key: "jarakestimasi",
        width: 100,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.jarakestimasi - b.jarakestimasi,
      },
      {
        title: "Jarak Aktual",
        dataIndex: "jarakaktual",
        key: "jarakaktual",
        width: 100,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.jarakaktual - b.jarakaktual,
      },
      {
        title: "Kode",
        dataIndex: "kode",
        key: "kode",
        width: 120,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => a.kode.localeCompare(b.kode),
        fixed: 'right',
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
        fixed: 'right',
      },
    ],
  });

  const getData = () => {
    let getData = reportpoin(filter);
    getData
      .then((response) => {
        setDataSource(response.data);
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
      [name]: value,
    }));
  };

  const filterDataSource = () => {
    if (filter.punyanilai) {
      return dataSource.filter((x) => x.jarak > 0)
    }

    return dataSource
  }

  return (
    <div>
      <div className="widget-filter">
        <Radio.Group onChange={onChange} name="tipe" value={filter.tipe}>
          <Radio value={1}>Sort By Kurir</Radio>
          <Radio value={2}>Sort By Poin</Radio>
        </Radio.Group>
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
          filename={`Laporan Poin ${getJudulTgl(filter.startDate, filter.endDate)}`}
          element={
            <Button type="danger" className="btn-export">
              Export
            </Button>
          }
        >
          <ExcelSheet data={filterDataSource()} name={getJudulTgl(filter.startDate, filter.endDate)}>
            {column[filter.tipe].map((data) => (
              <ExcelColumn label={data.title} value={data.dataIndex} />
            ))}
          </ExcelSheet>
        </ExcelFile>
      </div>
      <Checkbox
        checked={filter.punyanilai}
        onChange={(e) =>
          onChange({ target: { name: "punyanilai", value: e.target.checked } })
        }>
        Punya Nilai
      </Checkbox>
      <Table
        columns={column[filter.tipe]}
        dataSource={filterDataSource()}
        bordered
        size="small"
        scroll={{ y: 350, x: 200 }}
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
export default Courier;
