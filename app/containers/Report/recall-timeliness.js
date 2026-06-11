import React, { useState, useEffect } from "react";
import { Table, DatePicker, Button, Space, Popover } from "antd";
import {
  getDataCallHistories,
  reportCallTimelines,
} from "../../service/endPoint";
import { FORMAT_DATE } from "../../helper/constanta";
import moment from "moment-timezone";
import ReactExport from "react-export-excel-hot-fix";
import { ExportOutlined, SearchOutlined } from "@ant-design/icons";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const { RangePicker } = DatePicker;

const RecallTimeliness = () => {
  const [data, setData] = useState([]);
  const [dataExpanded, setDataExpanded] = useState([]);

  const [filteredData, setFilteredData] = useState([]);

  const [filterDate, setFilterDate] = useState(moment().format(FORMAT_DATE));

  const [isLoading, setIsLoading] = useState(true);

  const [expandedKeys, setExpandedKeys] = useState([]);

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (text, record) => {
        return <div style={{ fontSize: 15, fontWeight: "bold" }}>{text}</div>;
        // return <Alert message={text} type="warning" />;
      },
    },
  ];

  const columnsExpand = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1,
      width: 60,
    },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      width: 300,
    },
    {
      title: "Invoice",
      dataIndex: "invoice",
      key: "invoice",
      width: 300,
    },

    {
      title: "Recall 0",
      dataIndex: "recall_0",
      key: "recall_0",
      width: 300,
      render: (text, record) => {
        const content = (
          <div style={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>
            {record.recall_0_message}
          </div>
        );

        return (
          <Popover content={content} title="Full Message" trigger="click">
            <span style={{ cursor: "pointer" }}>{text}</span>
          </Popover>
        );
      },
    },
    {
      title: "Recall 1",
      dataIndex: "recall_1",
      key: "recall_1",
      width: 300,
      render: (text, record) => {
        const content = (
          <div style={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>
            {record.recall_1_message}
          </div>
        );

        return (
          <Popover content={content} title="Full Message" trigger="click">
            <span style={{ cursor: "pointer" }}>{text}</span>
          </Popover>
        );
      },
    },
    {
      title: "Recall 2",
      dataIndex: "recall_2",
      key: "recall_2",
      width: 300,
      render: (text, record) => {
        const content = (
          <div style={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>
            {record.recall_2_message}
          </div>
        );

        return (
          <Popover content={content} title="Full Message" trigger="click">
            <span style={{ cursor: "pointer" }}>{text}</span>
          </Popover>
        );
      },
    },
    {
      title: "Recall 3",
      dataIndex: "recall_3",
      key: "recall_3",
      width: 300,
      render: (text, record) => {
        const content = (
          <div style={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>
            {record.recall_3_message}
          </div>
        );

        return (
          <Popover content={content} title="Full Message" trigger="click">
            <span style={{ cursor: "pointer" }}>{text}</span>
          </Popover>
        );
      },
    },
    {
      title: "Recall 4",
      dataIndex: "recall_4",
      key: "recall_4",
      width: 300,
      render: (text, record) => {
        const content = (
          <div style={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>
            {record.recall_4_message}
          </div>
        );

        return (
          <Popover content={content} title="Full Message" trigger="click">
            <span style={{ cursor: "pointer" }}>{text}</span>
          </Popover>
        );
      },
    },
  ];

  const getData = async () => {
    setIsLoading(true);

    const api = await reportCallTimelines({ date: filterDate });
    const datas = api.data;

    const apiCallHistory = await getDataCallHistories(
      "call_history",
      datas.map((x) => x.invoice).join(",")
    );

    const dataCallHistories = apiCallHistory.data;

    datas.forEach((invoice) => {
      const callHistory = dataCallHistories.filter(
        (x) => x.invoice === invoice.invoice
      );

      const dateCalls = callHistory.map((x) => {
        return { created_at: x.created_at, message: x.message };
      });

      for (let i = 0; i <= 4; i++) {
        invoice[`recall_${i}`] = dateCalls[i] ? dateCalls[i].created_at : "";
        invoice[`recall_${i}_message`] = dateCalls[i]
          ? dateCalls[i].message
          : "";
      }
    });

    const summarize = summarizeInvoices(datas);
    setData(summarize);
    setFilteredData(summarize);
    setDataExpanded(datas);
    setIsLoading(false);
  };

  const summarizeInvoices = (invoices) => {
    return Object.values(
      invoices.reduce((acc, invoice) => {
        const { customer_name } = invoice;

        if (!acc[customer_name]) {
          acc[customer_name] = {
            customer_name,
          };
        }
        return acc;
      }, {})
    );
  };

  useEffect(() => {
    if (filterDate) {
      getData();
    }
  }, [filterDate]);

  useEffect(() => {
    if (filteredData.length) {
      setExpandedKeys(filteredData.map((d) => d.customer_name));
    }
  }, [filteredData]);

  const expandedRow = (row) => {
    let inTable = dataExpanded.filter((x) => {
      return x.customer_name === row.customer_name;
    });
    return (
      <Table
        size="small"
        columns={columnsExpand}
        dataSource={inTable}
        pagination={false}
        rowClassName={() => "custom-hover-row"}
      />
    );
  };

  return (
    <div
      style={{
        padding: "24px",
        minHeight: "100vh",
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: 4 }}>Activity Date:</label>
            <DatePicker
              defaultValue={moment(filterDate, FORMAT_DATE)}
              format={FORMAT_DATE}
              onChange={(value, dateString) => setFilterDate(dateString)}
              style={{ width: 240 }}
            />
          </div>

          <Button
            type="primary"
            style={{ marginTop: 25 }}
            onClick={getData}
            icon={<SearchOutlined />}
          >
            Search
          </Button>
          <ExcelFile
            filename={`Report Recall Timeliness`}
            element={
              <Button
                key="multi-wa"
                type="primary"
                icon={<ExportOutlined />}
                style={{
                  backgroundColor: "#25D366",
                  borderColor: "#25D366",
                  color: "white",
                  marginTop: 25,
                }}
              >
                Export
              </Button>
            }
          >
            <ExcelSheet data={data} name="rangkuman">
              {columns.map((data) => (
                <ExcelColumn label={data.title} value={data.dataIndex} />
              ))}
            </ExcelSheet>
            <ExcelSheet data={dataExpanded} name="rincian">
              {columnsExpand.map((data) => (
                <ExcelColumn label={data.title} value={data.dataIndex} />
              ))}
            </ExcelSheet>
          </ExcelFile>
        </div>

        <Table
          showHeader={false}
          size="small"
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          pagination={false}
          scroll={{ x: 1000 }}
          rowKey="customer_name"
          expandable={{
            expandedRowKeys: expandedKeys,
            onExpandedRowsChange: setExpandedKeys,
            expandedRowRender: expandedRow,
            rowExpandable: (record) => record.customer_name !== null,
          }}
          // rowClassName={() => "custom-hover-row"}
        />
      </Space>
    </div>
  );
};

export default RecallTimeliness;
