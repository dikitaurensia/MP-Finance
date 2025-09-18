import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Space, PageHeader, Select, Spin, Modal } from "antd";
import { get, getDataFromAccurate } from "../../service/endPoint";
import { ErrorMessage, formatCurrency } from "../../helper/publicFunction";
import { PrinterFilled, WhatsAppOutlined } from "@ant-design/icons";
import "../../assets/base.scss";
import moment from "moment";
import { debounce } from "lodash";

const SalesInvoiceTable = () => {
  const [selectDB, setSelectDB] = useState(0);
  const [selectStatus, setSelectStatus] = useState("true");
  const [selectCustomers, setSelectCustomers] = useState([]);
  const [dataCustomers, setDataCustomers] = useState([]);
  const [dataCustomerMap, setDataCustomerMap] = useState(new Map());

  const [databases, setDatabases] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [dataSource, setDataSource] = useState({
    master_data: [],
    totalData: 0,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});

  // State for infinite scroll and search on customer filter
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerPage, setCustomerPage] = useState(1);
  const [hasMoreCustomers, setHasMoreCustomers] = useState(true);
  const [customerSearchKeyword, setCustomerSearchKeyword] = useState("");

  // State for modal recall
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleOpenModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 50,
      render: (value, item, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "Nama Customer",
      dataIndex: "customerName",
      key: "customerName",
      width: 350,
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === "customerName" ? sortedInfo.order : null,
      showSorterTooltip: false,
    },
    {
      title: "No Invoice",
      dataIndex: "number",
      key: "number",
      width: 150,
      render: (value, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => window.open(record.invoiceLink, "_blank")}
        >
          {value}
        </Button>
      ),
    },
    {
      title: "Tgl faktur",
      dataIndex: "transDateView",
      key: "transDateView",
      width: 150,
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === "transDateView" ? sortedInfo.order : null,
      showSorterTooltip: false,
    },
    {
      title: "Tgl Jatuh Tempo",
      dataIndex: "dueDateView",
      key: "dueDateView",
      width: 150,
      render: (value, record) => (
        <div style={{ color: record.colorWarning }}>{value}</div>
      ),
    },
    {
      title: "Total Nominal",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      render: (value) => (
        <div style={{ textAlign: "right" }}>Rp. {formatCurrency(value)}</div>
      ),
    },
    {
      title: "No. Whatsapp",
      dataIndex: "whatsapp",
      key: "whatsapp",
      width: 150,
    },
    {
      title: "Recall",
      dataIndex: "recall",
      key: "recall",
      width: 70,
      render: (value, record) => (
        <Button
          type="link"
          size="small"
          iconPosition="end"
          onClick={() => handleOpenModal(record)}
          style={{
            textAlign: "right",
          }}
        >
          10
        </Button>
      ),
    },
  ];

  const detailColumns = [
    { title: "Tanggal", dataIndex: "date", key: "date" },
    { title: "No. Whatsapp", dataIndex: "whatsapp", key: "whatsapp" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  // --- Data Fetching Logic ---
  const getData = async () => {
    setLoadingTable(true);
    const { current, pageSize } = pagination;
    const db = databases.find((x) => x.id === selectDB);

    if (!db) {
      setLoadingTable(false);
      return;
    }

    const { token, host, session } = db;

    let queryStatus = "";
    if (selectStatus !== "") {
      queryStatus = `&outstandingFilter=${selectStatus}`;
    }

    let queryCustomer = "";
    if (selectCustomers.length > 0) {
      const cust = selectCustomers.map((x) => {
        return `{"id": ${x}}`;
        // return `{%22id%22%3A${x}}`;
      });
      // queryCustomer = `&customerFilter=[${cust.join("%2C")}]`;
      queryCustomer = `&customerFilter=[${encodeURIComponent(cust.join(","))}]`;
    }

    // Add sorting parameter based on sortedInfo state
    let querySort = "";
    if (sortedInfo.order) {
      const order = sortedInfo.order === "ascend" ? "asc" : "desc";
      const sortFieldMap = {
        customerName: "customer.name",
        transDateView: "transDate",
      };
      const sortField = sortFieldMap[sortedInfo.columnKey];
      if (sortField) {
        querySort = `&sp.sort=${sortField}|${order}`;
      }
    }

    const body = {
      session,
      token,
      api_url: `${host}/accurate/api/sales-invoice/list.do?fields=id,number,transDate,currencyId,dueDate,customer,totalAmount&sp.pageSize=${pageSize}&sp.page=${current}${queryStatus}${queryCustomer}${querySort}`,
    };

    try {
      const response = await getDataFromAccurate(body);
      const data = response.d || [];

      setDataSource({
        master_data: data.map((x) => {
          const hash = btoa(
            `${db.dbname.toLowerCase().includes("mitra") ? "mitra" : "boss"}:${
              x.id
            }`
          );
          const dueDate = moment(x.dueDate, "DD/MM/YYYY");
          const today = moment();
          let colorWarning = "black";

          if (dueDate.isBefore(today, "day")) {
            colorWarning = "red";
          } else if (dueDate.diff(today, "days") <= 2) {
            colorWarning = "orange";
          }

          return {
            ...x,
            key: x.id,
            invoiceLink: `https://pay.mitranpack.com/?q=${hash}`,
            customerName: x.customer && x.customer.name ? x.customer.name : "-",
            colorWarning,
            whatsapp:
              dataCustomerMap.get(
                x.customer && x.customer.id ? x.customer.id : null
              ) || "",
            hash,
          };
        }),
        totalData:
          response.sp && response.sp.rowCount ? response.sp.rowCount : 0,
      });
      setSelectedRows([]);
    } catch (error) {
      ErrorMessage(error);
    } finally {
      setLoadingTable(false);
    }
  };

  const getDatabase = async () => {
    const tableName = "accurate";
    try {
      const response = await get(tableName);
      setDatabases(response.data);
      if (response.data.length > 0) {
        setSelectDB(response.data[0].id);
      }
    } catch (error) {
      ErrorMessage(error);
    }
  };

  // --- Customers Fetch ---
  const getCustomers = async (
    page = 1,
    keyword = "",
    databasesArray,
    selDB
  ) => {
    // <-- Added databasesArray parameter
    if (loadingCustomers) return;

    if (keyword !== customerSearchKeyword) {
      setDataCustomers([]);
      setDataCustomerMap(new Map());
      setCustomerPage(1);
      setHasMoreCustomers(true);
    }

    if (!hasMoreCustomers && keyword === customerSearchKeyword) return;

    setLoadingCustomers(true);
    const db = databasesArray.find((x) => x.id == selDB); // <-- Use the new parameter
    if (!db) {
      setLoadingCustomers(false);
      return;
    }

    const { token, host, session } = db;
    const pageSize = 50;
    const body = {
      session,
      token,
      api_url: `${host}/accurate/api/customer/list.do?fields=id,name&sp.pageSize=${pageSize}&sp.page=${page}${
        keyword
          ? `&filter.keywords.op=CONTAIN&filter.keywords.val=${encodeURIComponent(
              keyword
            )}`
          : ""
      }`,
    };

    try {
      const response = await getDataFromAccurate(body);
      const newCustomers = (response.d || []).map((customer) => ({
        id: customer.id,
        name: customer.name,
        whatsapp: customer.mobilePhone || customer.mobilePhone2 || "",
      }));

      setDataCustomers((prev) => [...prev, ...newCustomers]);
      const newCustomerMap = new Map(
        newCustomers.map((x) => [x.id, x.whatsapp])
      );
      setDataCustomerMap((prevMap) => new Map([...prevMap, ...newCustomerMap]));

      if (newCustomers.length < pageSize) {
        setHasMoreCustomers(false);
      }
      setCustomerPage(page + 1);
      setCustomerSearchKeyword(keyword);
    } catch (error) {
      ErrorMessage(error);
      setHasMoreCustomers(false);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // --- State Change Handlers ---
  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
    setSortedInfo(sorter);
  };

  const handleDBChange = (value) => {
    setSelectDB(value);
    setPagination({ current: 1, pageSize: 50 });
    setSelectCustomers([]);
    setDataCustomers([]);
    setDataCustomerMap(new Map());
    setCustomerPage(1);
    setHasMoreCustomers(true);
    setCustomerSearchKeyword("");
  };

  const handleCustomerChange = (value) => {
    setSelectCustomers(value);
    setPagination({ current: 1, pageSize: 50 });
  };

  const handleSelectRows = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };

  // --- WhatsApp Logic ---
  const sendMessage = (invoices) => {
    if (invoices.length === 0) return;

    const invoicesByCustomer = invoices.reduce((acc, invoice) => {
      const { customerName } = invoice;
      if (!acc[customerName]) {
        acc[customerName] = [];
      }
      acc[customerName].push(invoice);
      return acc;
    }, {});

    for (const customerName in invoicesByCustomer) {
      if (
        Object.prototype.hasOwnProperty.call(invoicesByCustomer, customerName)
      ) {
        const customerInvoices = invoicesByCustomer[customerName];
        const invoiceList = customerInvoices
          .map(
            (invoice, index) =>
              `${index + 1}. Faktur penjualan ${
                invoice.number
              } - IDR ${formatCurrency(invoice.totalAmount)}`
          )
          .join("\n");

        const invoiceLinks =
          "https://pay.mitranpack.com/?q=" +
          customerInvoices.map((invoice) => invoice.hash).join(",");

        const message = `Dengan hormat bagian keuangan ${customerName},\n\nTerima kasih atas kerjasama bisnis dengan anda.\n\nBerikut adalah daftar faktur penjualan yang telah diterbitkan:\n\n${invoiceList}\n\nTerlampir link dokumen faktur dibawah ini:\n${invoiceLinks}\n\nTerima Kasih,\nCV. Boss Lakban Indonesia`;

        window.open(
          `https://wa.me/?text=${encodeURIComponent(message)}`,
          "_blank"
        );
      }
    }
  };

  const generateMultipleWhatsApp = () => {
    sendMessage(selectedRows);
  };

  // --- Infinite Scroll & Search ---
  const handleCustomerPopupScroll = (e) => {
    const { target } = e;
    const isAtBottom =
      target.scrollHeight - target.scrollTop === target.clientHeight;
    if (isAtBottom && !loadingCustomers && hasMoreCustomers) {
      getCustomers(customerPage, customerSearchKeyword, databases, selectDB); // <-- Pass databases here
    }
  };

  const debouncedCustomerSearch = useRef(
    debounce((value, dbs, sdb) => {
      getCustomers(1, value, dbs, sdb);
    }, 500)
  ).current;

  const handleCustomerSearch = (value) => {
    debouncedCustomerSearch(value, databases, selectDB); // <-- Pass databases here
  };

  // --- useEffect Hooks ---
  useEffect(() => {
    getDatabase();
  }, []);

  useEffect(() => {
    if (selectDB) {
      getCustomers(1, "", databases, selectDB);
    }
  }, [selectDB, databases]); // <-- Added databases as a dependency

  useEffect(() => {
    if (selectDB) {
      getData();
    }
  }, [selectDB, pagination, selectStatus, selectCustomers, databases]); // <-- Added databases as a dependency

  // --- Render JSX ---
  const rowSelection = {
    selectedRowKeys: selectedRows.map((row) => row.key),
    onChange: (selectedRowKeys, selectedRows) => {
      handleSelectRows(selectedRowKeys, selectedRows);
    },
  };

  return (
    <React.Fragment>
      <section className="kanban__main">
        <section className="kanban__nav">
          <PageHeader
            className="site-page-header"
            onBack={() => window.history.back()}
            title="Sales Invoice"
            extra={[
              <Button
                key="multi-wa"
                type="primary"
                icon={<WhatsAppOutlined />}
                style={{
                  backgroundColor: "#25D366",
                  borderColor: "#25D366",
                  color: "white",
                }}
                disabled={selectedRows.length === 0}
                onClick={generateMultipleWhatsApp}
              >
                Generate WhatsApp ({selectedRows.length})
              </Button>,
            ]}
          />
        </section>
        <div
          style={{ margin: 16, display: "flex", flexWrap: "wrap", gap: "8px" }}
        >
          <div>
            <label style={{ marginRight: 8 }}>Pilih Database:</label>
            <Select
              className="database-select"
              value={selectDB}
              onChange={handleDBChange}
              style={{ width: 300 }}
            >
              {databases.map((item) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.dbname}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <label style={{ marginRight: 8 }}>Status:</label>
            <Select
              className="status-select"
              value={selectStatus}
              onChange={setSelectStatus}
              style={{ width: 150 }}
            >
              <Select.Option value="true" key="outstanding">
                Belum Lunas
              </Select.Option>
              <Select.Option value="false" key="paid">
                Lunas
              </Select.Option>
            </Select>
          </div>
        </div>
        <div
          style={{ margin: 16, display: "flex", flexWrap: "wrap", gap: "8px" }}
        >
          <div>
            <label style={{ marginRight: 8 }}>Filter Customer:</label>
            <Select
              mode="multiple"
              allowClear
              className="customer-select"
              placeholder="Pilih Customer"
              value={selectCustomers}
              onChange={handleCustomerChange}
              style={{ width: 600 }}
              onPopupScroll={handleCustomerPopupScroll}
              onSearch={handleCustomerSearch}
              filterOption={false}
              showSearch
            >
              {dataCustomers.map((item) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
                </Select.Option>
              ))}
              {loadingCustomers && (
                <div style={{ textAlign: "center", padding: "10px" }}>
                  <Spin size="small" />
                </div>
              )}
            </Select>
          </div>
        </div>
        <div className="kanban__main-wrapper">
          <Table
            key="masterdata"
            size="middle"
            dataSource={dataSource.master_data}
            columns={columns}
            bordered={false}
            scroll={{ y: 350 }}
            loading={loadingTable}
            pagination={{
              ...pagination,
              position: "bottom",
              showSizeChanger: true,
              pageSizeOptions: ["20", "50", "100"],
              total: dataSource.totalData,
            }}
            onChange={handleTableChange}
            rowSelection={rowSelection}
          />
        </div>
      </section>
      <Modal
        title={`Recall Detail - ${selectedRecord ? selectedRecord.number : ""}`}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        {selectedRecord && (
          <Table
            columns={detailColumns}
            dataSource={selectedRecord.details || []}
            rowKey="id"
            pagination={false}
            size="small"
          />
        )}
      </Modal>
    </React.Fragment>
  );
};

export default SalesInvoiceTable;
