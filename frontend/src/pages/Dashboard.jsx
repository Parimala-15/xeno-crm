import React, { useEffect, useState, Suspense, lazy } from "react";
import API from "../services/api";
import KpiCard from "../components/KpiCard";
import QuickActions from "../components/QuickActions";
import ActivityFeed from "../components/ActivityFeed";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { Users, ShoppingCart, FileText, Send } from "lucide-react";

const CustomerGrowthChart = lazy(() => import("../components/charts/CustomerGrowthChart"));
const OrdersBarChart = lazy(() => import("../components/charts/OrdersBarChart"));
const CustomerSegmentPie = lazy(() => import("../components/charts/CustomerSegmentPie"));

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([API.get("/customers"), API.get("/orders"), API.get("/receipts")])
      .then(([cRes, oRes, rRes]) => {
        setCustomers(Array.isArray(cRes.data) ? cRes.data : []);
        setOrders(Array.isArray(oRes.data) ? oRes.data : []);
        setReceipts(Array.isArray(rRes.data) ? rRes.data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalCustomers = customers.length;
  const totalOrders = orders.length;
  const totalReceipts = receipts.length;

  // growth: compare recent 30 days to previous 30 days
  const calcGrowth = (items = [], dateKey = "created_at") => {
    try {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;
      const recent = items.filter((it) => {
        const t = it[dateKey] || it.createdAt || it.order_date;
        if (!t) return false;
        const d = new Date(t).getTime();
        return d >= now - 30 * dayMs;
      }).length;
      const prev = items.filter((it) => {
        const t = it[dateKey] || it.createdAt || it.order_date;
        if (!t) return false;
        const d = new Date(t).getTime();
        return d >= now - 60 * dayMs && d < now - 30 * dayMs;
      }).length;
      if (prev === 0) return recent > 0 ? Math.round((recent / 1) * 100) : 0;
      return Math.round(((recent - prev) / prev) * 100);
    } catch (e) {
      return 0;
    }
  };

  const customerGrowth = calcGrowth(customers, "created_at");
  const ordersGrowth = calcGrowth(orders, "order_date");

  return (
    <div>
      <h1>Executive Dashboard</h1>
      <p style={{ color: "#6b7280", marginTop: 6 }}>Product analytics, campaigns, and customer insights</p>

      <div className="kpi-grid" style={{ marginTop: 20 }}>
        <KpiCard icon={<Users />} title="Total Customers" value={totalCustomers} change={customerGrowth} description={`New in 30 days`} />

        <KpiCard icon={<ShoppingCart />} title="Total Orders" value={totalOrders} change={ordersGrowth} description={`Orders growth`} />

        <KpiCard icon={<FileText />} title="Total Receipts" value={totalReceipts} change={0} description={`Campaign events`} />

        <KpiCard icon={<Send />} title="Active Campaigns" value={totalReceipts} change={0} description={`Active campaign events`} />
      </div>

      <div className="charts-grid">
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 16 }}>
          <div className="card chart-card">
            <h4>Customer Growth Trend</h4>
            <div style={{ height: 220, marginTop: 8 }}>
              <Suspense fallback={<LoadingSkeleton rows={5} />}>
                <CustomerGrowthChart customers={customers} />
              </Suspense>
            </div>
          </div>

          <div className="card chart-card">
            <h4>Orders Trend</h4>
            <div style={{ height: 220, marginTop: 8 }}>
              <Suspense fallback={<LoadingSkeleton rows={5} />}>
                <OrdersBarChart orders={orders} />
              </Suspense>
            </div>
          </div>
        </div>

        <div className="card chart-card">
          <h4>Customer Segmentation</h4>
          <div style={{ height: 460, marginTop: 8 }}>
            <Suspense fallback={<LoadingSkeleton rows={5} />}>
              <CustomerSegmentPie customers={customers} />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="side-panels" style={{ marginTop: 18 }}>
        <div>
          <ActivityFeed />
        </div>

        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;