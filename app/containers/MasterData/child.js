import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  PageHeader,
  Select,
  Spin,
  Modal,
  DatePicker,
  Card,
  Popover,
  Space,
} from "antd";
import {
  get,
  create,
  getDataFromAccurate,
  getDataCallHistories,
} from "../../service/endPoint";
import {
  ErrorMessage,
  formatCurrency,
  SuccessMessage,
} from "../../helper/publicFunction";
import { WhatsAppOutlined } from "@ant-design/icons";
import "../../assets/base.scss";
import moment from "moment-timezone";

import { debounce } from "lodash";
import {
  FORMAT_DATE_FULL,
  FORMAT_DATE_FILTER_ACC,
  FORMAT_DATE_LABEL_FULL,
} from "../../helper/constanta";

const { RangePicker } = DatePicker;

const SalesInvoiceTable = () => {
  const [selectDB, setSelectDB] = useState(0);
  const [selectStatus, setSelectStatus] = useState("true");
  const [selectCustomers, setSelectCustomers] = useState([]);
  const [dataCustomers, setDataCustomers] = useState([]);

  const [dataWhatsappMap, setdataWhatsappMap] = useState(new Map());

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

  const [dueDate, setDueDate] = useState([
    moment()
      .clone()
      .startOf("month")
      .format(FORMAT_DATE_FILTER_ACC),
    moment().format(FORMAT_DATE_FILTER_ACC),
  ]);

  const [invoiceDate, setInvoiceDate] = useState([
    moment()
      .clone()
      .startOf("month")
      .format(FORMAT_DATE_FILTER_ACC),
    moment().format(FORMAT_DATE_FILTER_ACC),
  ]);

  const [callHistoriesMap, setCallHistoriesMap] = useState(new Map());
  const [listInvoices, setListInvoices] = useState([]);

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
      title: "Terakhir Recall",
      dataIndex: "totalCall",
      key: "totalCall",
      width: 180,
      render: (value, record) => (
        <Space size="small">
          <p style={{ margin: 0 }}>
            {record.lastCall
              ? moment(record.lastCall).format(FORMAT_DATE_LABEL_FULL)
              : "-"}
          </p>
          <Button
            type="dashed"
            size="small"
            onClick={() => handleOpenModal(record)}
            danger
          >
            {value || 0}
          </Button>
        </Space>
      ),
    },

    {
      title: "Nama Kustomer",
      dataIndex: "customerName",
      key: "customerName",
      width: 250,
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === "customerName" ? sortedInfo.order : null,
      showSorterTooltip: false,
    },
    {
      title: "No. Invoice",
      dataIndex: "number",
      key: "number",
      width: 200,
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
      title: "Tgl. Faktur",
      dataIndex: "transDateView",
      key: "transDateView",
      width: 150,
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === "transDateView" ? sortedInfo.order : null,
      showSorterTooltip: false,
    },
    {
      title: "Tgl. Jatuh Tempo",
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
        <div style={{ textAlign: "right" }}>{formatCurrency(value)}</div>
      ),
    },
    {
      title: "No. Handphone",
      dataIndex: "whatsapp2",
      key: "whatsapp2",
      width: 150,
    },
  ];

  const detailColumns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 50,
      render: (value, item, index) => {
        return index + 1;
      },
    },
    {
      title: "Tanggal",
      width: 120,
      dataIndex: "created_at",
      key: "created_at",
      render: (value, record) => (
        <div>{value ? moment(value).format(FORMAT_DATE_LABEL_FULL) : "-"}</div>
      ),
    },
    { title: "Dikirim ke", width: 120, dataIndex: "phone_no", key: "phone_no" },
    {
      title: "Pesan",
      width: 250, // Make the column narrower
      dataIndex: "message",
      key: "message",
      render: (text) => {
        const previewText =
          text.length > 40 ? `${text.substring(0, 40)}...` : text;

        const content = (
          <div style={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>{text}</div>
        );

        return (
          <Popover content={content} title="Full Message" trigger="click">
            <span style={{ cursor: "pointer" }}>{previewText}</span>
          </Popover>
        );
      },
    },
    { title: "Status", width: 120, dataIndex: "status", key: "status" },
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
      });
      queryCustomer = `&customerFilter=[${encodeURIComponent(cust.join(","))}]`;
    }

    const tempDueDate = `{"type": "at-date","operator": null,"date": "${
      dueDate[0]
    }","endDate": "${dueDate[1]}"}`;

    const queryDueDate =
      dueDate[0] && dueDate[1]
        ? `&dueDateFilter=${encodeURIComponent(tempDueDate)}`
        : "";

    const tempInvoiceDate = `{"type": "at-date","operator": null,"amount": null,"date": "${
      invoiceDate[0]
    }","endDate": "${invoiceDate[1]}"}`;

    const queryInvoiceDate =
      invoiceDate[0] && invoiceDate[1]
        ? `&transDateFilter=${encodeURIComponent(tempInvoiceDate)}`
        : "";

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
      api_url: `${host}/accurate/api/sales-invoice/list.do?fields=id,number,transDate,currencyId,dueDate,customer,totalAmount&sp.pageSize=${pageSize}&sp.page=${current}${queryStatus}${queryCustomer}${querySort}${queryDueDate}${queryInvoiceDate}`,
    };

    try {
      const response = await getDataFromAccurate(body);
      const data = response.d || [];

      const invoices = data.map((x) => x.number);
      // setListInvoices(invoices);

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

          const wa = dataWhatsappMap.get(x.customer.name) || {};

          const callHistory = callHistoriesMap.get(x.number) || {};

          return {
            ...x,
            key: x.id,
            invoiceLink: `https://pay.mitranpack.com/?q=${hash}`,
            customerName: x.customer && x.customer.name ? x.customer.name : "-",
            colorWarning,
            whatsapp: wa.whatsapp || "",
            whatsapp2: wa.whatsapp2 || "",
            hash,
            totalCall: callHistory.total,
            calls: callHistory.data,
            lastCall: callHistory.lastCall,
          };
        }),
        totalData:
          response.sp && response.sp.rowCount ? response.sp.rowCount : 0,
      });
      setSelectedRows([]);

      setListInvoices((currentInvoices) => {
        if (
          JSON.stringify(currentInvoices.sort()) !==
          JSON.stringify(invoices.sort())
        ) {
          return invoices;
        }
        return currentInvoices;
      });
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

  const getDataWA = async () => {
    const tableName = "customer_contact";
    try {
      const response = await get(tableName);
      if (response.data.length > 0) {
        const waMap = new Map(
          response.data
            .filter((x) => x.whatsapp2 || x.whatsapp)
            .map((x) => [x.company, x])
        );
        setdataWhatsappMap(waMap);
      }
    } catch (error) {
      ErrorMessage(error);
    }
  };

  const getCallHistories = async (ids) => {
    try {
      if (!ids.length) {
        return;
      }
      const response = await getDataCallHistories(
        "call_history",
        ids.join(",")
      );

      if (response.data.length > 0) {
        const callHist = response.data.reduce((map, x) => {
          if (!map.has(x.invoice)) {
            map.set(x.invoice, { data: [], total: 0 });
          }
          const entry = map.get(x.invoice);
          entry.data.push(x);
          entry.total += 1;
          entry.lastCall = x.created_at;
          return map;
        }, new Map());

        setCallHistoriesMap(callHist);
      } else {
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
  const sendMessage = async (invoices) => {
    if (invoices.length === 0) return;

    const db = databases.find((x) => x.id === selectDB);

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

        const grandTotal = customerInvoices.reduce(
          (acc, item) => acc + item.totalAmount,
          0
        );

        const phoneNo = customerInvoices[0].whatsapp2;

        // Grouping
        const invoicesByDueDate = customerInvoices.reduce((acc, invoice) => {
          const { dueDateView } = invoice;
          if (!acc[dueDateView]) {
            acc[dueDateView] = [];
          }
          acc[dueDateView].push(invoice);
          return acc;
        }, {});

        // Sorting (terlama → terbaru) dan ubah ke array
        const sortedInvoicesArray = Object.entries(invoicesByDueDate)
          .sort((a, b) => new Date(a[0]) - new Date(b[0]))
          .map(([dueDateView, invoices]) => ({
            dueDateView,
            invoices,
          }));

        let message = `Dengan hormat bagian keuangan ${customerName},\n\nTerima kasih atas kerjasama bisnis dengan anda.\n\nBerikut adalah daftar faktur penjualan yang telah diterbitkan:\n\n`;

        // Add the main heading for the list of invoices
        message += `Faktur yang sudah / akan jatuh tempo\n`;

        // Iterate through each due date group and add them to the message
        let counter = 1; // Start a global counter for the numbered list
        for (const group of sortedInvoicesArray) {
          message += `•   Tanggal : *${group.dueDateView}*\n`;

          const invoiceList = group.invoices
            .map(
              (invoice) =>
                `${counter++}. Faktur penjualan ${
                  invoice.number
                } - Rp. ${formatCurrency(invoice.totalAmount)}`
            )
            .join("\n");

          message += `${invoiceList}\n\n`;
        }

        const invoiceLinks =
          "https://pay.mitranpack.com/?q=" +
          customerInvoices.map((invoice) => invoice.hash).join(",");

        message += `*Total Invoice: Rp. ${formatCurrency(
          grandTotal
        )}*\n\nTerlampir link dokumen invoice dibawah ini:\n\n${invoiceLinks}\n\nTerima Kasih,\n${
          db.dbname
        }`;

        const now = moment()
          .tz("Asia/Jakarta")
          .format(FORMAT_DATE_FULL);

        const invoicesToSend = customerInvoices.map((x) => x.number);

        await create("call_history", {
          invoices: invoicesToSend,
          created_at: now,
          phone_no: phoneNo,
          message,
          customer_name: customerName,
        });

        SuccessMessage("send WA ke " + customerName);
      }
    }

    getCallHistories(listInvoices);
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
    getDataWA();
  }, []);

  useEffect(() => {
    if (selectDB) {
      getCustomers(1, "", databases, selectDB);
    }
  }, [selectDB, databases]); // <-- Added databases as a dependency

  useEffect(() => {
    if (listInvoices) {
      getCallHistories(listInvoices);
    }
  }, [listInvoices]);

  useEffect(() => {
    if (selectDB) {
      getData();
    }
  }, [
    selectDB,
    pagination,
    selectStatus,
    selectCustomers,
    databases,
    dataWhatsappMap,
    dueDate,
    callHistoriesMap,
    invoiceDate,
  ]); // <-- Added databases as a dependency

  // --- Render JSX ---
  const rowSelection = {
    selectedRowKeys: selectedRows.map((row) => row.key),
    onChange: (selectedRowKeys, selectedRows) => {
      handleSelectRows(selectedRowKeys, selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: !record.whatsapp2,
    }),
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

        {/* Filters enclosed in a Card */}

        <div className="kanban__main-wrapper">
          <Card style={{ margin: 16 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                alignItems: "flex-end",
              }}
            >
              {/* Database Select */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: 4 }}>Database:</label>
                <Select
                  className="database-select"
                  value={selectDB}
                  onChange={handleDBChange}
                  style={{ width: 250 }}
                >
                  {databases.map((item) => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.dbname}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {/* Status Select */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: 4 }}>Status:</label>
                <Select
                  className="status-select"
                  value={selectStatus}
                  onChange={setSelectStatus}
                  style={{ width: 250 }}
                >
                  <Select.Option value="true" key="outstanding">
                    Belum Lunas
                  </Select.Option>
                  <Select.Option value="false" key="paid">
                    Lunas
                  </Select.Option>
                </Select>
              </div>

              {/* Invoice Date Range Picker */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: 4 }}>Tanggal Invoice:</label>
                <RangePicker
                  defaultValue={[
                    moment(invoiceDate[0], FORMAT_DATE_FILTER_ACC),
                    moment(invoiceDate[1], FORMAT_DATE_FILTER_ACC),
                  ]}
                  format={FORMAT_DATE_FILTER_ACC}
                  onChange={(value, dateString) => setInvoiceDate(dateString)}
                  style={{ width: 250 }}
                />
              </div>

              {/* Due Date Range Picker */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: 4 }}>Jatuh Tempo:</label>
                <RangePicker
                  defaultValue={[
                    moment(dueDate[0], FORMAT_DATE_FILTER_ACC),
                    moment(dueDate[1], FORMAT_DATE_FILTER_ACC),
                  ]}
                  format={FORMAT_DATE_FILTER_ACC}
                  onChange={(value, dateString) => setDueDate(dateString)}
                  style={{ width: 250 }}
                />
              </div>

              {/* Customer Select */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: 4 }}>Customer:</label>
                <Select
                  mode="multiple"
                  allowClear
                  className="customer-select"
                  placeholder="Pilih Customer"
                  value={selectCustomers}
                  onChange={handleCustomerChange}
                  style={{ minWidth: 250 }}
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
          </Card>
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

      {/* Modal remains the same */}
      <Modal
        title={`Recall Detail - ${selectedRecord ? selectedRecord.number : ""}`}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={1000}
      >
        {selectedRecord && (
          <Table
            columns={detailColumns}
            dataSource={selectedRecord.calls || []}
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
