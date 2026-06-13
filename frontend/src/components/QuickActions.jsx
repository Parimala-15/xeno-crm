import React, { useState } from "react";
import API from "../services/api";

export default function QuickActions() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const createCustomer = async () => {
    const name = window.prompt("Customer name");
    if (!name) return;
    const email = window.prompt("Email", `${name.replace(/\s+/g, ".").toLowerCase()}@example.com`);
    if (!email) return;
    const phone = window.prompt("Phone", "");
    const city = window.prompt("City", "");

    setLoading(true);
    try {
      await API.post("/customers", { name, email, phone, city });
      setStatus("Customer created");
    } catch (err) {
      setStatus("Failed to create customer");
    } finally {
      setLoading(false);
    }
  };

  const generateSegment = async () => {
    const prompt = window.prompt("Segment prompt", "Bring back inactive customers");
    if (!prompt) return;
    setLoading(true);
    try {
      await API.post("/ai/segment", { prompt });
      setStatus("Segment generated");
    } catch (err) {
      setStatus("Failed to generate segment");
    } finally {
      setLoading(false);
    }
  };

  const generateCampaign = async () => {
    const goal = window.prompt("Campaign goal", "Increase repeat purchases");
    if (!goal) return;
    setLoading(true);
    try {
      await API.post("/ai/campaign", { goal });
      setStatus("Campaign generated");
    } catch (err) {
      setStatus("Failed to generate campaign");
    } finally {
      setLoading(false);
    }
  };

  const sendCampaign = async () => {
    setLoading(true);
    try {
      const res = await API.post("/campaigns/send");
      setStatus(res.data.campaign_status?.status || "Sent");
    } catch (err) {
      setStatus("Failed to send campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Quick Actions</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
        <button className="btn" onClick={createCustomer} disabled={loading}>
          Create Customer
        </button>

        <button className="btn btn-muted" onClick={generateSegment} disabled={loading}>
          Generate Segment
        </button>

        <button className="btn" onClick={generateCampaign} disabled={loading}>
          Generate Campaign
        </button>

        <button className="btn btn-muted" onClick={sendCampaign} disabled={loading}>
          {loading ? "Sending..." : "Send Campaign"}
        </button>
      </div>

      {status && <div style={{ marginTop: 12, fontSize: 13, color: "#374151" }}>{status}</div>}
    </div>
  );
}
