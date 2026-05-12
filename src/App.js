import { useState } from "react";
import Home from "./components/Home";
import PopularTimes from "./components/PopularTimes";
import DriverReports from "./components/DriverReports";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div>
      {/* Global Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#0d1117", borderTop: "1px solid #1a2030",
        display: "flex", zIndex: 200, padding: "8px 0 20px"
      }}>
        {[
          { id: "home", label: "Live", icon: "⏱" },
          { id: "drivers", label: "Drivers", icon: "🛵" },
          { id: "data", label: "Data", icon: "📊" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setPage(tab.id)} style={{
            flex: 1, background: "transparent", border: "none",
            color: page === tab.id ? "#00e5a0" : "#555",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 4, cursor: "pointer", fontSize: 18, padding: "6px 0"
          }}>
            <span>{tab.icon}</span>
            <span style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: page === tab.id ? 600 : 400 }}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Pages */}
      <div style={{ paddingBottom: 80 }}>
        {page === "home" && <Home />}
        {page === "drivers" && <DriverReports />}
        {page === "data" && <PopularTimes />}
      </div>
    </div>
  );
}
