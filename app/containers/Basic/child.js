import React from "react";
import "antd/dist/antd.css";
import { Row, Col, Card, Typography, PageHeader } from "antd";
import { get } from "../../service/endPoint";
import { ErrorMessage, getCoor } from "../../helper/publicFunction";
import MapGL, { NavigationControl, Marker, Popup } from "react-map-gl";
import {
  MAPSTYLE,
  MAPTOKEN,
  JAKARTA,
  COORDINATE_MP,
} from "../../helper/constanta";
import MarkerIcon from "../../assets/img/kurir.png";
import MitranIcon from "../../assets/img/mp.png";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";


const tableName = "courier";
const { Title, Text } = Typography;

class CourierDashboard extends React.Component {
  state = {
    viewport: {
      latitude: getCoor(JAKARTA, "lat"),
      longitude: getCoor(JAKARTA, "long"),
      zoom: 12,
      bearing: 0,
      pitch: 0,
    },
    dataSource: [],
    popupInfo: null,

    summary: {
      totalRevenue: 125000000,
      totalExpense: 85000000,
      netProfit: 40000000,
    },
    revenueTrend: [
      { month: "Jan", revenue: 10000000, expense: 7000000 },
      { month: "Feb", revenue: 12000000, expense: 8000000 },
      { month: "Mar", revenue: 15000000, expense: 10000000 },
      { month: "Apr", revenue: 14000000, expense: 9000000 },
      { month: "May", revenue: 18000000, expense: 12000000 },
      { month: "Jun", revenue: 20000000, expense: 13000000 },
    ],
    expenseBreakdown: [
      { name: "Salaries", value: 40000000 },
      { name: "Operations", value: 20000000 },
      { name: "Marketing", value: 15000000 },
      { name: "Misc", value: 10000000 },
    ],
  };



  componentDidMount() {
    this.getData();
    this.intervalID = setInterval(this.getData, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  getData = () => {
    get(tableName)
      .then((response) => {
        this.setState({ dataSource: response.data });
      })
      .catch((error) => ErrorMessage(error));
  };

  render() {
    const { dataSource, viewport, popupInfo } = this.state;
    const activeCouriers = dataSource.filter((x) => x.status === "active");
    const nonActiveCouriers = dataSource.filter((x) => x.status !== "active");

    // const cardStyle = (color) => ({
    //   // backgroundColor: `${color}`,
    //   borderLeft: `5px solid ${color}`,
    //   borderRadius: "10px",
    //   boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    // });

    const { summary, revenueTrend, expenseBreakdown } = this.state;

    const COLORS = ["#1890ff", "#52c41a", "#f5222d", "#faad14"];

    const cardStyle = (color) => ({
      borderLeft: `5px solid ${color}`,
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    });

    return (
      <div className="kanban__main">


        <div className="kanban__main-wrapper" style={{ padding: "20px" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card style={cardStyle("#1890ff")}>
                <Title level={4}>Total Revenue</Title>
                <Text strong style={{ fontSize: 24 }}>
                  Rp {summary.totalRevenue.toLocaleString()}
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card style={cardStyle("#f5222d")}>
                <Title level={4}>Total Expense</Title>
                <Text strong style={{ fontSize: 24 }}>
                  Rp {summary.totalExpense.toLocaleString()}
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card style={cardStyle("#52c41a")}>
                <Title level={4}>Net Profit</Title>
                <Text strong style={{ fontSize: 24 }}>
                  Rp {summary.netProfit.toLocaleString()}
                </Text>
              </Card>
            </Col>
          </Row>

          {/* Revenue vs Expense Trend */}
          <Row style={{ marginTop: 20 }}>
            <Col span={24}>
              <Card
                title="Revenue vs Expense Trend"
                style={cardStyle("#9254de")}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1890ff"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#f5222d"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* Expense Breakdown */}
          <Row style={{ marginTop: 20 }}>
            <Col span={24}>
              <Card title="Expense Breakdown" style={cardStyle("#faad14")}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default CourierDashboard;
