import React, { useState, useEffect } from "react";
import { Table, Button, Space, PageHeader, Select } from "antd";
import { get, getDataFromAccurate } from "../../service/endPoint";
import { ErrorMessage, formatCurrency } from "../../helper/publicFunction";
import { PrinterFilled } from "@ant-design/icons";
import "../../assets/base.scss";
import moment from "moment";

const Child = () => {
  const [selectDB, setSelectDB] = useState(0);
  const [selectStatus, setSelectStatus] = useState("true");
  const [dataCustomer, setDataCustomer] = useState(new Map());

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

  // Table columns are now a constant outside the component
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
      width: 250,
    },
    {
      title: "No Invoice",
      dataIndex: "number",
      key: "number",
      width: 150,
    },
    {
      title: "No SJ",
      dataIndex: "deliveryPackingNumber",
      key: "deliveryPackingNumber",
      width: 150,
    },
    {
      title: "Tgl faktur",
      dataIndex: "transDateView",
      key: "transDateView",
      width: 100,
    },
    {
      title: "Tgl Jatuh Tempo",
      dataIndex: "dueDateView",
      key: "dueDateView",
      width: 100,
      render: (value, _) => (
        <div style={{ textAlign: "right", color: _.colorWarning }}>{value}</div>
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
      title: "Action",
      width: 100,
      key: "action",
      render: (text, record) => (
        <Space size="small">
          <Button
            className="btn-pick-courier"
            shape="round"
            type="primary"
            size="small"
            color="geekblue"
            key={1}
            style={{ cursor: "pointer" }}
            onClick={() => window.open(record.invoiceLink, "_blank")}
            icon={<PrinterFilled />}
          />
        </Space>
      ),
    },
  ];

  const getData = async () => {
    setLoadingTable(true);
    const { current, pageSize } = pagination;
    const db = databases.find((x) => x.id === selectDB);

    if (!db) {
      setLoadingTable(false);
      return;
    }

    const { token, host, session, dbname } = db;
    const name = dbname.toLowerCase().includes("mitra") ? "mitra" : "boss";

    let queryStatus = "";
    if (selectStatus !== "") {
      queryStatus = `&outstandingFilter=${selectStatus}`;
    }

    const body = {
      session,
      token,
      api_url: `${host}/accurate/api/sales-invoice/list.do?fields=id,number,transDate,currencyId,dueDate,customer,totalAmount&sp.pageSize=${pageSize}&sp.page=${current}${queryStatus}`,
    };

    try {
      const response = await getDataFromAccurate(body);
      const data = response.d;


      setDataSource({
        master_data: data.map((x) => {
          const link = btoa(`${name}:${x.id}`);

          const dueDate = moment(x.dueDate, "DD/MM/YYYY");
          const today = moment();
          let colorWarning = "black";

          if (dueDate.isBefore(today, 'day')) {
            colorWarning = "red";
          } else if (dueDate.diff(today, 'days') <= 2) {
            colorWarning = "orange";
          }

          return {
            ...x,
            invoiceLink: `https://pay.mitranpack.com/index.php?q=${link}`,
            customerName: x.customer.name,
            colorWarning,
            whatsapp: dataCustomer.get(x.customer.name) || ''
          };
        }),
        totalData: response.sp.rowCount,
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

  const getDataCustomer = async () => {
    const tableName = "customer";
    try {
      const response = await get(tableName);
      const customerMap = new Map(
        response.data.filter((x) => x.whatsapp).map((x) => [x.company, x.whatsapp]),
      );
      setDataCustomer(customerMap);
      getDatabase();
    } catch (error) {
      ErrorMessage(error);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const handleDBChange = (value) => {
    setSelectDB(value);
    setPagination({ current: 1, pageSize: 50 });
  };

  // The useEffect hook acts as componentDidMount
  useEffect(() => {
    getDataCustomer();
    // getDatabase();
  }, []);

  // This useEffect hook is triggered whenever selectDB or pagination changes
  useEffect(() => {
    if (selectDB) {
      getData();
    }
  }, [selectDB, pagination, selectStatus]);

  return (
    <React.Fragment>
      <section className="kanban__main">
        <section className="kanban__nav">
          <PageHeader
            className="site-page-header"
            onBack={() => window.history.back()}
            title="Sales Invoice"
            extra={[]}
          />
        </section>
        <div style={{ margin: 16 }}>
          <label style={{ marginRight: 8 }}>Pilih Database:</label>
          <Select
            allowClear
            className="database-select"
            value={selectDB}
            onChange={handleDBChange}
          >
            {databases.map((item) => (
              <Select.Option value={item.id} key={item.id}>
                {item.dbname}
              </Select.Option>
            ))}
          </Select>
          <label style={{ marginLeft: 8, marginRight: 8 }}>Filter:</label>
          <Select
            allowClear
            className="database-select"
            value={selectStatus}
            onChange={setSelectStatus}
          >
            <Select.Option value="true" key={1}>
              Belum Lunas
            </Select.Option>
            <Select.Option value="false" key={5}>
              Lunas
            </Select.Option>
          </Select>

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
          />
        </div>
      </section>
    </React.Fragment>
  );
};

export default Child;