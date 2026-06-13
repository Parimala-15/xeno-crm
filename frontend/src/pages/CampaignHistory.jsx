import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

export default function CampaignHistory() {
  const [receipts, setReceipts] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    API.get("/receipts").then((res) => setReceipts(Array.isArray(res.data) ? res.data : []));
  }, []);

  const filtered = useMemo(() => {
    return receipts.filter((r) => {
      const q = query.trim().toLowerCase();
      if (statusFilter && ((r.status || "").toLowerCase() !== statusFilter.toLowerCase())) return false;
      if (!q) return true;
      return String(r.status || "").toLowerCase().includes(q) || String(r.campaign || "").toLowerCase().includes(q);
    });
  }, [receipts, query, statusFilter]);

  return (
    <div>
      <h1>History</h1>
      <p style={{ color: "#6b7280" }}>Timeline of campaign, segment and customer events</p>

      <div style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 12 }}>
        <input aria-label="Search events" placeholder="Search events" value={query} onChange={(e) => setQuery(e.target.value)} style={{ padding: 8, borderRadius: 8, border: "1px solid rgba(15,23,42,0.06)" }} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: 8, borderRadius: 8 }}>
          <option value="">All</option>
          <option value="SENT">SENT</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="OPENED">OPENED</option>
          <option value="CLICKED">CLICKED</option>
        </select>
      </div>

      <div>
        {filtered.length === 0 && <div className="empty-state">No history found</div>}

        <div className="timeline" style={{ marginTop: 12 }}>
          {filtered.slice().reverse().map((r, i) => (
            <div key={i} className="timeline-item">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.campaign || `Campaign ${i + 1}`}</div>
                  <div className="time">{r.created_at || r.time || "-"}</div>
                </div>

                <div>
                  <span className={`badge status-${(r.status || "").toLowerCase()}`}>{r.status || "UNKNOWN"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}