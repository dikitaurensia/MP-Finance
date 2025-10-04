import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space } from "antd";
import { reportRecall } from "../../service/endPoint";
import { ErrorMessage, formatCurrency } from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
import { ExportOutlined, SearchOutlined } from "@ant-design/icons";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const Recall = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    invoice: "",
    customer: "",
    recall: "all",
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
        const recall = filters.recall || "all";
        const invoiceMatch = item.invoice
          .toLowerCase()
          .includes(invoice.toLowerCase());
        const customerMatch = item.customer_name
          .toLowerCase()
          .includes(customer.toLowerCase());
        const recallMatch = recall != "all" ? item.recall == recall : true;

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

          <Input
            type="number"
            placeholder="Total Call"
            style={{ width: 200 }}
            value={filters.recall}
            onChange={(e) =>
              handleFilterChange({
                target: { name: "recall", value: e.target.value },
              })
            }
          />

          <Button type="primary" onClick={getData} icon={<SearchOutlined />}>
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
