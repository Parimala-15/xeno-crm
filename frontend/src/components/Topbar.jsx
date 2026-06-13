import React from "react";
import { Menu, Bell } from "lucide-react";

export default function Topbar({ onToggle }) {
  return (
    <header className="topbar">
      <button className="toggle-btn" onClick={onToggle} aria-label="Toggle sidebar">
        <Menu />
      </button>

      <div className="search">
        <input aria-label="Search" placeholder="Search customers, campaigns, or segments..." />
      </div>

      <div className="topbar-actions">
        <button className="icon-btn" aria-label="Notifications">
          <Bell />
        </button>

        <div className="avatar" aria-hidden>JD</div>
      </div>
    </header>
  );
}
