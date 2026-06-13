import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className={`app ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} />

      <div className="main">
        <Topbar onToggle={() => setCollapsed(!collapsed)} />

        <div className="content">{children}</div>
      </div>
    </div>
  );
}
