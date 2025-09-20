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
// import moment from "moment";
import moment from "moment-timezone";

import { debounce } from "lodash";
import {
  FORMAT_DATE_FULL,
  FORMAT_DATE_FILTER_ACC,
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
      title: "Phone No.",
      dataIndex: "whatsapp2",
      key: "whatsapp2",
      width: 150,
    },
    {
      title: "Recall",
      dataIndex: "recall",
      key: "recall",
      width: 100,
      // sorter: (a, b) => a.recall - b.recall,
      // sorter: (a, b) => a.recall.localeCompare(b.recall),
      render: (value, record) => (
        <Button
          type="dashed"
          size="small"
          onClick={() => handleOpenModal(record)}
          style={{ width: 70 }}
        >
          {record.totalCall || 0}
        </Button>
      ),
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
    },
    { title: "Dikirim ke", width: 120, dataIndex: "phone_no", key: "phone_no" },
    {
      title: "Pesan",
      width: 250, // Make the column narrower
      dataIndex: "message",
      key: "message",
      render: (text) => {
        const previewText =
          text.length > 50 ? `${text.substring(0, 50)}...` : text;

        const content = (
          <div style={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>{text}</div>
        );

        return (
          <Popover content={content} title="Full Message" trigger="click">
            <span style={{ fontSize: "12px", cursor: "pointer" }}>
              {previewText}
            </span>
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

    const temp = `{"type": "at-date","operator": null,"date": "${
      dueDate[0]
    }","endDate": "${dueDate[1]}"}`;
    let queryDueDate = `&dueDateFilter=${encodeURIComponent(temp)}`;

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
      api_url: `${host}/accurate/api/sales-invoice/list.do?fields=id,number,transDate,currencyId,dueDate,customer,totalAmount&sp.pageSize=${pageSize}&sp.page=${current}${queryStatus}${queryCustomer}${querySort}${queryDueDate}`,
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
    const tableName = "customer";
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
        // setCallHistoriesMap(new Map()); // clear if no data
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
          return map;
        }, new Map());

        setCallHistoriesMap(callHist);
      } else {
        // setCallHistoriesMap(new Map()); // clear if no data
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

        const message = `Dengan hormat bagian keuangan ${customerName},\n\nTerima kasih atas kerjasama bisnis dengan anda.\n\nBerikut adalah daftar faktur penjualan yang telah diterbitkan:\n\n${invoiceList}\n\nTerlampir link dokumen faktur dibawah ini:\n\n${invoiceLinks}\n\nTerima Kasih,\nCV. Boss Lakban Indonesia`;

        const now = moment()
          .tz("Asia/Jakarta")
          .format(FORMAT_DATE_FULL);

        const invoices = customerInvoices.map((x) => x.number);
        const phoneNo = customerInvoices[0].whatsapp2;

        await create("call_history", {
          invoices,
          created_at: now,
          phone_no: phoneNo,
          message,
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
                  style={{ width: 350 }}
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
