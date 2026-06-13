import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, Send, BarChart2, Cpu, Clock } from "lucide-react";

const items = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/campaigns", label: "Campaigns", icon: Send },
  { to: "/analytics", label: "Analytics", icon: BarChart2 },
  { to: "/ai", label: "AI Copilot", icon: Cpu },
  { to: "/history", label: "History", icon: Clock },
];

export default function Sidebar({ collapsed }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`} aria-label="Main navigation">
      <div className="logo">
        <div className="logo-mark" aria-hidden>XC</div>
        {!collapsed && <div className="logo-text">Xeno CRM</div>}
      </div>

      <nav className="nav" role="navigation">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Icon className="nav-icon" />
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">{!collapsed && <small>v1.0 • Xeno</small>}</div>
    </aside>
  );
}
