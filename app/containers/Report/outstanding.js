import React, { useState, useEffect } from "react";
import { Table, DatePicker, Button, Input, Space, Select } from "antd";
import { get, getDataFromAccurate } from "../../service/endPoint";
import {
  FORMAT_DATE_FILTER_ACC,
  FORMAT_DATE_LABEL,
} from "../../helper/constanta";
import moment from "moment-timezone";
import { ErrorMessage, formatCurrency } from "../../helper/publicFunction";
import ReactExport from "react-export-excel-hot-fix";
import { ExportOutlined, SearchOutlined } from "@ant-design/icons";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const Outstanding = () => {
  const [selectDB, setSelectDB] = useState(0);
  const [databases, setDatabases] = useState([]);

  const [data, setData] = useState([]);
  const [dataExpanded, setDataExpanded] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const [filterDate, setFilterDate] = useState(
    moment().format(FORMAT_DATE_FILTER_ACC)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    invoice: "",
    customer: "",
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
      title: "Due Date",
      dataIndex: "dueDateView",
      key: "dueDateView",
      width: 180,
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
      width: 200,
      render: (value) => (
        <div style={{ textAlign: "right" }}>{formatCurrency(value)}</div>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDateView",
      key: "dueDateView",
      width: 180,
    },
  ];

  const getData = async () => {
    setIsLoading(true);

    const db = databases.find((x) => x.id === selectDB);
    const { token, host, session } = db;

    let allData = [];
    let page = 1;
    let hasMore = true;
    let queryDueDate = `&filter.dueDate.op=LESS_EQUAL_THAN&filter.dueDate.val=${filterDate}`;

    while (hasMore) {
      const body = {
        session,
        token,
        api_url: `${host}/accurate/api/sales-invoice/list.do?fields=id,number,transDate,currencyId,dueDate,customer,totalAmount&outstandingFilter=true&sp.pageSize=100&sp.page=${page}${queryDueDate}`,
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

    const datas = allData.map((item, index) => ({
      ...item,
      customer_name: item.customer.name,
      id: index + 1,
    }));

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
        const { customer_name, totalAmount, dueDateView } = invoice;

        if (!acc[customer_name]) {
          acc[customer_name] = {
            customer_name,
            totalOutstanding: 0,
            totalInvoice: 0,
            dueDateView: null,
          };
        }

        acc[customer_name].totalOutstanding += totalAmount;
        acc[customer_name].totalInvoice += 1;

        if (
          !acc[customer_name].dueDateView ||
          moment(dueDateView, FORMAT_DATE_LABEL).isAfter(
            moment(acc[customer_name].dueDateView, FORMAT_DATE_LABEL)
          )
        ) {
          acc[customer_name].dueDateView = dueDateView;
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
  }, [selectDB, filterDate]);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = data.filter((item) => {
        const customer = filters.customer_name || "";

        const customerMatch = item.customer_name
          .toLowerCase()
          .includes(customer.toLowerCase());

        return customerMatch;
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

  const expandedRow = (row) => {
    let inTable = dataExpanded.filter((x) => {
      return x.customer_name === row.customer_name;
    });
    return (
      <Table columns={columnsExpand} dataSource={inTable} pagination={false} />
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

          <DatePicker
            defaultValue={moment(filterDate, FORMAT_DATE_FILTER_ACC)}
            format={FORMAT_DATE_FILTER_ACC}
            onChange={(value, dateString) => setFilterDate(dateString)}
            style={{ width: 240 }}
          />
          <Button type="primary" onClick={getData} icon={<SearchOutlined />}>
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
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          pagination={{
            pageSizeOptions: ["50", "100"],
            showSizeChanger: true,
            defaultPageSize: 100,
          }}
          bordered
          scroll={{ x: 1000 }}
          rowKey="customer_name"
          expandable={{
            expandedRowRender: expandedRow,
            rowExpandable: (record) => record.customer_name !== null,
          }}
        />
      </Space>
    </div>
  );
};

export default Outstanding;
