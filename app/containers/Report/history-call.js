import React, { useState, useEffect } from "react";
import {
  Table,
  DatePicker,
  Button,
  Input,
  Popover,
  Space,
  Card,
  Select,
} from "antd";
import { reportCallHistory } from "../../service/endPoint";
import { FORMAT_DATE, FORMAT_DATE_LABEL_FULL } from "../../helper/constanta";
import moment from "moment-timezone";
import { ErrorMessage, getJudulTgl } from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
import { ExportOutlined, SearchOutlined } from "@ant-design/icons";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const { RangePicker } = DatePicker;

const HistoryCall = () => {
  // State for data, loading, errors, and filters
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterDate, setFilterDate] = useState([
    moment()
      .clone()
      .startOf("month")
      .format(FORMAT_DATE),
    moment().format(FORMAT_DATE),
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: [moment().format(FORMAT_DATE), moment().format(FORMAT_DATE)],
    invoice: "",
    customer: "",
  });

  // Columns configuration for the Ant Design Table component
  const columns = [
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
      width: 200,
    },
    {
      title: "Invoice Number",
      dataIndex: "invoice",
      key: "invoice",
      width: 200,
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      width: 200,
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (value, record) => (
        <div>{value ? moment(value).format(FORMAT_DATE_LABEL_FULL) : "-"}</div>
      ),
    },
    {
      title: "Sent to",
      dataIndex: "phone_no",
      key: "phone_no",
      width: 180,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      width: 300,
      render: (text) => (
        <Popover
          content={<div style={{ maxWidth: 400 }}>{text}</div>}
          title="Full Message"
        >
          <span style={{ cursor: "pointer", color: "#1890ff" }}>
            {text.length > 35 ? `${text.substring(0, 35)}...` : text}
          </span>
        </Popover>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const color =
          status === "sukses" ? "green" : status === "Sent" ? "blue" : "red";
        return <span style={{ color, fontWeight: "bold" }}>{status}</span>;
      },
    },
  ];

  const getData = () => {
    setIsLoading(true);

    let getData = reportCallHistory({
      startDate: `${filterDate[0]} 00:00:00`,
      endDate: `${filterDate[1]} 23:59:59`,
    });
    getData
      .then((response) => {
        setData(
          response.data.map((item, index) => ({
            ...item,
            customer_name: item.customer_name || "",
            id: index + 1,
          }))
        );
        setFilteredData(response.data);
      })
      .catch((error) => {
        ErrorMessage(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = data.filter((item) => {
        const invoice = filters.invoice || "";
        const customer = filters.customer_name || "";
        const status = filters.status || "";
        const invoiceMatch = item.invoice
          .toLowerCase()
          .includes(invoice.toLowerCase());
        const customerMatch = item.customer_name
          .toLowerCase()
          .includes(customer.toLowerCase());
        const statusMatch = item.status
          .toLowerCase()
          .includes(status.toLowerCase());
        return invoiceMatch && customerMatch && statusMatch;
      });
      setFilteredData(filtered);
    };
    applyFilters();
  }, [filters, data]);

  // Handle changes to filter inputs
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      style={{
        padding: "24px",
        minHeight: "100vh",
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {/* Filter inputs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <Input
            placeholder="Customer Name"
            style={{ width: 200 }}
            value={filters.customer_name}
            onChange={(e) =>
              handleFilterChange({
                target: { name: "customer_name", value: e.target.value },
              })
            }
          />
          <Input
            placeholder="Invoice Number"
            style={{ width: 200 }}
            value={filters.invoice}
            onChange={(e) =>
              handleFilterChange({
                target: { name: "invoice", value: e.target.value },
              })
            }
          />
          <Select
            placeholder="Status"
            style={{ width: 200 }}
            allowClear
            defaultValue={filters.status}
            onChange={(value) =>
              handleFilterChange({ target: { name: "status", value } })
            }
          >
            <Select.Option value="sukses">Success</Select.Option>
            <Select.Option value="gagal">Failed</Select.Option>
          </Select>

          <RangePicker
            defaultValue={[
              moment(filterDate[0], FORMAT_DATE),
              moment(filterDate[1], FORMAT_DATE),
            ]}
            format={FORMAT_DATE}
            onChange={(value, dateString) => setFilterDate(dateString)}
            style={{ width: 240 }}
          />
          <Button type="primary" onClick={getData} icon={<SearchOutlined />}>
            Search
          </Button>
          <ExcelFile
            filename={`Report History Call ${getJudulTgl(
              filterDate[0],
              filterDate[1]
            )}`}
            element={
              <Button
                key="multi-wa"
                type="primary"
                icon={<ExportOutlined />}
                style={{
                  backgroundColor: "#25D366",
                  borderColor: "#25D366",
                  color: "white",
                }}
              >
                Export
              </Button>
            }
          >
            <ExcelSheet
              data={data}
              name={getJudulTgl(filterDate[0], filterDate[1])}
            >
              {columns.map((data) => (
                <ExcelColumn label={data.title} value={data.dataIndex} />
              ))}
            </ExcelSheet>
          </ExcelFile>
        </div>

        {/* Data table */}
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          pagination={{
            pageSizeOptions: ["50", "100", "200"],
            showSizeChanger: true,
            defaultPageSize: 50,
          }}
          bordered
          scroll={{ x: 1000 }}
        />
      </Space>
    </div>
  );
};

export default HistoryCall;
