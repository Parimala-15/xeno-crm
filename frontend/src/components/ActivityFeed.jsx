import React, { useEffect, useState } from "react";
import API from "../services/api";
import { User, Mail, Activity } from "lucide-react";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h`;
  return `${Math.floor(sec / 86400)}d`;
}

export default function ActivityFeed() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let mounted = true;

    Promise.all([API.get("/receipts"), API.get("/customers"), API.get("/orders")])
      .then(([rRes, cRes, oRes]) => {
        if (!mounted) return;

        const receipts = Array.isArray(rRes.data)
          ? rRes.data.map((item, i) => ({ type: "receipt", id: `r-${i}`, status: item.status, time: item.created_at || null }))
          : [];

        const customers = Array.isArray(cRes.data)
          ? cRes.data.slice(-10).map((c, i) => ({ type: "customer", id: `c-${c.id || i}`, name: c.name, time: c.created_at || null }))
          : [];

        const orders = Array.isArray(oRes.data)
          ? oRes.data.slice(-10).map((o, i) => ({ type: "order", id: `o-${o.id || i}`, amount: o.amount, time: o.order_date || null }))
          : [];

        const merged = [...receipts, ...customers, ...orders]
          .sort((a, b) => {
            const ta = a.time ? new Date(a.time).getTime() : 0;
            const tb = b.time ? new Date(b.time).getTime() : 0;
            return tb - ta;
          })
          .slice(0, 12);

        setEvents(merged);
      })
      .catch(() => {});

    return () => (mounted = false);
  }, []);

  return (
    <div className="card">
      <h3>Recent Activity</h3>

      <div className="activity-list">
        {events.map((e) => (
          <div className="activity-item" key={e.id} role="article" aria-label={`Activity ${e.type}`}>
            <div className={`activity-icon ${e.type}`} style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8}}>
              {e.type === "customer" ? <User /> : e.type === "order" ? <Mail /> : <Activity />}
            </div>

            <div style={{ flex: 1 }}>
              {e.type === "customer" && (
                <div>
                  <strong>{e.name}</strong> added
                </div>
              )}

              {e.type === "order" && (
                <div>
                  Order created • <strong>₹{e.amount}</strong>
                </div>
              )}

              {e.type === "receipt" && (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div>Campaign update</div>
                  <div><span className={`badge status-${(e.status||"").toLowerCase()}`}>{e.status}</span></div>
                </div>
              )}

              <div className="time">{timeAgo(e.time)}</div>
            </div>
          </div>
        ))}

        {events.length === 0 && <div className="empty-state">No recent activity</div>}
      </div>
    </div>
  );
}
