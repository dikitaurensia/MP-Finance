import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  PageHeader,
  Select,
  Modal,
  DatePicker,
  Card,
  Popover,
  Space,
  Input,
  List,
  Avatar,
  InputNumber,
} from "antd";
import {
  get,
  update,
  create,
  getDataFromAccurate,
  getDataCallHistories,
} from "../../service/endPoint";
import {
  ErrorMessage,
  formatCurrency,
  SuccessMessage,
} from "../../helper/publicFunction";
import {
  CheckCircleTwoTone,
  ExclamationCircleOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import "../../assets/base.scss";
import moment from "moment-timezone";

import {
  FORMAT_DATE_FULL,
  FORMAT_DATE_FILTER_ACC,
  FORMAT_DATE_LABEL_FULL,
} from "../../helper/constanta";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;
const form = "master-data-";

const defaultSelectDb = localStorage.getItem(`${form}selectDB`) || 0;
const defaultSelectStatus =
  localStorage.getItem(`${form}selectStatus`) || "true";
const defaultSelectCustomer =
  localStorage.getItem(`${form}selectCustomer`) || "";
const defaultSelectBilledBy = localStorage.getItem(`${form}selectBilledBy`)
  ? localStorage.getItem(`${form}selectBilledBy`).split(",")
  : [];
const defaultTotalCallOperator =
  localStorage.getItem(`${form}totalCallOperator`) || ">=";
const defaultTotalCallValue =
  localStorage.getItem(`${form}totalCallValue`) || 0;
const defaultDueDate = localStorage.getItem(`${form}dueDate`)
  ? localStorage.getItem(`${form}dueDate`).split(",")
  : [
      moment()
        .clone()
        .startOf("month")
        .format(FORMAT_DATE_FILTER_ACC),
      moment().format(FORMAT_DATE_FILTER_ACC),
    ];
const defaultInvoiceDate = localStorage.getItem(`${form}invoiceDate`)
  ? localStorage.getItem(`${form}invoiceDate`).split(",")
  : [
      moment()
        .clone()
        .startOf("month")
        .format(FORMAT_DATE_FILTER_ACC),
      moment().format(FORMAT_DATE_FILTER_ACC),
    ];

const SalesInvoiceTable = () => {
  // filter
  const [selectDB, setSelectDB] = useState(defaultSelectDb);
  const [selectStatus, setSelectStatus] = useState(defaultSelectStatus);
  const [selectCustomer, setSelectCustomer] = useState(defaultSelectCustomer);
  const [selectBilledBy, setSelectBilledBy] = useState(defaultSelectBilledBy);
  const [totalCallOperator, setTotalCallOperator] = useState(
    defaultTotalCallOperator
  );
  const [totalCallValue, setTotalCallValue] = useState(defaultTotalCallValue);
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [invoiceDate, setInvoiceDate] = useState(defaultInvoiceDate);

  //data
  const [dataWhatsappMap, setdataWhatsappMap] = useState(new Map());
  const [databases, setDatabases] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [callHistoriesMap, setCallHistoriesMap] = useState(new Map());
  const [listInvoices, setListInvoices] = useState([]);

  //loading
  const [loadingTable, setLoadingTable] = useState(false);

  // State for modal recall
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // State for modal edit phone number
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  const handleOpenModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleOpenModalEdit = (record) => {
    setEditRecord(record);
    setIsEditModalOpen(true);
  };

  const handleCloseModalEdit = () => {
    setIsEditModalOpen(false);
    setEditRecord(null);
  };

  const handleSavePhoneNumber = async () => {
    const tableName = "customer_contact";
    try {
      const response = await update(tableName, {
        phone_no: editRecord.whatsapp2,
        customer_name: editRecord.customerName,
      });
      if (response) {
        setIsEditModalOpen(false);
        setEditRecord(null);
        getDataWA();
      }
    } catch (error) {
      ErrorMessage(error);
    } finally {
      SuccessMessage("Update phone number successful");
    }
  };

  const saveFilterLocal = () => {
    localStorage.setItem(`${form}selectDB`, selectDB);
    localStorage.setItem(`${form}selectStatus`, selectStatus);
    localStorage.setItem(`${form}selectCustomer`, selectCustomer);
    localStorage.setItem(`${form}selectBilledBy`, selectBilledBy);
    localStorage.setItem(`${form}totalCallOperator`, totalCallOperator);
    localStorage.setItem(`${form}totalCallValue`, totalCallValue);
    localStorage.setItem(`${form}dueDate`, dueDate);
    localStorage.setItem(`${form}invoiceDate`, invoiceDate);
  };

  // const loadFilterLocal = () => {
  //   const compareAndSet = (
  //     localValue,
  //     currentValue,
  //     setState,
  //     isArray = false
  //   ) => {
  //     if (localValue == null) return;
  //     const parsedValue = isArray ? localValue.split(",") : localValue;

  //     // hanya set state jika beda dari nilai sekarang
  //     const isDifferent = isArray
  //       ? JSON.stringify(parsedValue) !== JSON.stringify(currentValue)
  //       : parsedValue !== currentValue;

  //     if (isDifferent) setState(parsedValue);
  //   };

  //   compareAndSet(
  //     localStorage.getItem(`${form}selectDB`),
  //     selectDB,
  //     setSelectDB
  //   );
  //   compareAndSet(
  //     localStorage.getItem(`${form}selectStatus`),
  //     selectStatus,
  //     setSelectStatus
  //   );
  //   compareAndSet(
  //     localStorage.getItem(`${form}selectCustomer`),
  //     selectCustomer,
  //     setSelectCustomer
  //   );
  //   compareAndSet(
  //     localStorage.getItem(`${form}selectBilledBy`),
  //     selectBilledBy,
  //     setSelectBilledBy,
  //     true
  //   );
  //   compareAndSet(
  //     localStorage.getItem(`${form}totalCallOperator`),
  //     totalCallOperator,
  //     setTotalCallOperator
  //   );
  //   compareAndSet(
  //     localStorage.getItem(`${form}totalCallValue`),
  //     totalCallValue,
  //     setTotalCallValue
  //   );
  //   compareAndSet(
  //     localStorage.getItem(`${form}dueDate`),
  //     dueDate,
  //     setDueDate,
  //     true
  //   );
  //   compareAndSet(
  //     localStorage.getItem(`${form}invoiceDate`),
  //     invoiceDate,
  //     setInvoiceDate,
  //     true
  //   );
  // };

  // Handle changes to filter inputs
  const handleValueEditChange = (e) => {
    const { name, value } = e.target;
    setEditRecord((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 50,
      fixed: "left",
      render: (value, item, index) => {
        return index + 1;
      },
    },
    {
      title: "Last Recall",
      dataIndex: "totalCall",
      key: "totalCall",
      width: 200,
      fixed: "left",
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
      sorter: (a, b) => (a.totalCall || 0) - (b.totalCall || 0),
    },

    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      width: 250,
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
      fixed: "left",
    },
    {
      title: "Invoice Number",
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
      sorter: (a, b) => a.number.localeCompare(b.number),
    },
    {
      title: "Invoice Date",
      dataIndex: "transDateView",
      key: "transDateView",
      width: 150,
      sorter: (a, b) => new Date(a.transDate) - new Date(b.transDate),
    },
    {
      title: "Due Date",
      dataIndex: "dueDateView",
      key: "dueDateView",
      width: 150,
      render: (value, record) => (
        <div style={{ color: record.colorWarning }}>{value}</div>
      ),
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      render: (value) => (
        <div style={{ textAlign: "right" }}>{formatCurrency(value)}</div>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Outstanding",
      dataIndex: "primeOwing",
      key: "primeOwing",
      width: 150,
      render: (value) => (
        <div style={{ textAlign: "right" }}>{formatCurrency(value)}</div>
      ),
      sorter: (a, b) => a.primeOwing - b.primeOwing,
    },
    {
      title: "Billed by",
      dataIndex: "billedBy",
      key: "billedBy",
      width: 100,
      sorter: (a, b) => a.billedBy.localeCompare(b.billedBy),
    },
    {
      title: "Handphone",
      dataIndex: "whatsapp2",
      key: "whatsapp2",
      width: 150,
      render: (value, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => handleOpenModalEdit(record)}
          disabled={record.whatsapp2Verified == "true"}
          style={{ color: "black" }}
          icon={
            record.whatsapp2Verified == "true" ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            ) : (
              <CheckCircleTwoTone twoToneColor="#a2a2a2ff" />
            )
          }
        >
          {value || "-"}
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
      title: "Date",
      width: 120,
      dataIndex: "created_at",
      key: "created_at",
      render: (value, record) => (
        <div>{value ? moment(value).format(FORMAT_DATE_LABEL_FULL) : "-"}</div>
      ),
    },
    { title: "Sent to", width: 120, dataIndex: "phone_no", key: "phone_no" },
    {
      title: "Message",
      width: 250,
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

    let allData = [];
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const body = {
        session,
        token,
        api_url: `${host}/accurate/api/sales-invoice/list.do?fields=id,number,transDate,currencyId,dueDate,customer,totalAmount,primeOwing&sp.pageSize=100&sp.page=${page}${queryStatus}${queryDueDate}${queryInvoiceDate}`,
      };
      const response = await getDataFromAccurate(body);
      const data = response.d || [];
      allData = [...allData, ...data];

      if (data.length < 100) {
        hasMore = false;
      } else {
        page++;
      }
    }

    try {
      const invoices = allData.map((x) => x.number);

      const masterData = allData.map((x) => {
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

        const callHistory = callHistoriesMap.get(x.number) || { total: 0 };

        return {
          ...x,
          key: x.id,
          invoiceLink: `https://pay.mitranpack.com/?q=${hash}`,
          customerName: x.customer && x.customer.name ? x.customer.name : "-",
          colorWarning,
          whatsapp: wa.whatsapp || "",
          whatsapp2: wa.whatsapp2 || "",
          billedBy: wa.billed_by || "-",
          whatsapp2Verified: wa.whatsapp2_verify || false,
          hash,
          totalCall: callHistory.total,
          calls: callHistory.data,
          lastCall: callHistory.lastCall,
        };
      });

      setDataSource(masterData);
      setFilteredData(masterData);
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
      saveFilterLocal();
    }
  };

  const getDatabase = async () => {
    const tableName = "accurate";
    try {
      const response = await get(tableName);
      setDatabases(response.data);
      if (response.data.length > 0 && selectDB == 0) {
        const selDB = localStorage.getItem(`${form}selectDB`);
        const val = selDB > 0 ? selDB : response.data[0].id;
        setSelectDB(val);
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

  const handleDBChange = (value) => {
    setSelectDB(value);
    // setSelectCustomer("");
  };

  const handleSelectRows = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // --- WhatsApp Logic ---
  const sendMessage = async (invoices) => {
    if (invoices.length === 0) return;

    const db = databases.find((x) => x.id === selectDB);
    const { token, host, session } = db;

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
          (acc, item) => acc + item.primeOwing,
          0
        );

        const phoneNo = customerInvoices[0].whatsapp2;

        const invoiceId = customerInvoices[0].id;
        const body = {
          session,
          token,
          api_url: `${host}/accurate/api/sales-invoice/detail.do?id=${invoiceId}`,
        };

        const response = await getDataFromAccurate(body);
        const detail = response.d || {};
        const vaNumber = detail.vaNumber || "";

        const dataBank = {
          accountName:
            db.dbname == "CV. Boss Lakban Indonesia"
              ? "BOSS LAKBAN INDONESIA, CV"
              : "MITRA ANUGERAH PACKINDO",
          accountNumber:
            db.dbname == "CV. Boss Lakban Indonesia"
              ? "2118888028"
              : "2118398888",
        };

        let payment = "";
        if (vaNumber && grandTotal >= 500000) {
          payment = `Pembayaran transfer ke BCA Virtual Account: *Mitran Pack* Dengan no : *${vaNumber}*`;
        } else {
          payment = `Pembayaran transfer ke Bank BCA: *${
            dataBank.accountName
          }* Dengan no : *${dataBank.accountNumber}*`;
        }

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
        message += `Faktur yang sudah/ akan jatuh tempo\n`;

        // Iterate through each due date group and add them to the message
        let counter = 1; // Start a global counter for the numbered list
        for (const group of sortedInvoicesArray) {
          message += `•   Tanggal : *${group.dueDateView}*\n`;

          const invoiceList = group.invoices
            .map(
              (invoice) =>
                `${counter++}. Faktur penjualan ${
                  invoice.number
                } - Rp. ${formatCurrency(invoice.primeOwing)}`
            )
            .join("\n");

          message += `${invoiceList}\n\n`;
        }

        const invoiceLinks =
          "https://pay.mitranpack.com/?q=" +
          customerInvoices.map((invoice) => invoice.hash).join(",");

        message += `*Total Invoice: Rp. ${formatCurrency(
          grandTotal
        )}*\n\n${payment}\n\nTerlampir link dokumen invoice dibawah ini:\n\n${invoiceLinks}\n\nTerima Kasih,\n${
          db.dbname
        }`;

        const now = moment()
          .tz("Asia/Jakarta")
          .format(FORMAT_DATE_FULL);

        const invoicesToSend = customerInvoices.map((x) => {
          return { number: x.number, total_amount: x.primeOwing };
        });

        await create("call_history", {
          invoices: invoicesToSend,
          created_at: now,
          phone_no: phoneNo,
          message,
          customer_name: customerName,
        });

        SuccessMessage("send WA ke " + customerName);
        await delay(10000);
      }
    }

    getCallHistories(listInvoices);
  };

  const generateMultipleWhatsApp = () => {
    const invoiceWithoutWAVerify = selectedRows.filter(
      (row) => row.whatsapp2Verified != "true"
    );
    if (invoiceWithoutWAVerify.length > 0) {
      const uniqueByCompany = [
        ...new Map(
          selectedRows.map((item) => [item.customerName, item])
        ).values(),
      ].sort((a, b) => {
        const av = a.whatsapp2Verified === "false" ? 1 : 0;
        const bv = b.whatsapp2Verified === "false" ? 1 : 0;
        return bv - av;
      });
      confirm({
        title: "Send message? Some phone numbers are not verified.",
        icon: <ExclamationCircleOutlined />,
        content: (
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              paddingRight: "10px",
            }}
          >
            <List
              grid={{ gutter: 4, column: 3 }}
              size="small"
              bordered
              dataSource={uniqueByCompany}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{ backgroundColor: "#fff" }}
                        icon={
                          <CheckCircleTwoTone
                            twoToneColor={
                              item.whatsapp2Verified == "true"
                                ? "#52c41a"
                                : "#a2a2a2ff"
                            }
                          />
                        }
                      />
                    }
                    title={item.customerName}
                    description={item.whatsapp2 || item.whatsapp || "-"}
                  />
                </List.Item>
              )}
            />
          </div>
        ),
        width: 1000,
        onOk() {
          sendMessage(selectedRows);
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } else {
      sendMessage(selectedRows);
    }
  };

  // --- useEffect Hooks ---
  useEffect(() => {
    getDatabase();
    getDataWA();
    // loadFilterLocal();
  }, []);

  useEffect(() => {
    if (listInvoices) {
      getCallHistories(listInvoices);
    }
  }, [listInvoices]);

  useEffect(() => {
    if (selectDB && dataWhatsappMap) {
      getData();
    }
  }, [
    selectDB,
    selectStatus,
    databases,
    dataWhatsappMap,
    dueDate,
    callHistoriesMap,
    invoiceDate,
  ]);

  const applyFilters = () => {
    const filtered = dataSource.filter((item) => {
      const customerMatch = item.customerName
        .toLowerCase()
        .includes(selectCustomer.toLowerCase());

      let billedByMatch = true;
      if (selectBilledBy.length !== 0) {
        billedByMatch = selectBilledBy.some((b) =>
          item.billedBy.toLowerCase().includes(b.toLowerCase())
        );
      }

      let recallMatch = true;
      if (totalCallOperator == "=")
        recallMatch = item.totalCall == totalCallValue;
      if (totalCallOperator == ">=")
        recallMatch = item.totalCall >= totalCallValue;
      if (totalCallOperator == ">")
        recallMatch = item.totalCall > totalCallValue;
      if (totalCallOperator == "<=")
        recallMatch = item.totalCall <= totalCallValue;
      if (totalCallOperator == "<")
        recallMatch = item.totalCall < totalCallValue;

      return customerMatch && billedByMatch && recallMatch;
    });
    setFilteredData(filtered);
    saveFilterLocal();
  };

  useEffect(() => {
    applyFilters();
  }, [
    selectBilledBy,
    selectCustomer,
    dataSource,
    totalCallOperator,
    totalCallValue,
  ]);

  // --- Render JSX ---
  const rowSelection = {
    selectedRowKeys: selectedRows.map((row) => row.key),
    onChange: (selectedRowKeys, selectedRows) => {
      handleSelectRows(selectedRowKeys, selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: !record.whatsapp2,
    }),
    selections: [
      {
        key: "call-is-0",
        text: "Call is 0",
        onSelect: (changableRowKeys, _) => {
          const newSelectedRowKeys = filteredData
            .filter((row) => !row.totalCall && row.whatsapp2) // Ensure whatsapp2 is present
            .map((row) => row.key);

          const newSelectedRows = filteredData.filter((row) =>
            newSelectedRowKeys.includes(row.key)
          );

          handleSelectRows(newSelectedRowKeys, newSelectedRows);
        },
      },
      {
        key: "call-is-0",
        text: "Call is not 0",
        onSelect: (changableRowKeys, _) => {
          const newSelectedRowKeys = filteredData
            .filter((row) => row.totalCall && row.whatsapp2) // Ensure whatsapp2 is present
            .map((row) => row.key);

          const newSelectedRows = filteredData.filter((row) =>
            newSelectedRowKeys.includes(row.key)
          );

          handleSelectRows(newSelectedRowKeys, newSelectedRows);
        },
      },
    ],
  };

  const selectBefore = (
    <Select
      defaultValue="="
      style={{ width: 70 }}
      value={totalCallOperator}
      onChange={(value) => setTotalCallOperator(value)}
    >
      <Option value=">="> {">="} </Option>
      <Option value=">"> {">"} </Option>
      <Option value="="> {"="} </Option>
      <Option value="<="> {"<="} </Option>
      <Option value="<"> {"<"}</Option>
    </Select>
  );

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
                    Outstanding
                  </Select.Option>
                  <Select.Option value="false" key="paid">
                    Paid
                  </Select.Option>
                </Select>
              </div>

              {/* Invoice Date Range Picker */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: 4 }}>Invoice Date:</label>
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
                <label style={{ marginBottom: 4 }}>Due Date:</label>
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

              {/* Billed by */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: 4 }}>Billed By:</label>
                <Select
                  mode="multiple"
                  allowClear
                  className="customer-select"
                  placeholder="Choose Billed By"
                  value={selectBilledBy}
                  onChange={setSelectBilledBy}
                  style={{ minWidth: 250 }}
                >
                  <Select.Option value="-">Kosong</Select.Option>
                  <Select.Option value="Grup">Grup</Select.Option>
                  <Select.Option value="Koko">Koko</Select.Option>
                  <Select.Option value="Admin">Admin</Select.Option>
                  <Select.Option value="Finance">Finance</Select.Option>
                </Select>
              </div>

              {/* Customer Select */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: 4 }}>Customer Name:</label>
                <Input
                  placeholder="Customer Name"
                  style={{ width: 250 }}
                  value={selectCustomer}
                  onChange={(e) => setSelectCustomer(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: 4 }}>Total Call:</label>
                <div style={{ display: "flex" }}>
                  <InputNumber
                    addonBefore={selectBefore}
                    type="number"
                    placeholder="Value"
                    min={0}
                    style={{ width: 250 }}
                    value={totalCallValue}
                    onChange={(value) => setTotalCallValue(value)}
                  />
                </div>
              </div>
              <Button type="primary" onClick={applyFilters}>
                Apply Filter
              </Button>
            </div>
          </Card>
          <Table
            key="masterdata"
            size="small"
            dataSource={filteredData}
            columns={columns}
            bordered={false}
            loading={loadingTable}
            pagination={false}
            rowSelection={rowSelection}
            scroll={{ x: 1300 }}
            rowClassName={() => "custom-hover-row"}
          />
        </div>
      </section>

      {/* Modal Recall */}
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
            rowClassName={() => "custom-hover-row"}
          />
        )}
      </Modal>

      {/* Modal Edit */}
      <Modal
        title={`Update Data`}
        open={isEditModalOpen}
        onCancel={handleCloseModalEdit}
        onOk={handleSavePhoneNumber}
      >
        {editRecord && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: 16,
              }}
            >
              <label style={{ width: 150 }}>Customer Name</label>
              <Input
                placeholder="Handphone"
                disabled
                value={editRecord.customerName}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <label style={{ width: 150 }}>Handphone</label>
              <Input
                placeholder="Handphone"
                value={editRecord.whatsapp2}
                onChange={(e) =>
                  handleValueEditChange({
                    target: { name: "whatsapp2", value: e.target.value },
                  })
                }
              />
            </div>
          </>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default SalesInvoiceTable;
