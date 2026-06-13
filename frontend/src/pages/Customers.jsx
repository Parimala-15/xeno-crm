import { useEffect, useMemo, useState, Suspense } from "react";
import API from "../services/api";
import LoadingSkeleton from "../components/LoadingSkeleton";
import CustomerSegmentPie from "../components/charts/CustomerSegmentPie";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function bucketSpend(customers = []) {
  const buckets = [
    { name: "0-999", min: 0, max: 999, value: 0 },
    { name: "1k-4.9k", min: 1000, max: 4999, value: 0 },
    { name: "5k-9.9k", min: 5000, max: 9999, value: 0 },
    { name: "10k+", min: 10000, max: Infinity, value: 0 },
  ];

  customers.forEach((c) => {
    const s = Number(c.total_spend || 0);
    const b = buckets.find((bkt) => s >= bkt.min && s <= bkt.max);
    if (b) b.value++;
  });

  return buckets;
}

function formatCurrency(v) {
  return `₹${(Number(v) || 0).toLocaleString()}`;
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);
    API.get("/customers")
      .then((res) => setCustomers(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  const totalCustomers = customers.length;
  const avgSpend = totalCustomers > 0 ? Math.round(customers.reduce((s, c) => s + Number(c.total_spend || 0), 0) / totalCustomers) : 0;

  const newCustomers = customers.filter((c) => {
    const t = c.created_at || c.createdAt || null;
    if (!t) return false;
    const d = new Date(t).getTime();
    return d >= Date.now() - 30 * 24 * 60 * 60 * 1000;
  }).length;

  const spendBuckets = useMemo(() => bucketSpend(customers), [customers]);

  const topCustomers = useMemo(() => {
    return [...customers]
      .sort((a, b) => (b.total_spend || 0) - (a.total_spend || 0))
      .slice(0, 8)
      .map((c) => ({ name: c.name, spend: c.total_spend || 0 }));
  }, [customers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => (c.name || "").toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q) || (c.city || "").toLowerCase().includes(q));
  }, [customers, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <h1>Customers</h1>
      <p style={{ color: "#6b7280" }}>Manage and explore customer data</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 18 }}>
        <div className="card">
          <h4>Total Customers</h4>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{totalCustomers}</div>
        </div>

        <div className="card">
          <h4>Average Spend</h4>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{formatCurrency(avgSpend)}</div>
        </div>

        <div className="card">
          <h4>Top Segment</h4>
          <div style={{ fontSize: 18, marginTop: 6 }}>{/* derive from buckets */}
            {spendBuckets.reduce((a,b)=> a.value>b.value? a:b).name}
          </div>
        </div>

        <div className="card">
          <h4>New Customers (30d)</h4>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{newCustomers}</div>
        </div>
      </div>

      <div className="charts-grid" style={{ marginTop: 18 }}>
        <div className="card" style={{ padding: 16 }}>
          <h4>Customer Spend Distribution</h4>
          <div style={{ height: 220, marginTop: 8 }}>
            {loading ? (
              <LoadingSkeleton rows={5} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendBuckets}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2ff" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card">
          <h4>Top Customers</h4>
          <div style={{ height: 220, marginTop: 8 }}>
            {loading ? (
              <LoadingSkeleton rows={6} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCustomers} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Bar dataKey="spend" fill="var(--accent)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card">
          <h4>Customer Segment Breakdown</h4>
          <div style={{ height: 220, marginTop: 8 }}>
            <CustomerSegmentPie customers={customers} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input aria-label="Search customers" placeholder="Search customers..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} style={{ padding: 8, borderRadius: 8, border: "1px solid rgba(15,23,42,0.06)" }} />
          </div>

          <div style={{ color: "#6b7280" }}>
            {filtered.length} results
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>City</th>
                <th>Total Spend</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.city}</td>
                  <td>{formatCurrency(c.total_spend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <div style={{ color: "#6b7280" }}>
            Page {page} of {pageCount}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-muted" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <button className="btn" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
