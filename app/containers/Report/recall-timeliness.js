import React, { useState, useEffect } from "react";
import {
  Table,
  DatePicker,
  Button,
  Input,
  Space,
  Select,
  Popover,
  Divider,
  Alert,
} from "antd";
import {
  get,
  getDataCallHistories,
  getDataFromAccurate,
} from "../../service/endPoint";
import { FORMAT_DATE, FORMAT_DATE_FILTER_ACC } from "../../helper/constanta";
import moment from "moment-timezone";
import { ErrorMessage } from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
import { ExportOutlined, SearchOutlined } from "@ant-design/icons";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const { RangePicker } = DatePicker;

const RecallTimeliness = () => {
  const [selectDB, setSelectDB] = useState(0);
  const [databases, setDatabases] = useState([]);

  const [data, setData] = useState([]);
  const [dataExpanded, setDataExpanded] = useState([]);

  const [filteredData, setFilteredData] = useState([]);

  const [filterDate, setFilterDate] = useState(
    moment().format(FORMAT_DATE_FILTER_ACC)
  );

  const [filterDueDate, setFilterDueDate] = useState([
    moment()
      .clone()
      .startOf("month")
      .format(FORMAT_DATE_FILTER_ACC),
    moment().format(FORMAT_DATE_FILTER_ACC),
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    invoice: "",
    customer: "",
  });

  const [expandedKeys, setExpandedKeys] = useState([]);

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (text, record) => {
        return <div style={{ fontSize: 15, fontWeight: "bold" }}>{text}</div>;
        // return <Alert message={text} type="warning" />;
      },
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
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      width: 300,
      // fixed: "left",
    },
    {
      title: "Invoice",
      dataIndex: "number",
      key: "number",
      width: 250,
      // fixed: "left",
    },
    {
      title: "Due Date",
      dataIndex: "dueDateView",
      key: "dueDateView",
      width: 200,
      // fixed: "left",
    },
    {
      title: "Recall 0",
      dataIndex: "recall_0",
      key: "recall_0",
      width: 250,
      render: (text, record) => {
        const content = (
          <div style={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>
            {record.recall_0_message}
          </div>
        );

        return (
          <Popover content={content} title="Full Message" trigger="click">
            <span style={{ cursor: "pointer" }}>{text}</span>
          </Popover>
        );
      },
    },
    {
      title: "Recall 1",
      dataIndex: "recall_1",
      key: "recall_1",
      width: 250,
      render: (text, record) => {
        const content = (
          <div style={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>
            {record.recall_1_message}
          </div>
        );

        return (
          <Popover content={content} title="Full Message" trigger="click">
            <span style={{ cursor: "pointer" }}>{text}</span>
          </Popover>
        );
      },
    },
    {
      title: "Recall 2",
      dataIndex: "recall_2",
      key: "recall_2",
      width: 250,
      render: (text, record) => {
        const content = (
          <div style={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>
            {record.recall_2_message}
          </div>
        );

        return (
          <Popover content={content} title="Full Message" trigger="click">
            <span style={{ cursor: "pointer" }}>{text}</span>
          </Popover>
        );
      },
    },
    {
      title: "Recall 3",
      dataIndex: "recall_3",
      key: "recall_3",
      width: 250,
      render: (text, record) => {
        const content = (
          <div style={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>
            {record.recall_3_message}
          </div>
        );

        return (
          <Popover content={content} title="Full Message" trigger="click">
            <span style={{ cursor: "pointer" }}>{text}</span>
          </Popover>
        );
      },
    },
    {
      title: "Recall 4",
      dataIndex: "recall_4",
      key: "recall_4",
      width: 250,
      render: (text, record) => {
        const content = (
          <div style={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>
            {record.recall_4_message}
          </div>
        );

        return (
          <Popover content={content} title="Full Message" trigger="click">
            <span style={{ cursor: "pointer" }}>{text}</span>
          </Popover>
        );
      },
    },
  ];

  const getData = async () => {
    setIsLoading(true);

    const db = databases.find((x) => x.id === selectDB);
    const { token, host, session } = db;

    let allData = [];

    // for (const dueDate of filterDueDate) {
    let page = 1;
    let hasMore = true;
    // let queryDueDate = `&filter.dueDate.op=EQUAL&filter.dueDate.val=${dueDate}`;
    const tempDueDate = `{"type": "at-date","operator": null,"date": "${
      filterDueDate[0]
    }","endDate": "${filterDueDate[1]}"}`;

    const queryDueDate =
      filterDueDate[0] && filterDueDate[1]
        ? `&dueDateFilter=${encodeURIComponent(tempDueDate)}`
        : "";

    while (hasMore) {
      const body = {
        session,
        token,
        api_url: `${host}/accurate/api/sales-invoice/list.do?fields=id,number,transDate,currencyId,dueDate,customer,totalAmount,primeOwing&outstandingFilter=true&sp.pageSize=100&sp.page=${page}${queryDueDate}`,
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
    // }

    const datas = allData.map((item, index) => ({
      ...item,
      customer_name: item.customer.name,
      id: index + 1,
    }));

    const apiCallHistory = await getDataCallHistories(
      "call_history",
      datas.map((x) => x.number).join(",")
    );

    const dataCallHistories = apiCallHistory.data;

    datas.forEach((invoice) => {
      const callHistory = dataCallHistories.filter(
        (x) => x.invoice === invoice.number
      );

      const dateCalls = callHistory.map((x) => {
        return { created_at: x.created_at, message: x.message };
      });

      for (let i = 0; i <= 4; i++) {
        invoice[`recall_${i}`] = dateCalls[i] ? dateCalls[i].created_at : "";
        invoice[`recall_${i}_message`] = dateCalls[i]
          ? dateCalls[i].message
          : "";
      }
    });

    const summarize = summarizeInvoices(datas);
    setData(summarize);
    setFilteredData(summarize);
    setDataExpanded(datas);
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
        const { customer_name } = invoice;

        if (!acc[customer_name]) {
          acc[customer_name] = {
            customer_name,
          };
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
  }, [selectDB, filterDueDate]);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = data.filter((item) => {
        const customer = filters.customer_name || "";

        const customerMatch = true;
        // const customerMatch = item.customer_name
        //   .toLowerCase()
        //   .includes(customer.toLowerCase());

        return customerMatch;
      });
      setFilteredData(filtered);
    };
    applyFilters();
  }, [filters, data]);

  useEffect(() => {
    if (filteredData.length) {
      setExpandedKeys(filteredData.map((d) => d.customer_name));
    }
  }, [filteredData]);

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
        // rowClassName={(record) => {
        //   const targetDate = moment(filterDate).format(FORMAT_DATE);

        //   const recall_0 = record.recall_0 || "";
        //   const recall_1 = record.recall_1 || "";
        //   const recall_2 = record.recall_2 || "";
        //   const recall_3 = record.recall_3 || "";
        //   const recall_4 = record.recall_4 || "";

        //   const hasDate =
        //     recall_0.includes(targetDate) ||
        //     recall_1.includes(targetDate) ||
        //     recall_2.includes(targetDate) ||
        //     recall_3.includes(targetDate) ||
        //     recall_4.includes(targetDate);

        //   return hasDate ? "custom-hover-row" : "row-missing-date";
        // }}
      />
    );
  };

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
          {/* <div style={{ display: "flex", flexDirection: "column" }}>
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
          </div> */}

          {/* <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: 4 }}>Activity Date:</label>
            <DatePicker
              defaultValue={moment(filterDate, FORMAT_DATE_FILTER_ACC)}
              format={FORMAT_DATE_FILTER_ACC}
              onChange={(value, dateString) => setFilterDate(dateString)}
              style={{ width: 240 }}
            />
          </div> */}

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: 4 }}>Due Date:</label>
            <RangePicker
              defaultValue={[
                moment(filterDueDate[0], FORMAT_DATE_FILTER_ACC),
                moment(filterDueDate[1], FORMAT_DATE_FILTER_ACC),
              ]}
              format={FORMAT_DATE_FILTER_ACC}
              onChange={(value, dateString) => setFilterDueDate(dateString)}
              style={{ width: 250 }}
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
            filename={`Report Recall Timeliness`}
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
          showHeader={false}
          size="small"
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          pagination={false}
          scroll={{ x: 1000 }}
          rowKey="customer_name"
          expandable={{
            expandedRowKeys: expandedKeys,
            onExpandedRowsChange: setExpandedKeys,
            expandedRowRender: expandedRow,
            rowExpandable: (record) => record.customer_name !== null,
          }}
          // rowClassName={() => "custom-hover-row"}
        />
      </Space>
    </div>
  );
};

export default RecallTimeliness;
