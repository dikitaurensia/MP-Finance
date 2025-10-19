import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, DatePicker } from "antd";
import { reportDebtDrama } from "../../service/endPoint";
import moment from "moment-timezone";

import { ErrorMessage, formatCurrency } from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
import { ExportOutlined, SearchOutlined } from "@ant-design/icons";
import { FORMAT_DATE } from "../../helper/constanta";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const { RangePicker } = DatePicker;

const DebtDrama = () => {
  const [data, setData] = useState([]);
  const [filterDate, setFilterDate] = useState([
    moment()
      .clone()
      .subtract(3, "months")
      .startOf("month")
      .format(FORMAT_DATE),
    moment().format(FORMAT_DATE),
  ]);
  const [filteredData, setFilteredData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    invoice: "",
    customer: "",
  });

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
      sorter: (a, b) => a.customer_name.localeCompare(b.customer_name),
    },
    // {
    //   title: "Invoice Number",
    //   dataIndex: "invoice",
    //   key: "invoice",
    //   width: 150,
    //   sorter: (a, b) => a.invoice.localeCompare(b.invoice),
    // },
    // {
    //   title: "Total Amount",
    //   dataIndex: "total_amount",
    //   key: "total_amount",
    //   width: 100,
    //   render: (value) => (
    //     <div style={{ textAlign: "right" }}>{formatCurrency(value)}</div>
    //   ),
    //   sorter: (a, b) => a.total_amount - b.total_amount,
    // },
    {
      title: "Average recall",
      dataIndex: "avg_recall",
      key: "avg_recall",
      width: 150,
      render: (value) => (
        <div style={{ textAlign: "right" }}>{formatCurrency(value)}</div>
      ),
      sorter: (a, b) => a.avg_recall - b.avg_recall,
    },
  ];

  const getData = () => {
    setIsLoading(true);

    let getData = reportDebtDrama({
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

        const customerMatch = item.customer_name
          .toLowerCase()
          .includes(customer.toLowerCase());

        return customerMatch;
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
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: 4 }}>Date:</label>
            <RangePicker
              defaultValue={[
                moment(filterDate[0], FORMAT_DATE),
                moment(filterDate[1], FORMAT_DATE),
              ]}
              format={FORMAT_DATE}
              onChange={(value, dateString) => setFilterDate(dateString)}
              style={{ width: 240 }}
            />
          </div>

          {/* ... (Customer Name Filter) */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: 4 }}>Customer Name:</label>
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
          </div>
          {/* ... (Invoice Number Filter) */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: 4 }}>Invoice Number:</label>
            <Input
              placeholder="Invoice Number"
              style={{ width: 200 }}
              value={filters.invoice}
              min={0}
              onChange={(e) =>
                handleFilterChange({
                  target: { name: "invoice", value: e.target.value },
                })
              }
            />
          </div>

          {/* ... (Search Button) */}
          <Button
            type="primary"
            style={{ marginTop: 25 }}
            onClick={getData}
            icon={<SearchOutlined />}
          >
            Search
          </Button>
          {/* ... (Export Button) */}
          <ExcelFile
            filename={`Report Debt Drama`}
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
            <ExcelSheet data={data} name={"recall"}>
              {columns.map((data) => (
                <ExcelColumn label={data.title} value={data.dataIndex} />
              ))}
            </ExcelSheet>
          </ExcelFile>
        </div>

        {/* Data table */}
        <Table
          size="small"
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          pagination={{
            pageSizeOptions: ["50", "100", "200"],
            showSizeChanger: true,
            defaultPageSize: 50,
          }}
          // bordered
          scroll={{ x: 1000 }}
          rowClassName={() => "custom-hover-row"}
        />
      </Space>
    </div>
  );
};

export default DebtDrama;
