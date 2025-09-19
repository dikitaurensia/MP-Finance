import React from "react";
import "antd/dist/antd.css";
import { Row, Col, Card, Typography, Table, Tag } from "antd";
import { get } from "../../service/endPoint";
import { ErrorMessage } from "../../helper/publicFunction";

import {
  BarChart,
  Bar,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const { Title, Text } = Typography;

// Data statis untuk demo
const summaryData = {
  totalInvoicesNotified: 1250,
  totalPaymentsCollected: 850,
  overdueInvoices: 40,
  totalOverdueAmount: 50000000,
};

const invoiceStatusByDueDate = [
  { dueDate: "Dalam 7 Hari", pending: 35, paid: 15 },
  { dueDate: "Hari Ini", pending: 12, paid: 5 },
  { dueDate: "Jatuh Tempo", pending: 40, paid: 0 },
  { dueDate: "Terlambat 1-30 Hari", pending: 25, paid: 15 },
  { dueDate: "Terlambat >30 Hari", pending: 15, paid: 5 },
];

const recentNotificationHistory = [
  {
    key: "1",
    invoiceId: "INV-001",
    customer: "PT. ABC",
    dueDate: "2023-10-28",
    notifType: "Jatuh Tempo",
    paymentStatus: "Belum Bayar",
  },
  {
    key: "2",
    invoiceId: "INV-002",
    customer: "CV. Makmur",
    dueDate: "2023-10-25",
    notifType: "H-2",
    paymentStatus: "Sudah Bayar",
  },
  {
    key: "3",
    invoiceId: "INV-003",
    customer: "PT. Maju Jaya",
    dueDate: "2023-10-20",
    notifType: "Peringatan",
    paymentStatus: "Belum Bayar",
  },
  {
    key: "4",
    invoiceId: "INV-004",
    customer: "UD. Sejahtera",
    dueDate: "2023-10-27",
    notifType: "H-1",
    paymentStatus: "Sudah Bayar",
  },
  {
    key: "5",
    invoiceId: "INV-005",
    customer: "Toko Baru",
    dueDate: "2023-10-26",
    notifType: "Jatuh Tempo",
    paymentStatus: "Belum Bayar",
  },
];

const cardStyle = (color) => ({
  borderLeft: `5px solid ${color}`,
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
});

class WhatsAppBillingDashboard extends React.Component {
  state = {
    // State untuk data dinamis dari API
  };

  componentDidMount() {
    // Panggil API untuk mendapatkan data penagihan
    // get("billing_data")
    //   .then((response) => {
    //     // Lakukan sesuatu dengan data
    //   })
    //   .catch((error) => ErrorMessage(error));
  }

  render() {
    const notificationColumns = [
      { title: "Invoice ID", dataIndex: "invoiceId", key: "invoiceId" },
      { title: "Customer", dataIndex: "customer", key: "customer" },
      { title: "Jatuh Tempo", dataIndex: "dueDate", key: "dueDate" },
      { title: "Jenis Notifikasi", dataIndex: "notifType", key: "notifType" },
      {
        title: "Status Pembayaran",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
        render: (status) => {
          const color = status === "Sudah Bayar" ? "green" : "red";
          return (
            <Tag color={color} key={status}>
              {status.toUpperCase()}
            </Tag>
          );
        },
      },
    ];

    return (
      <div className="kanban__main">
        <div className="kanban__main-wrapper" style={{ padding: "20px" }}>
          <Title level={2}>📊 Dashboard Penagihan via WhatsApp</Title>
          <Text type="secondary">
            Analisis efektivitas notifikasi WhatsApp dalam penagihan dan status
            pembayaran.
          </Text>

          {/* Bagian Kartu Ringkasan */}
          <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            <Col xs={24} md={6}>
              <Card style={cardStyle("#1890ff")}>
                <Title level={4}>Invoice Dinotifikasi</Title>
                <Text strong style={{ fontSize: 24 }}>
                  {summaryData.totalInvoicesNotified.toLocaleString()}
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card style={cardStyle("#52c41a")}>
                <Title level={4}>Pembayaran Terkumpul</Title>
                <Text strong style={{ fontSize: 24 }}>
                  {summaryData.totalPaymentsCollected.toLocaleString()}
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card style={cardStyle("#f5222d")}>
                <Title level={4}>Invoice Terlambat</Title>
                <Text strong style={{ fontSize: 24 }}>
                  {summaryData.overdueInvoices.toLocaleString()}
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card style={cardStyle("#faad14")}>
                <Title level={4}>Total Nominal Terlambat</Title>
                <Text strong style={{ fontSize: 24 }}>
                  Rp {summaryData.totalOverdueAmount.toLocaleString()}
                </Text>
              </Card>
            </Col>
          </Row>

          {/* Bagian Grafik */}
          <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            <Col span={24}>
              <Card
                title="Status Pembayaran Berdasarkan Jatuh Tempo"
                style={cardStyle("#9254de")}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={invoiceStatusByDueDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dueDate" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="paid" name="Sudah Dibayar" fill="#52c41a" />
                    <Bar
                      dataKey="pending"
                      name="Belum Dibayar"
                      fill="#f5222d"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* Bagian Tabel Riwayat Notifikasi */}
          <Row style={{ marginTop: 20 }}>
            <Col span={24}>
              <Card
                title="Riwayat Notifikasi Terbaru"
                style={cardStyle("#40a9ff")}
              >
                <Table
                  dataSource={recentNotificationHistory}
                  columns={notificationColumns}
                  pagination={{ pageSize: 5 }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default WhatsAppBillingDashboard;
