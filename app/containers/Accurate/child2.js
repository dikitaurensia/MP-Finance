import React, { useEffect, useState } from "react";
import { Table, PageHeader, Button, Tag, Space, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { FormControl, InputLabel, Input } from "@material-ui/core";
import Media from "react-media";

import "antd/dist/antd.css";
import "../../assets/base.scss";

import { get, deletedAccurate } from "../../service/endPoint";
import { ErrorMessage, SuccessMessage } from "../../helper/publicFunction";

const tableName = "accurate";

const AccurateDatabase = () => {
  const [dataSource, setDataSource] = useState([]);
  const [formState] = useState({
    client_id: "13ddae5e-a3f3-4e1f-b561-ef8c0026b859",
    response_type: "token",
    redirect_uri: "http://apps.mitranpack.com/aol-oauth-callback",
    scope:
      "sales_order_view customer_view delivery_order_view item_category_view roll_over_save job_order_save sales_invoice_view sales_invoice_save",
  });

  const columns = [
    {
      title: "Data",
      render: (record) => (
        <>
          <span className="judul">DBname:</span> {record.dbname}
        </>
      ),
      responsive: ["xs", "sm", "md"],
      hideOnLarge: true,
    },
    {
      title: "Action",
      width: 60,
      render: (record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleDelete(record.dbname)}
        >
          <Tag
            color="volcano"
            style={{ cursor: "pointer" }}
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      ),
      responsive: ["xs", "sm", "md"],
      hideOnLarge: true,
    },
    {
      title: "Database Name",
      dataIndex: "dbname",
      key: "dbname",
      width: 300,
      responsive: ["lg"],
      sorter: (a, b) => a.dbname.localeCompare(b.dbname),
    },
    {
      title: "Session",
      dataIndex: "session",
      key: "session",
      width: 300,
      responsive: ["lg"],
      sorter: (a, b) => a.session.localeCompare(b.session),
    },
    {
      title: "Token",
      dataIndex: "token",
      key: "token",
      width: 300,
      responsive: ["lg"],
      sorter: (a, b) => a.token.localeCompare(b.token),
    },
    {
      title: "Host",
      dataIndex: "host",
      key: "host",
      width: 300,
      responsive: ["lg"],
      sorter: (a, b) => a.host.localeCompare(b.host),
    },
    {
      title: "Action",
      key: "action",
      width: 180,
      responsive: ["lg"],
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.dbname)}
          >
            <Tag
              color="volcano"
              style={{ cursor: "pointer" }}
              icon={<DeleteOutlined />}
            >
              Delete
            </Tag>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getResponsiveColumns = (isSmallScreen) =>
    columns.filter(({ hideOnLarge }) => !(hideOnLarge && !isSmallScreen));

  const fetchData = async () => {
    try {
      const response = await get(tableName);
      setDataSource(response.data);
    } catch (error) {
      ErrorMessage(error);
    }
  };

  const handleDelete = async (dbname) => {
    try {
      const response = await deletedAccurate(tableName, dbname);
      SuccessMessage(response.status);
      fetchData();
    } catch (error) {
      ErrorMessage(error);
    }
  };

  useEffect(() => {
    // Capture token from redirect
    const urlParams = new URLSearchParams(window.location.href.split("?")[1]);
    const accessToken = urlParams.get("code");

    if (accessToken) {
      // Simpan accessToken jika diperlukan
      console.log("Access token from redirect:", accessToken);
    }

    fetchData();
  }, []);

  return (
    <section className="kanban__main">
      <section className="kanban__nav">
        <PageHeader
          className="site-page-header"
          onBack={() => window.history.back()}
          title="Database Accurate"
          extra={[
            <form
              key="oauth-form"
              action="https://account.accurate.id/oauth/authorize"
              method="post"
              className="form"
            >
              {Object.entries(formState).map(([key, value]) => (
                <FormControl style={{ display: "none" }} key={key}>
                  <InputLabel htmlFor={key}>{key}</InputLabel>
                  <Input name={key} value={value} readOnly />
                </FormControl>
              ))}
              <Button type="primary" shape="round" htmlType="submit">
                Register Database
              </Button>
            </form>,
          ]}
        />
        <div className="kanban__nav-wrapper" />
      </section>

      <div className="kanban__main-wrapper">
        <Media query="(max-width: 991px)">
          {(isSmallScreen) => (
            <Table
              size="middle"
              dataSource={dataSource}
              columns={getResponsiveColumns(isSmallScreen)}
              bordered={false}
              scroll={{ y: 350, x: 200 }}
              rowKey="dbname"
              pagination={{
                position: ["bottomCenter"],
                defaultPageSize: 50,
                showSizeChanger: true,
                pageSizeOptions: ["20", "50", "100"],
              }}
            />
          )}
        </Media>
      </div>
    </section>
  );
};

export default AccurateDatabase;
