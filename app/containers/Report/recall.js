import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Select, InputNumber } from "antd";
import { reportRecall } from "../../service/endPoint";
import { ErrorMessage, formatCurrency } from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
import { ExportOutlined, SearchOutlined } from "@ant-design/icons";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const { Option } = Select;

const Recall = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    invoice: "",
    customer: "",
    totalCallValue: "all",
    totalCallOperator: "=",
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
      width: 200,
      sorter: (a, b) => a.customer_name.localeCompare(b.customer_name),
    },
    {
      title: "Invoice Number",
      dataIndex: "invoice",
      key: "invoice",
      width: 150,
      sorter: (a, b) => a.invoice.localeCompare(b.invoice),
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      width: 100,
      render: (value) => (
        <div style={{ textAlign: "right" }}>{formatCurrency(value)}</div>
      ),
      sorter: (a, b) => a.total_amount - b.total_amount,
    },
    {
      title: "Total Call",
      dataIndex: "recall",
      key: "recall",
      width: 80,
      render: (value) => (
        <div style={{ textAlign: "right" }}>{formatCurrency(value)}</div>
      ),
      sorter: (a, b) => a.recall - b.recall,
    },
  ];

  const getData = () => {
    setIsLoading(true);

    let getData = reportRecall();
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
        const totalRecall = filters.totalCallValue || "all";
        const operator = filters.totalCallOperator || "=";

        const invoiceMatch = item.invoice
          .toLowerCase()
          .includes(invoice.toLowerCase());
        const customerMatch = item.customer_name
          .toLowerCase()
          .includes(customer.toLowerCase());
        let recallMatch = true;
        if (totalRecall != "all") {
          if (operator == "=") recallMatch = item.recall == totalRecall;
          if (operator == ">=") recallMatch = item.recall >= totalRecall;
          if (operator == ">") recallMatch = item.recall > totalRecall;
          if (operator == "<=") recallMatch = item.recall <= totalRecall;
          if (operator == "<") recallMatch = item.recall < totalRecall;
        }

        return invoiceMatch && customerMatch && recallMatch;
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

  const selectBefore = (
    <Select
      defaultValue="="
      style={{ width: 70 }}
      value={filters.totalCallOperator}
      onChange={(value) =>
        handleFilterChange({ target: { name: "totalCallOperator", value } })
      }
    >
      <Option value=">="> {">="} </Option>
      <Option value=">"> {">"} </Option>
      <Option value="="> {"="} </Option>
      <Option value="<="> {"<="} </Option>
      <Option value="<"> {"<"}</Option>
    </Select>
  );

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
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: 4 }}>Invoice Number:</label>
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
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: 4 }}>Total Call:</label>
            <div style={{ display: "flex" }}>
              <InputNumber
                addonBefore={selectBefore}
                type="number"
                placeholder="Value"
                style={{ width: 200 }}
                value={filters.totalCallValue}
                onChange={(value) =>
                  handleFilterChange({
                    target: { name: "totalCallValue", value },
                  })
                }
              />
            </div>
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
            filename={`Report Recall`}
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

export default Recall;
