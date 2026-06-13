import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Campaigns from "./pages/Campaigns";
import Analytics from "./pages/Analytics";
import AICopilot from "./pages/AICopilot";
import CampaignHistory from "./pages/CampaignHistory";
import Layout from "./components/Layout";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai" element={<AICopilot />} />
          <Route path="/history" element={<CampaignHistory />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;