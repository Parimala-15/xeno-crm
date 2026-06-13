import React from "react";

export default function LoadingSkeleton({ rows = 4 }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton skeleton-line" />
      ))}
    </div>
  );
}
