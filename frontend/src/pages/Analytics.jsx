import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from "recharts";

export default function Analytics() {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    API.get("/receipts").then((res) => setReceipts(Array.isArray(res.data) ? res.data : []));
  }, []);

  const counts = useMemo(() => {
    const map = { DELIVERED: 0, OPENED: 0, CLICKED: 0 };
    receipts.forEach((r) => {
      const s = (r.status || "").toUpperCase();
      if (map[s] !== undefined) map[s]++;
    });
    return map;
  }, [receipts]);

  const total = counts.DELIVERED + counts.OPENED + counts.CLICKED;
  const conversion = total > 0 ? ((counts.CLICKED / total) * 100).toFixed(1) : 0;

  const trend = useMemo(() => {
    // group by day
    const map = {};
    receipts.forEach((r) => {
      const t = r.created_at || r.time || null;
      if (!t) return;
      const d = new Date(t);
      const key = d.toISOString().slice(0, 10);
      map[key] = (map[key] || 0) + 1;
    });
    const keys = Object.keys(map).sort();
    return keys.map((k) => ({ date: k, events: map[k] }));
  }, [receipts]);

  const channelPerf = useMemo(() => {
    const map = {};
    receipts.forEach((r) => {
      const c = r.channel || r.medium || "unknown";
      map[c] = (map[c] || 0) + 1;
    });
    return Object.keys(map).map((k) => ({ channel: k, value: map[k] }));
  }, [receipts]);

  const topChannel = channelPerf.length ? channelPerf.reduce((a,b)=> a.value>b.value? a:b ).channel : "-";
  const openRate = total > 0 ? ((counts.OPENED / total) * 100).toFixed(1) : 0;

  return (
    <div>
      <h1>Analytics</h1>
      <p style={{ color: "#6b7280" }}>Campaign performance and engagement insights</p>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <div className="card" style={{ width: 200 }}>
          <h4>Delivered</h4>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{counts.DELIVERED}</div>
        </div>

        <div className="card" style={{ width: 200 }}>
          <h4>Opened</h4>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{counts.OPENED}</div>
        </div>

        <div className="card" style={{ width: 200 }}>
          <h4>Clicked</h4>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{counts.CLICKED}</div>
        </div>

        <div className="card" style={{ width: 200 }}>
          <h4>Conversion</h4>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{conversion}%</div>
        </div>
      </div>

      <div className="summary-grid" style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <div className="card" style={{ flex: 1 }}>
          <h4>Executive Summary</h4>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{total}</div>
              <div style={{ color: "#6b7280" }}>Total engagement events</div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{openRate}%</div>
              <div style={{ color: "#6b7280" }}>Open rate</div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{topChannel}</div>
              <div style={{ color: "#6b7280" }}>Top channel</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ width: 280 }}>
          <h4>Key Highlights</h4>
          <ul style={{ marginTop: 8, color: "#374151" }}>
            <li>Conversion Rate: <strong>{conversion}%</strong></li>
            <li>Most active channel: <strong>{topChannel}</strong></li>
            <li>Recent trend: <strong>{trend.length ? `${trend[trend.length-1].events} events` : `No data`}</strong></li>
          </ul>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginTop: 16 }}>
        <div className="card">
          <h4>Campaign Funnel (Delivered → Opened → Clicked)</h4>
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ flex: counts.DELIVERED, background: "#e6f0ff", padding: 8, borderRadius: 8 }}>
                Delivered: {counts.DELIVERED}
              </div>
              <div style={{ flex: counts.OPENED, background: "#fff1f7", padding: 8, borderRadius: 8 }}>
                Opened: {counts.OPENED}
              </div>
              <div style={{ flex: counts.CLICKED, background: "#f0fdf4", padding: 8, borderRadius: 8 }}>
                Clicked: {counts.CLICKED}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h4>Channel Performance</h4>
          <div style={{ height: 220, marginTop: 8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelPerf} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="channel" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }} className="card">
        <h4>Engagement Trend</h4>
        <div style={{ height: 240, marginTop: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2ff" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="events" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}