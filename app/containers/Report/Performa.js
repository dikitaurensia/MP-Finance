import React, { useState } from "react";
import { Table, DatePicker, Button, Radio, Checkbox, Space } from "antd";

import { formatCurrency, FORMAT_DATE } from "../../helper/constanta";
import moment from "moment";
import {
  reportperforma,
  reportperformaSupir,
  reportpoin,
  reportpendapatanpotongan,
  get,
} from "../../service/endPoint";
import {
  ErrorMessage,
  getBonusPerforma,
  getBonusPerformaSupir,
  sumPerforma,
  sumRit,
  jmlKerja,
  getJudulTgl,
} from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function Performa(props) {
  const [filter, setFilter] = useState({
    startDate: moment().format(FORMAT_DATE),
    endDate: moment().format(FORMAT_DATE),
    diterima: 0,
    pendapatan: false,
    tipe: "Kurir",
    punyanilai: true,
  });

  const [dataSource, setDataSource] = useState([]);

  const [column, setColumn] = useState([]);

  const [loading, setLoading] = useState(false);

  const getData = () => {
    let getData = reportperforma({ ...filter, pendapatan: 0 });
    getData
      .then((response) => {
        if (response.data.length > 0) {
          let newData = response.data.map((x) => {
            return {
              ...x,
              Total: sumPerforma(x) !== 0 ? sumPerforma(x) : "",
              Performa:
                sumPerforma(x) !== 0
                  ? (sumPerforma(x) / sumRit(x)).toFixed(1) / 1
                  : "",
              JmlHariKerja: jmlKerja(x),
            };
          });

          setDataSource(newData);

          let keys = Object.keys(newData[0]);
          let newCol = [];

          keys.map((x, index) => {
            if (index === 0) return;
            newCol.push({
              title: x,
              dataIndex: x,
              key: x,
              width: 100,
              fixed: index < 3 ? "left" : false,
              render: (value) => {
                return index > 2 ? formatCurrency(value) : value;
              },
            });
            return null;
          });

          setColumn(newCol);
        }
      })
      .catch((error) => {
        ErrorMessage(error);
      })
      .finally(() => setLoading(false));
  };

  const getDataPendapatan = () => {
    let getData = [
      reportperforma({ ...filter, pendapatan: 0 }), //performa
      reportperforma({ ...filter, pendapatan: 1 }), //pendapatanharian
      reportperforma({ ...filter, pendapatan: 2 }), //pendapatanmingguan
      reportpoin(filter), //poin
      reportpendapatanpotongan({ ...filter }), //pendapatanpotongan
      get("courier"),
    ];

    Promise.all(getData)
      .then((values) => {
        if (values[1].data.length > 0) {
          //performa
          let newDataPerforma = values[0].data.map((x) => {
            return filter.tipe === "Kurir"
              ? {
                ID: x.ID,
                Performa: getBonusPerforma(
                  sumPerforma(x) !== 0
                    ? (sumPerforma(x) / sumRit(x)).toFixed(1) / 1
                    : 0
                ),
                JmlHariKerja: jmlKerja(x),
              }
              : {
                ID: x.ID,
                //Performa: 0
              };
          });

          //pendapatan harian
          let newData = values[1].data.map((x) => {
            return {
              ...x,
              TotalHarian: sumPerforma(x) !== 0 ? sumPerforma(x) : 0,
            };
          });

          //pendapatan mingguan
          let newDataMingguan = values[2].data.map((x) => {
            const kurir = values[5].data.find((y) => y.id == x.ID);
            const ritpendapatan = +kurir.ritpendapatan || 15000;
            return filter.tipe === "Kurir"
              ? {
                ID: x.ID,
                TotalRit: sumPerforma(x) !== 0 ? sumPerforma(x) : 0,
              }
              : {
                ID: x.ID,
                TotalSJ: sumPerforma(x) !== 0 ? sumPerforma(x) : 0,
                Performa: getBonusPerformaSupir(
                  (sumPerforma(x) !== 0 ? sumPerforma(x) : 0) / ritpendapatan
                ),
              };
          });

          //poin
          let newDataPoin = values[3].data
            .filter((x) => x.tipe === filter.tipe)
            .map((x) => {
              return filter.tipe === "Kurir"
                ? {
                  ID: x.courierid,
                  Poin: x.jarak * 100,
                }
                : {
                  ID: x.courierid,
                  Poin: 0,
                };
            });

          let newDataPotongan = values[4].data;

          let combineData = [];

          for (let i = 0; i < newData.length; i++) {
            combineData.push({
              ...newData[i],
              ...newDataMingguan.find((x) => x.ID === newData[i].ID),
              ...newDataPotongan.find((x) => x.ID === newData[i].ID),
              ...newDataPerforma.find((x) => x.ID === newData[i].ID),
              ...newDataPoin.find((x) => x.ID === newData[i].ID),
            });
          }

          let allData = combineData.map((x) => {
            return {
              ...x,
              Total:
                x.Performa +
                x.TotalRit +
                x.TotalHarian +
                x.Poin -
                Number(x.BPJSPendapatan) +
                Number(x.PendapatanLainnya) -
                Number(x.BPJSPotongan) -
                Number(x.PotonganLainnya) -
                Number(x.PotonganTelat),
            };
          });

          setDataSource(allData);

          let keys = Object.keys(allData[0]);
          let newCol = [];

          keys.map((x, index) => {
            if (index === 0) return;
            newCol.push({
              title: x,
              dataIndex: x,
              key: x,
              width: 150,
              fixed: index < 3 ? "left" : false,
              render: (value) => {
                return index > 2 ? formatCurrency(value) : value;
              },
            });
            return null;
          });

          setColumn(newCol);
        }
      })
      .catch((error) => {
        ErrorMessage(error);
      })
      .finally(() => setLoading(false));
  };

  const getDataPendapatanSupir = () => {
    let getData = [
      reportperforma({ ...filter, pendapatan: 0 }), //performa
      reportperformaSupir({ ...filter }),
      reportpendapatanpotongan({ ...filter }),
    ];

    Promise.all(getData)
      .then((values) => {
        let newDataPerforma = values[0].data.map((x) => {
          return {
            ID: x.ID,
            JmlHariKerja: jmlKerja(x),
          };
        });

        let newData = values[1].data;

        let newDataPotongan = values[2].data;

        let combineData = [];

        for (let i = 0; i < newData.length; i++) {
          combineData.push({
            ...newData[i],
            ...newDataPotongan.find((x) => x.ID === newData[i].ID),
            ...newDataPerforma.find((x) => x.ID === newData[i].ID),
          });
        }

        let allData = combineData.map((x) => {
          return {
            ...x,
            Total:
              Number(x.BonusPerforma) -
              Number(x.BPJSPendapatan) +
              Number(x.PendapatanLainnya) -
              Number(x.BPJSPotongan) -
              Number(x.PotonganLainnya) -
              Number(x.PotonganTelat),
          };
        });

        setDataSource(allData);

        let keys = Object.keys(allData[0]);
        let newCol = [];

        keys.map((x, index) => {
          if (index === 0) return;
          newCol.push({
            title: x,
            dataIndex: x,
            key: x,
            width: 150,
            fixed: index < 3 ? "left" : false,
            render: (value) => {
              return index > 2 ? formatCurrency(value) : value;
            },
          });
          return null;
        });
        setColumn(newCol);
      })
      .catch((error) => {
        ErrorMessage(error);
      })
      .finally(() => setLoading(false));
  };

  const openReport = () => {
    let { pendapatan, tipe } = filter;
    setLoading(true);
    if (pendapatan) {
      if (tipe === "Kurir") {
        getDataPendapatan();
      } else {
        getDataPendapatanSupir();
      }
    } else {
      getData();
    }
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
      return dataSource.filter((x) =>
        x.JmlHariKerja !== undefined ? x.JmlHariKerja > 0 : x.TotalSJ > 0
      );
    }

    return dataSource;
  };

  return (
    <div>
      <div className="widget-filter">
        <div>
          <Radio.Group
            onChange={onChange}
            name="diterima"
            value={filter.diterima}
          >
            <Radio value={0}>Tanpa Menit</Radio>
            <Radio value={1}>{"< 20 Menit"}</Radio>
          </Radio.Group>
          <Checkbox
            checked={filter.pendapatan}
            onChange={(e) =>
              onChange({
                target: { name: "pendapatan", value: e.target.checked },
              })
            }
          >
            Pendapatan
          </Checkbox>
          <Radio.Group onChange={onChange} name="tipe" value={filter.tipe}>
            <Radio value="Kurir">Kurir</Radio>
            <Radio value="Supir">Supir</Radio>
          </Radio.Group>
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

        <Button type="primary" onClick={openReport} loading={loading}>
          Lihat
        </Button>
        <ExcelFile
          filename={`Laporan Performa ${getJudulTgl(
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
            data={filterDataSource()}
            name={getJudulTgl(filter.startDate, filter.endDate)}
          >
            {column.map((data) => (
              <ExcelColumn label={data.title} value={data.dataIndex} />
            ))}
          </ExcelSheet>
        </ExcelFile>
      </div>
      <Checkbox
        checked={filter.punyanilai}
        onChange={(e) =>
          onChange({ target: { name: "punyanilai", value: e.target.checked } })
        }
      >
        Punya Nilai
      </Checkbox>
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
export default Performa;
