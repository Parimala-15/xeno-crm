import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function buildSeries(customers = []) {
  if (!Array.isArray(customers) || customers.length === 0) return [];
  const map = {};
  customers.forEach((c) => {
    const t = c.created_at || c.createdAt || c.created;
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
    return { name: label, customers: map[k] };
  });
}

export default function CustomerGrowthChart({ customers }) {
  const data = buildSeries(customers);
  if (!data || data.length === 0) {
    return <div style={{ padding: 20, color: "#6b7280" }}>Customer growth data unavailable</div>;
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2ff" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="customers" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
