import React from "react";

export default function KpiCard({ icon, title, value, change = 0, description }) {
  const isPositive = Number(change) >= 0;

  return (
    <div className="card kpi-card" role="group" aria-label={title}>
      <div className="kpi-left">
        <div className="kpi-icon">{icon}</div>

        <div className="kpi-info">
          <h4>{title}</h4>
          <div className="kpi-value">{value}</div>
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <div className={`trend ${isPositive ? "up" : "down"}`}>
          <span className="arrow">{isPositive ? "▲" : "▼"}</span>
          <span>{isPositive ? `+${Math.abs(change)}%` : `-${Math.abs(change)}%`}</span>
        </div>

        {description && <div className="ai-meta" style={{ marginTop: 8 }}>{description}</div>}
      </div>
    </div>
  );
}
