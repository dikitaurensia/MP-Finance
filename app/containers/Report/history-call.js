import React, { useState, useEffect } from "react";
import { Table, DatePicker, Button, Input, Popover, Space, Card } from "antd";

const { RangePicker } = DatePicker;

// Main application component
const App = () => {
  // Mock data to make the app runnable without a backend.
  const mockData = [
    {
      id: 1,
      customer_name: "Jane Doe",
      invoice: "INV-2023-01",
      created_at: "2023-10-26",
      phone_no: "081234567890",
      message:
        "Hello, your package has been delivered. Please confirm receipt. Thank you!",
      status: "Delivered",
    },
    {
      id: 2,
      customer_name: "John Smith",
      invoice: "INV-2023-02",
      created_at: "2023-10-26",
      phone_no: "081234567891",
      message:
        "Your order is on its way and will arrive within 3-5 business days. We appreciate your business!",
      status: "Sent",
    },
    {
      id: 3,
      customer_name: "Emily White",
      invoice: "INV-2023-03",
      created_at: "2023-10-25",
      phone_no: "081234567892",
      message:
        "This is a test message to a customer for order #2345. Thank you!",
      status: "Sent",
    },
    {
      id: 4,
      customer_name: "Michael Brown",
      invoice: "INV-2023-04",
      created_at: "2023-10-24",
      phone_no: "081234567893",
      message:
        "Your invoice is ready to be viewed and paid. Please log in to your account to view the details.",
      status: "Failed",
    },
    {
      id: 5,
      customer_name: "Sarah Davis",
      invoice: "INV-2023-05",
      created_at: "2023-10-23",
      phone_no: "081234567894",
      message:
        "Reminder: Your payment is due on October 30, 2023. Please pay on time to avoid late fees.",
      status: "Delivered",
    },
  ];

  // State for data, loading, errors, and filters
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: null,
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
      title: "Nama Kustomer",
      dataIndex: "customer_name",
      key: "customer_name",
      width: 180,
    },
    {
      title: "Invoice",
      dataIndex: "invoice",
      key: "invoice",
      width: 150,
    },
    {
      title: "Tanggal",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "Dikirim ke",
      dataIndex: "phone_no",
      key: "phone_no",
      width: 150,
    },
    {
      title: "Pesan",
      dataIndex: "message",
      key: "message",
      width: 300,
      render: (text) => (
        <Popover
          content={<div style={{ maxWidth: 400 }}>{text}</div>}
          title="Full Message"
        >
          <span style={{ cursor: "pointer", color: "#1890ff" }}>
            {text.length > 50 ? `${text.substring(0, 50)}...` : text}
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
          status === "Delivered" ? "green" : status === "Sent" ? "blue" : "red";
        return <span style={{ color, fontWeight: "bold" }}>{status}</span>;
      },
    },
  ];

  // Simulate API call to fetch data on initial component mount
  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      // Simulating a network delay
      setTimeout(() => {
        setData(mockData);
        setFilteredData(mockData);
        setIsLoading(false);
      }, 1000);
    };
    fetchData();
  }, []);

  // Filter data whenever the filters or the original data changes
  useEffect(() => {
    const applyFilters = () => {
      const filtered = data.filter((item) => {
        const [startDate, endDate] = filters.dateRange || [null, null];
        const itemDate = new Date(item.created_at);

        const dateMatch =
          !startDate ||
          !endDate ||
          (itemDate >= startDate && itemDate <= endDate);
        const invoiceMatch = item.invoice
          .toLowerCase()
          .includes(filters.invoice.toLowerCase());
        const customerMatch = item.customer_name
          .toLowerCase()
          .includes(filters.customer.toLowerCase());

        return dateMatch && invoiceMatch && customerMatch;
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

  // Helper function to handle CSV download
  const handleDownloadCSV = () => {
    if (filteredData.length === 0) return;

    // Get the headers from the column titles
    const headers = columns.map((col) => col.title);
    const csvRows = [headers.join(",")];

    filteredData.forEach((item) => {
      const row = columns
        .map((col) => {
          let value = item[col.dataIndex];
          // Special handling for the 'message' field to get the full text
          if (col.dataIndex === "message") {
            value = item.message;
          }

          if (typeof value === "string" && value.includes(",")) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",");
      csvRows.push(row);
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "call_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            placeholder="Nomor Invoice"
            style={{ width: 200 }}
            value={filters.invoice}
            onChange={(e) =>
              handleFilterChange({
                target: { name: "invoice", value: e.target.value },
              })
            }
          />
          <Input
            placeholder="Nama Customer"
            style={{ width: 200 }}
            value={filters.customer}
            onChange={(e) =>
              handleFilterChange({
                target: { name: "customer", value: e.target.value },
              })
            }
          />
          <RangePicker
            value={filters.dateRange}
            onChange={(dates) => {
              if (dates && dates.length === 2) {
                setFilters((prev) => ({
                  ...prev,
                  dateRange: [dates[0].toDate(), dates[1].toDate()],
                }));
              } else {
                setFilters((prev) => ({ ...prev, dateRange: null }));
              }
            }}
            style={{ width: 240 }}
          />
          <Button type="primary">Search</Button>
          <Button onClick={handleDownloadCSV}>Export CSV</Button>
        </div>

        {/* Data table */}
        <Table
          columns={columns}
          dataSource={filteredData.map((item) => ({ ...item, key: item.id }))}
          loading={isLoading}
          pagination={{
            pageSizeOptions: ["10", "20", "50"],
            showSizeChanger: true,
            defaultPageSize: 10,
          }}
          bordered
          scroll={{ x: 1000 }}
        />
      </Space>
    </div>
  );
};

export default App;
