import React, { useState, useEffect } from "react";
import { Table, Button, Space, PageHeader, Select } from "antd";
import { get, getDataFromAccurate } from "../../service/endPoint";
import { ErrorMessage, formatCurrency } from "../../helper/publicFunction";
import { PrinterFilled, WhatsAppOutlined } from "@ant-design/icons";
import "../../assets/base.scss";
import moment from "moment";

const SalesInvoiceTable = () => {
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
  const [selectedRows, setSelectedRows] = useState([]);

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
            key="print"
            style={{ cursor: "pointer" }}
            onClick={() => window.open(record.invoiceLink, "_blank")}
            icon={<PrinterFilled />}
          />
          <Button
            className="btn-pick-courier whatsapp-btn"
            shape="round"
            size="small"
            key="whatsapp"
            style={{
              cursor: "pointer",
              backgroundColor: "#25D366",
              borderColor: "#25D366",
              color: "white",
            }}
            onClick={() => sendMessage([record])}
            icon={<WhatsAppOutlined />}
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
          const hash = btoa(`${name}:${x.id}`);

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
            key: x.id, // Add a unique key for the row selection
            invoiceLink: `https://pay.mitranpack.com/?q=${hash}`,
            customerName: x.customer.name,
            colorWarning,
            whatsapp: dataCustomer.get(x.customer.name) || "",
            hash,
          };
        }),
        totalData: response.sp.rowCount,
      });
      setSelectedRows([]); // Clear selection when data changes
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
        response.data
          .filter((x) => x.whatsapp)
          .map((x) => [x.company, x.whatsapp])
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

  const handleSelectRows = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const sendMessage = (invoices) => {
    if (invoices.length === 0) return;

    // Group invoices by customer name
    const invoicesByCustomer = invoices.reduce((acc, invoice) => {
      const { customerName } = invoice;
      if (!acc[customerName]) {
        acc[customerName] = [];
      }
      acc[customerName].push(invoice);
      return acc;
    }, {});

    // Iterate over each customer's invoices and send a separate message
    for (const customerName in invoicesByCustomer) {
      if (invoicesByCustomer.hasOwnProperty(customerName)) {
        const customerInvoices = invoicesByCustomer[customerName];

        const invoiceList = customerInvoices
          .map(
            (invoice, index) =>
              `${index + 1}. Faktur penjualan ${
                invoice.number
              } - IDR ${formatCurrency(invoice.totalAmount)}`
          )
          .join("\n");

        // Generate a single link for all invoices for this customer
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

  useEffect(() => {
    getDataCustomer();
  }, []);

  useEffect(() => {
    if (selectDB) {
      getData();
    }
  }, [selectDB, pagination, selectStatus]);

  const rowSelection = {
    selectedRowKeys: selectedRows.map((row) => row.key),
    onChange: (selectedRowKeys, selectedRows) => {
      handleSelectRows(selectedRowKeys, selectedRows);
    },
  };

  const generateMultipleWhatsApp = () => {
    sendMessage(selectedRows);
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
            rowSelection={rowSelection} // Add row selection
          />
        </div>
      </section>
    </React.Fragment>
  );
};

export default SalesInvoiceTable;
