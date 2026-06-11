import React, { useState, useEffect } from "react";
import {
  Table,
  DatePicker,
  Button,
  Input,
  Space,
  Select,
  Modal,
  Popover,
} from "antd";
import {
  get,
  getDataCallHistories,
  getDataFromAccurate,
} from "../../service/endPoint";
import {
  FORMAT_DATE_FILTER_ACC,
  FORMAT_DATE_LABEL,
  FORMAT_DATE_LABEL_FULL,
} from "../../helper/constanta";
import moment from "moment-timezone";
import { ErrorMessage, formatCurrency } from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
import { ExportOutlined, SearchOutlined } from "@ant-design/icons";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const { RangePicker } = DatePicker;

const Outstanding = () => {
  const [selectDB, setSelectDB] = useState(0);
  const [databases, setDatabases] = useState([]);

  const [data, setData] = useState([]);
  const [dataExpanded, setDataExpanded] = useState([]);
  const [dataOriginal, setDataOriginal] = useState([]);

  const [filteredData, setFilteredData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [filterDueDate, setFilterDueDate] = useState(
    moment().format(FORMAT_DATE_FILTER_ACC)
  );

  const [filterInvoiceDate, setFilterInvoiceDate] = useState([
    moment()
      .clone()
      .startOf("month")
      .format(FORMAT_DATE_FILTER_ACC),
    moment().format(FORMAT_DATE_FILTER_ACC),
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    invoice: "",
    customer_name: "",
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
      title: "Customer Code",
      dataIndex: "customer_code",
      key: "customer_code",
      width: 110,
      sorter: (a, b) => a.customer_code.localeCompare(b.customer_code),
    },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      width: 200,
      sorter: (a, b) => a.customer_name.localeCompare(b.customer_name),
    },
    {
      title: "Total Outstanding",
      dataIndex: "totalOutstanding",
      key: "totalOutstanding",
      width: 200,
      render: (value) => (
        <div style={{ textAlign: "right" }}>{formatCurrency(value)}</div>
      ),
      sorter: (a, b) => a.totalOutstanding - b.totalOutstanding,
    },
    {
      title: "Total Invoice",
      dataIndex: "totalInvoice",
      key: "totalInvoice",
      width: 200,
      render: (value) => (
        <div style={{ textAlign: "right" }}>{formatCurrency(value)}</div>
      ),
      sorter: (a, b) => a.totalInvoice - b.totalInvoice,
    },
    {
      title: "Invoice Date",
      dataIndex: "transDateView",
      key: "transDateView",
      width: 180,
      sorter: (a, b) => new Date(a.transDateView) - new Date(b.transDateView),
    },
    {
      title: "Due Date",
      dataIndex: "dueDateView",
      key: "dueDateView",
      width: 180,
      sorter: (a, b) => new Date(a.dueDateView) - new Date(b.dueDateView),
    },
  ];

  const columnsExpand = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1,
      width: 60,
    },
    {
      title: "Customer Code",
      dataIndex: "customer_code",
      key: "customer_code",
      width: 110,
    },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      width: 200,
    },

    {
      title: "Invoice",
      dataIndex: "number",
      key: "number",
      width: 200,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      render: (value) => (
        <div style={{ textAlign: "right" }}>{formatCurrency(value)}</div>
      ),
    },
    {
      title: "Outstanding",
      dataIndex: "primeOwing",
      key: "primeOwing",
      width: 150,
      render: (value) => (
        <div style={{ textAlign: "right" }}>{formatCurrency(value)}</div>
      ),
    },
    {
      title: "Invoice Date",
      dataIndex: "transDateView",
      key: "transDateView",
      width: 180,
    },
    {
      title: "Due Date",
      dataIndex: "dueDateView",
      key: "dueDateView",
      width: 180,
    },
    {
      title: "Recall",
      dataIndex: "totalRecall",
      key: "totalRecall",
      width: 100,
      render: (value, record) => (
        <Space size="small">
          <Button
            type="dashed"
            size="small"
            onClick={() => handleOpenModal(record)}
            danger
          >
            {value}
          </Button>
        </Space>
      ),
    },
    {
      title: "Last Call",
      dataIndex: "lastCall",
      key: "lastCall",
      width: 200,
    },
  ];

  const handleOpenModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const getData = async () => {
    setIsLoading(true);

    const db = databases.find((x) => x.id === selectDB);
    const { token, host, session } = db;

    let allData = [];
    let page = 1;
    let hasMore = true;
    let queryDueDate = `&filter.dueDate.op=LESS_EQUAL_THAN&filter.dueDate.val=${filterDueDate}`;

    const tempInvoiceDate = `{"type": "at-date","operator": null,"amount": null,"date": "${
      filterInvoiceDate[0]
    }","endDate": "${filterInvoiceDate[1]}"}`;

    const queryInvoiceDate =
      filterInvoiceDate[0] && filterInvoiceDate[1]
        ? `&transDateFilter=${encodeURI(tempInvoiceDate)}`
        : "";

    while (hasMore) {
      const body = {
        session,
        token,
        api_url: `${host}/accurate/api/sales-invoice/list.do?fields=id,number,transDate,currencyId,dueDate,customer,totalAmount,primeOwing&outstandingFilter=true&sp.pageSize=100&sp.page=${page}${queryDueDate}${queryInvoiceDate}`,
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

    const ids = allData.map((x) => x.number);

    const apiCallHistory = await getDataCallHistories(
      "call_history",
      ids.join(",")
    );
    const callHist = apiCallHistory.data.reduce((map, x) => {
      if (!map.has(x.invoice)) {
        map.set(x.invoice, { data: [], total: 0 });
      }
      const entry = map.get(x.invoice);
      entry.data.push(x);
      entry.total += 1;
      entry.lastCall = x.created_at;
      return map;
    }, new Map());

    const datas = allData.map((item, index) => {
      const history = callHist.get(item.number) || {};
      return {
        ...item,
        customer_name: item.customer.name,
        customer_code: item.customer.customerNo,
        totalRecall: history.total || 0,
        lastCall: history.lastCall || "-",
        calls: history.data || [],
        id: index + 1,
      };
    });

    const summarize = summarizeInvoices(datas);
    setData(summarize);
    setFilteredData(summarize);
    setDataExpanded(datas);
    setDataOriginal(datas);
    setIsLoading(false);
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

  const summarizeInvoices = (invoices) => {
    return Object.values(
      invoices.reduce((acc, invoice) => {
        const {
          customer_name,
          customer_code,
          primeOwing,
          dueDateView,
          transDateView,
        } = invoice;

        if (!acc[customer_name]) {
          acc[customer_name] = {
            customer_name,
            customer_code,
            totalOutstanding: 0,
            totalInvoice: 0,
            dueDateView: null,
            transDateView: null,
          };
        }

        acc[customer_name].totalOutstanding += primeOwing;
        acc[customer_name].totalInvoice += 1;

        if (
          !acc[customer_name].dueDateView ||
          moment(dueDateView, FORMAT_DATE_LABEL).isAfter(
            moment(acc[customer_name].dueDateView, FORMAT_DATE_LABEL)
          )
        ) {
          acc[customer_name].dueDateView = dueDateView;
        }

        if (
          !acc[customer_name].transDateView ||
          moment(transDateView, FORMAT_DATE_LABEL).isBefore(
            moment(acc[customer_name].transDateView, FORMAT_DATE_LABEL)
          )
        ) {
          acc[customer_name].transDateView = transDateView;
        }

        return acc;
      }, {})
    );
  };

  const handleDBChange = (value) => {
    setSelectDB(value);
  };

  useEffect(() => {
    getDatabase();
  }, []);

  useEffect(() => {
    if (selectDB) {
      getData();
    }
  }, [selectDB, filterDueDate, filterInvoiceDate]);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = dataOriginal.filter((item) => {
        const customer = filters.customer_name || "";
        const invoice = filters.invoice || "";

        const customerMatch = item.customer_name
          .toLowerCase()
          .includes(customer.toLowerCase());

        const invoiceMatch = item.number
          .toLowerCase()
          .includes(invoice.toLowerCase());

        return customerMatch && invoiceMatch;
      });
      // setFilteredData(filtered);

      const summarize = summarizeInvoices(filtered);
      setFilteredData(summarize);

      setDataExpanded(filtered);
    };
    applyFilters();
  }, [filters, dataOriginal]);

  // Handle changes to filter inputs
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const expandedRow = (row) => {
    let inTable = dataExpanded.filter((x) => {
      return x.customer_name === row.customer_name;
    });
    return (
      <Table
        size="small"
        columns={columnsExpand}
        dataSource={inTable}
        pagination={false}
        rowClassName={() => "custom-hover-row"}
      />
    );
  };

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

  return (
    <div
      style={{
        padding: "24px",
        minHeight: "100vh",
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
          }}
        >
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
            <label style={{ marginBottom: 4 }}>Invoice:</label>
            <Input
              placeholder="Invoice"
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
            <label style={{ marginBottom: 4 }}>Invoice Date:</label>
            <RangePicker
              defaultValue={[
                moment(filterInvoiceDate[0], FORMAT_DATE_FILTER_ACC),
                moment(filterInvoiceDate[1], FORMAT_DATE_FILTER_ACC),
              ]}
              format={FORMAT_DATE_FILTER_ACC}
              onChange={(value, dateString) => setFilterInvoiceDate(dateString)}
              style={{ width: 250 }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: 4 }}>Due Date:</label>
            <DatePicker
              defaultValue={moment(filterDueDate, FORMAT_DATE_FILTER_ACC)}
              format={FORMAT_DATE_FILTER_ACC}
              onChange={(value, dateString) => setFilterDueDate(dateString)}
              style={{ width: 240 }}
            />
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
            filename={`Report Outstanding`}
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
            <ExcelSheet data={data} name="rangkuman">
              {columns.map((data) => (
                <ExcelColumn label={data.title} value={data.dataIndex} />
              ))}
            </ExcelSheet>
            <ExcelSheet data={dataExpanded} name="rincian">
              {columnsExpand.map((data) => (
                <ExcelColumn label={data.title} value={data.dataIndex} />
              ))}
            </ExcelSheet>
          </ExcelFile>
        </div>

        <Table
          size="small"
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          // pagination={{
          //   pageSizeOptions: ["50", "100"],
          //   showSizeChanger: true,
          //   defaultPageSize: 100,
          // }}
          pagination={false}
          // bordered
          scroll={{ x: 1000 }}
          rowKey="customer_name"
          expandable={{
            expandedRowRender: expandedRow,
            rowExpandable: (record) => record.customer_name !== null,
          }}
          rowClassName={() => "custom-hover-row"}
        />

        <Modal
          title={`Recall Detail - ${
            selectedRecord ? selectedRecord.number : ""
          }`}
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
      </Space>
    </div>
  );
};

export default Outstanding;
