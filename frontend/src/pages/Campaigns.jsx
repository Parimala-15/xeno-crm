import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

function statusCounts(receipts = []) {
  const map = { SENT: 0, DELIVERED: 0, OPENED: 0, CLICKED: 0 };
  receipts.forEach((r) => {
    const s = (r.status || "").toUpperCase();
    if (map[s] !== undefined) map[s]++;
  });
  return map;
}

export default function Campaigns() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState("");

  useEffect(() => {
    API.get("/receipts").then((res) => setReceipts(Array.isArray(res.data) ? res.data : []));
  }, []);

  const counts = useMemo(() => statusCounts(receipts), [receipts]);

  const sendCampaign = async () => {
    setLoading(true);
    try {
      const res = await API.post("/campaigns/send");
      setSendStatus(res.data?.campaign_status?.status || "SENT");
    } catch (e) {
      setSendStatus("FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Campaigns</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 16 }}>
        <div className="card">
          <h4>Sent</h4>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{counts.SENT}</div>
        </div>

        <div className="card">
          <h4>Delivered</h4>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{counts.DELIVERED}</div>
        </div>

        <div className="card">
          <h4>Opened</h4>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{counts.OPENED}</div>
        </div>

        <div className="card">
          <h4>Clicked</h4>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{counts.CLICKED}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 18 }}>
        <div className="card" style={{ flex: 1 }}>
          <h4>Campaign Timeline</h4>
          <ol style={{ marginTop: 12, paddingLeft: 18 }}>
            <li>Draft</li>
            <li>Generated</li>
            <li>Sent</li>
            <li>Delivered</li>
            <li>Opened</li>
            <li>Clicked</li>
          </ol>

          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={sendCampaign} disabled={loading}>{loading ? "Sending..." : "Send Campaign"}</button>
            {sendStatus && <span style={{ marginLeft: 12, color: "#6b7280" }}>{sendStatus}</span>}
          </div>
        </div>

        <div className="card" style={{ width: 360 }}>
          <h4>Campaign History</h4>
          <table style={{ width: "100%", marginTop: 8 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {receipts.slice(-8).reverse().map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td><span className={`badge status-${(r.status || "").toLowerCase()}`}>{r.status}</span></td>
                  <td>{r.created_at || r.time || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}