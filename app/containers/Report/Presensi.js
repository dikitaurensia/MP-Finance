import React, { useState } from "react";
import { Table, DatePicker, Button, Tag } from "antd";

import { formatCurrency, FORMAT_DATE } from "../../helper/constanta";
import moment from "moment";
import { reportPresensi } from "../../service/endPoint";
import { ErrorMessage, getJudulTgl, jmlHariKerja, jmlKerja, jmlMasukTelat, } from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function Presensi(props) {
    const [filter, setFilter] = useState({
        startDate: moment().format(FORMAT_DATE),
        endDate: moment().format(FORMAT_DATE),
    });

    const [dataSource, setDataSource] = useState([]);

    const [column, setColumn] = useState([]);

    const renderStatus = (value) => {
        let colors = {
            "Masuk": "green",
            "Absen": "volcano",
            "Ijin": "geekblue",
            "Sakit": "geekblue",
        }

        if (typeof value === "string") {
            let newValue = value.includes("Masuk") ? "Masuk" : value
            let color = colors[newValue]
            return (
                <Tag color={color} key={newValue}>
                    {value}
                </Tag>
            );
        }
        return value

    }

    const getData = () => {
        let getData = reportPresensi(filter);
        getData
            .then((response) => {
                if (response.data.length > 0) {
                    // let newData = response.data

                    let newData = response.data.map((x) => {
                        return {
                            ...x,
                            JmlMasuk: jmlMasukTelat(x, "Masuk") + jmlMasukTelat(x, "Telat"),
                            JmlAbsen: jmlMasukTelat(x, "Absen"),
                            JmlSakit: jmlMasukTelat(x, "Sakit"),
                            JmlIjin: jmlMasukTelat(x, "Ijin"),
                            JmlTelat: jmlMasukTelat(x, "Telat"),
                            TotalHariKerja: jmlHariKerja(x),
                        }
                    })

                    setDataSource(newData)
                    let keys = Object.keys(newData[0])
                    let newCol = []

                    keys.map((x, index) => {
                        if (index === 0) return
                        newCol.push({
                            resizeable: true,
                            title: x,
                            dataIndex: x,
                            key: x,
                            width: 150,
                            fixed: index < 3 ? 'left' : false,
                            render: (value) => {
                                return index > 2 ? renderStatus(value) : value;
                            },
                        })
                        return null
                    })

                    setColumn(newCol)
                }
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

    return (
        <div>
            <div className="widget-filter">
                <div>


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
                    filename={`Laporan Presensi ${getJudulTgl(filter.startDate, filter.endDate)}`}
                    element={
                        <Button type="danger" className="btn-export">
                            Export
                        </Button>
                    }
                >
                    <ExcelSheet data={dataSource} name={getJudulTgl(filter.startDate, filter.endDate)}>
                        {column.map((data) => (
                            <ExcelColumn label={data.title} value={data.dataIndex} />
                        ))}
                    </ExcelSheet>
                </ExcelFile>
            </div>

            <Table
                columns={column}
                dataSource={dataSource}
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
export default Presensi;
