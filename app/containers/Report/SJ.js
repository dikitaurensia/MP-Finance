import React, { useState } from "react";
import { Table, DatePicker, Button, Checkbox } from "antd";

import { formatCurrency, FORMAT_DATE } from "../../helper/constanta";
import moment from "moment";
import { reportSJGudang } from "../../service/endPoint";
import { ErrorMessage, getJudulTgl, } from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function SJalan(props) {
    const [filter, setFilter] = useState({
        startDate: moment().format(FORMAT_DATE),
        endDate: moment().format(FORMAT_DATE),
        punyanilai: true
    });

    const [dataSource, setDataSource] = useState([]);

    const [column, setColumn] = useState([]);

    const getData = () => {
        let getData = reportSJGudang(filter);
        getData
            .then((response) => {
                if (response.data.length > 0) {
                    let newData = response.data
                    setDataSource(newData)
                    let keys = Object.keys(newData[0])
                    let newCol = []

                    keys.map((x, index) => {
                        if (index === 0) return
                        newCol.push({
                            title: x,
                            dataIndex: x,
                            key: x,
                            width: 100,
                            fixed: index < 3 ? 'left' : false,
                            render: (value) => {
                                return index > 3 ? formatCurrency(value) : value;
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

    const filterDataSource = () => {
        if (filter.punyanilai) {
            return dataSource.filter((x) => x.Rit > 0)
        }

        return dataSource
    }

    return (
        <div>
            <div className="widget-filter">
                <Checkbox
                    checked={filter.punyanilai}
                    onChange={(e) =>
                        onChange({ target: { name: "punyanilai", value: e.target.checked } })
                    }>
                    Punya Nilai
                </Checkbox>
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
                    filename={`Laporan Gudang ${getJudulTgl(filter.startDate, filter.endDate)}`}
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
export default SJalan;
