import React, { useState, useEffect } from "react";
import { Table, DatePicker, Button, Radio, Checkbox } from "antd";

import { FORMAT_DATE } from "../../helper/constanta";
import moment from "moment";
import { reportpengiriman, reportpoin, reporttolak } from "../../service/endPoint";
import { ErrorMessage, getJudulTgl } from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
import { Component } from "react";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function Tolak(props) {
    const [filter, setFilter] = useState({
        startDate: moment().format(FORMAT_DATE),
        endDate: moment().format(FORMAT_DATE),
    });

    const [dataSource, setDataSource] = useState([]);

    const [column, setColumn] = useState([
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
            width: 80,
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
            width: 100,
            ellipsis: {
                showTitle: false,
            },
            sorter: (a, b) => a.name.localeCompare(b.name),
            fixed: 'left',
        },

        {
            title: "Invoiceno",
            dataIndex: "invoiceno",
            key: "invoiceno",
            width: 100,
            ellipsis: {
                showTitle: false,
            },
            sorter: (a, b) => a.invoiceno.localeCompare(b.invoiceno),
        },
        {
            title: "Tgl. Tolak",
            dataIndex: "tgltolak",
            key: "tgltolak",
            width: 100,
            ellipsis: {
                showTitle: false,
            },
            sorter: (a, b) => a.tgltolak.localeCompare(b.tgltolak),
        },
    ]);

    const getData = () => {
        let getData = reporttolak(filter);
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
                <div></div>
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
                    filename={`Laporan Tolak ${getJudulTgl(filter.startDate, filter.endDate)}`}
                    element={
                        <Button type="danger" className="btn-export">
                            Export
                        </Button>
                    }
                >
                    <ExcelSheet data={filterDataSource()} name={getJudulTgl(filter.startDate, filter.endDate)}>
                        {column.map((data) => (
                            <ExcelColumn label={data.title} value={data.dataIndex} />
                        ))}
                    </ExcelSheet>
                </ExcelFile>
            </div>
            <Table
                columns={column}
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
export default Tolak;
