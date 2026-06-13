import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function buildSeries(orders = []) {
  if (!Array.isArray(orders) || orders.length === 0) return [];
  const map = {};
  orders.forEach((o) => {
    const t = o.order_date || o.orderDate || o.created_at;
    if (!t) return;
    const d = new Date(t);
    if (isNaN(d)) return;
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    map[key] = (map[key] || 0) + 1;
  });
  const keys = Object.keys(map).sort();
  return keys.map((k) => {
    const [y, m] = k.split("-");
    const label = new Date(y, m - 1).toLocaleString(undefined, { month: "short", year: "numeric" });
    return { name: label, orders: map[k] };
  });
}

export default function OrdersBarChart({ orders }) {
  const data = buildSeries(orders);
  if (!data || data.length === 0) {
    return <div style={{ padding: 20, color: "#6b7280" }}>Order trend data unavailable</div>;
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2ff" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="orders" fill="#7c3aed" />
      </BarChart>
    </ResponsiveContainer>
  );
}
