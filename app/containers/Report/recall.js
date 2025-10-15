import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Select,
  InputNumber,
  Progress,
} from "antd"; // Import Progress
import {
  get,
  getDataFromAccurate,
  reportRecall,
  update,
} from "../../service/endPoint";
import { ErrorMessage, formatCurrency } from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
import {
  ExportOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const { Option } = Select;

const Recall = () => {
  const [data, setData] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingSync, setLoadingSync] = useState(false);

  // Progress Bar States
  const [isSyncing, setIsSyncing] = useState(false); // New state to control progress bar visibility
  const [progressCount, setProgressCount] = useState(0); // New state for current progress count
  const [totalInvoicesToSync, setTotalInvoicesToSync] = useState(0); // New state for total count

  const [filters, setFilters] = useState({
    invoice: "",
    customer: "",
    totalCallValue: "all",
    totalCallOperator: "=",
    status: "unpaid",
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
    {
      title: "Status",
      dataIndex: "status_invoice",
      key: "status_invoice",
      width: 100,
      sorter: (a, b) => a.status_invoice.localeCompare(b.status_invoice),
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
      })
      .catch((error) => {
        ErrorMessage(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getStatusInvoice = async () => {
    // Reset progress states
    setProgressCount(0);
    setTotalInvoicesToSync(0);
    setLoadingSync(true);
    setIsSyncing(true);

    try {
      const { data } = await get("status_invoice");
      if (!data.length) {
        console.warn("No invoice data found");
        return;
      }

      if (!databases.length) {
        console.error("Databases list is empty");
        return;
      }

      const invoicesToProcess = data.map((item) => item.invoice);
      setTotalInvoicesToSync(invoicesToProcess.length); // Set total count

      const dbBli = databases.find((x) => x.dbname.includes("Lak"));
      const dbMitran = databases.find((x) => x.dbname.includes("Mit"));

      const getDb = (invoice) =>
        invoice.startsWith("BLIN") ? dbBli : dbMitran;

      // Map data to an array of promises
      const syncPromises = data.map(async (item) => {
        const { invoice } = item;
        const db = getDb(invoice);

        if (!db) {
          console.warn(`Database not found for invoice: ${invoice}`);
          // Still increment count even if DB is missing
          setProgressCount((prev) => prev + 1);
          return;
        }

        const { token, host, session } = db;
        // Simplified API URL construction for clarity
        const apiUrl = `${host}/accurate/api/sales-invoice/list.do?fields=id,number,statusName&sp.pageSize=100&sp.page=1&filter.number.val=${invoice}&filter.number.op=EQUAL`;

        const body = { session, token, api_url: apiUrl };

        try {
          const response = await getDataFromAccurate(body);
          const dataAccurate = response.d || [];

          if (dataAccurate.length > 0) {
            const status = dataAccurate[0].statusName;
            if (status === "Lunas") {
              console.log(`✅ Updating invoice: ${invoice}`);
              await update("status_invoice", { invoice });
            }
          }
        } catch (err) {
          console.error(
            `❌ Error processing invoice ${invoice}:`,
            err.message || err
          );
        } finally {
          // Increment progress count after processing an invoice, regardless of success
          // Use the functional update to avoid stale state issues in a loop
          setProgressCount((prev) => prev + 1);
        }
      });

      // Wait for all promises to settle
      await Promise.allSettled(syncPromises);
    } catch (error) {
      console.error("getStatusInvoice error:", error);
    } finally {
      setLoadingSync(false);
      setIsSyncing(false); // Hide progress bar
      getData(); // Refresh data after all updates are complete
    }
  };

  const getDatabase = async () => {
    const tableName = "accurate";
    try {
      const response = await get(tableName);
      setDatabases(response.data);
    } catch (error) {
      ErrorMessage(error);
    }
  };

  useEffect(() => {
    getData();
    getDatabase();
  }, []);

  // ... (Rest of the useEffect and handleFilterChange remain the same)
  useEffect(() => {
    const applyFilters = () => {
      const filtered = data.filter((item) => {
        const invoice = filters.invoice || "";
        const customer = filters.customer_name || "";
        const totalRecall = filters.totalCallValue || "all";
        const operator = filters.totalCallOperator || "=";
        const status = filters.status || "unpaid";

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

        let statusMatch = true;
        if (status != "all") {
          statusMatch = item.status_invoice == status;
        }

        return invoiceMatch && customerMatch && recallMatch && statusMatch;
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
  // ... (selectBefore remains the same)
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

  // Calculate percentage for the progress bar
  const progressPercent =
    totalInvoicesToSync > 0
      ? Math.round((progressCount / totalInvoicesToSync) * 100)
      : 0;

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

          {/* ... (Total Call Filter) */}
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

          {/* ... (Status Filter) */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: 4 }}>Status:</label>
            <Select
              placeholder="Status"
              style={{ width: 200 }}
              allowClear
              defaultValue={filters.status}
              onChange={(value) =>
                handleFilterChange({ target: { name: "status", value } })
              }
            >
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="paid">Paid</Select.Option>
              <Select.Option value="unpaid">Unpaid</Select.Option>
            </Select>
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

          {/* Sync Status Button */}
          <Button
            loading={loadingSync}
            type="danger"
            style={{ marginTop: 25 }}
            onClick={getStatusInvoice}
            icon={<SyncOutlined />}
            disabled={isSyncing} // Disable during sync to prevent multiple presses
          >
            Sync Status
          </Button>
        </div>

        {/* Progress Bar Display */}
        {isSyncing && totalInvoicesToSync > 0 && (
          <div style={{ width: "90%", marginTop: 16 }}>
            <Progress
              percent={progressPercent}
              status={progressPercent === 100 ? "success" : "active"}
              format={() =>
                `${progressCount} / ${totalInvoicesToSync} Invoices`
              }
            />
          </div>
        )}

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

export default Recall;
