import { useEffect, useState } from "react";
import API from "../services/api";

function tryParseJSON(input) {
  if (!input) return input;
  if (typeof input === "object") return input;
  try {
    return JSON.parse(input);
  } catch (e) {
    // attempt to extract JSON substring
    const start = input.indexOf("{");
    const end = input.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(input.substring(start, end + 1));
      } catch (e2) {
        return input;
      }
    }
    return input;
  }
}

export default function AICopilot() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    API.get("/customers").then((res) => setCustomers(Array.isArray(res.data) ? res.data : []));
  }, []);

  const suggested = [
    "Bring back inactive customers",
    "Reward high value customers",
    "Create festival campaign",
    "Increase repeat purchases",
  ];

  const addMessage = (m) => setMessages((s) => [m, ...s]);

  const handleSegment = async (p) => {
    setLoading(true);
    try {
      const res = await API.post("/ai/segment", { prompt: p });
      const parsed = tryParseJSON(res.data?.response || res.data || "");
      addMessage({ role: "ai", type: "segment", raw: res.data, parsed });
    } catch (e) {
      addMessage({ role: "ai", type: "error", raw: "Error generating segment" });
    } finally {
      setLoading(false);
    }
  };

  const handleCampaign = async (p) => {
    setLoading(true);
    try {
      const res = await API.post("/ai/campaign", { goal: p });
      const parsed = tryParseJSON(res.data?.response || res.data || "");
      addMessage({ role: "ai", type: "campaign", raw: res.data, parsed });
    } catch (e) {
      addMessage({ role: "ai", type: "error", raw: "Error generating campaign" });
    } finally {
      setLoading(false);
    }
  };

  const onUseSuggestion = (s) => setPrompt(s);

  const submitSegment = () => {
    if (!prompt) return;
    addMessage({ role: "user", text: prompt });
    handleSegment(prompt);
  };

  const submitCampaign = () => {
    if (!prompt) return;
    addMessage({ role: "user", text: prompt });
    handleCampaign(prompt);
  };

  const estimateAudience = (parsed) => {
    if (!parsed || !customers) return null;
    const rules = parsed.rules || (parsed.response && parsed.response.rules) || null;
    if (!rules) return null;
    let result = customers;
    if (rules.spend_gt) result = result.filter((c) => (c.total_spend || 0) >= Number(rules.spend_gt));
    if (rules.inactive_days) {
      // best-effort: if we have created_at, filter by date
      const cutoff = Date.now() - Number(rules.inactive_days) * 24 * 60 * 60 * 1000;
      result = result.filter((c) => {
        const t = c.created_at || c.createdAt;
        if (!t) return false;
        return new Date(t).getTime() <= cutoff;
      });
    }
    return result.length;
  };

  return (
    <div>
      <h1>AI Copilot Workspace</h1>
      <p style={{ color: "#6b7280" }}>Generate segments, campaigns and preview audiences with AI.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 16 }}>
        <div className="card">
          <h4>Prompt</h4>
          <textarea aria-label="AI prompt" rows={6} placeholder="Describe your marketing goal or audience" value={prompt} onChange={(e) => setPrompt(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10 }} />

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="btn" onClick={submitSegment} disabled={loading}>Generate Segment</button>
            <button className="btn btn-muted" onClick={submitCampaign} disabled={loading}>Generate Campaign</button>
          </div>

          <h5 style={{ marginTop: 14 }}>Suggested Prompts</h5>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {suggested.map((s) => (
              <button key={s} className="btn btn-muted" onClick={() => onUseSuggestion(s)}>{s}</button>
            ))}
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 12 }}>
            <h4>Results</h4>
            {loading && <div className="skeleton" style={{ height: 80, marginTop: 12 }} />}
            {messages.length === 0 && !loading && <div className="empty-state">No AI activity yet. Try a suggested prompt.</div>}
          </div>

          <div className="ai-chat">
            {messages.map((m, idx) => (
              <div key={idx} className={`ai-message ${m.role === "user" ? "user" : "ai"}`} style={{ marginBottom: 12 }}>
                <div className={`ai-bubble ${m.role === "user" ? "user" : ""}`}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 700 }}>{m.role === "user" ? "You" : m.type === "segment" ? "Segment" : m.type === "campaign" ? "Campaign" : "AI"}</div>
                    <div className="ai-meta">Confidence: N/A</div>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    {m.role === "user" && <div>{m.text}</div>}

                    {m.role === "ai" && (
                      <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{typeof m.parsed === "object" ? JSON.stringify(m.parsed, null, 2) : String(m.parsed || m.raw)}</pre>
                    )}
                  </div>

                  {m.parsed && m.role === "ai" && (
                    <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                      <div className="badge">Audience: {estimateAudience(m.parsed) ?? "N/A"}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}