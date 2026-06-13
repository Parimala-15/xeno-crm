import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#60a5fa", "#7c3aed", "#34d399", "#f97316"];

function buildSegments(customers = []) {
  if (!Array.isArray(customers) || customers.length === 0) return [];
  const buckets = { Low: 0, Medium: 0, High: 0, VIP: 0 };
  customers.forEach((c) => {
    const s = Number(c.total_spend || 0);
    if (s >= 10000) buckets.VIP++;
    else if (s >= 5000) buckets.High++;
    else if (s >= 1000) buckets.Medium++;
    else buckets.Low++;
  });
  return Object.keys(buckets).map((k) => ({ name: k, value: buckets[k] }));
}

export default function CustomerSegmentPie({ customers }) {
  const data = buildSegments(customers);
  if (!data || data.reduce((s, i) => s + i.value, 0) === 0) {
    return <div style={{ padding: 20, color: "#6b7280" }}>Customer segmentation unavailable</div>;
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
