// import { Table } from "antd";
import Table from "antd/lib/Table";
import React from "react";
function Master(props) {
  const { dataSource, column } = props;
  return (
    <div>
      <Table
        columns={column}
        dataSource={dataSource}
        bordered
        size="small"
        scroll={{ y: 350, x: 200 }}
        pagination={{
          position: "bottom",
          defaultPageSize: 50,
          showSizeChanger: true,
          pageSizeOptions: ["20", "50", "100"],
        }}
      />
    </div>
  );
}
export default Master;
