import { useState } from "react";

const locations = [
  { id: 1, name: "Shake Shack – Times Square", category: "Food", icon: "🍔", wait: 22, trend: "up", capacity: 78, reports: 14, lastUpdated: "2 min ago", address: "691 8th Ave, New York", tags: ["Popular", "Lunch Rush"] },
  { id: 2, name: "DMV – Downtown Branch", category: "Government", icon: "🏛️", wait: 67, trend: "down", capacity: 91, reports: 31, lastUpdated: "5 min ago", address: "300 Centre St, New York", tags: ["Long Wait", "Appointment Rec."] },
  { id: 3, name: "Apple Store – Fifth Ave", category: "Retail", icon: "🍎", wait: 8, trend: "stable", capacity: 34, reports: 9, lastUpdated: "1 min ago", address: "767 5th Ave, New York", tags: ["Short Wait"] },
  { id: 4, name: "Urgent Care – Chelsea", category: "Healthcare", icon: "🏥", wait: 45, trend: "up", capacity: 85, reports: 22, lastUpdated: "3 min ago", address: "269 W 23rd St, New York", tags: ["High Demand", "Bring ID"] },
  { id: 5, name: "Whole Foods – Columbus", category: "Grocery", icon: "🛒", wait: 5, trend: "stable", capacity: 45, reports: 7, lastUpdated: "4 min ago", address: "10 Columbus Cir, New York", tags: ["Self-Checkout Available"] },
  { id: 6, name: "Post Office – Midtown", category: "Government", icon: "📬", wait: 31, trend: "down", capacity: 60, reports: 18, lastUpdated: "6 min ago", address: "421 8th Ave, New York", tags: ["Moderate"] },
];

const categories = ["All", "Food", "Government", "Retail", "Healthcare", "Grocery"];

const waitColor = (wait) => {
  if (wait <= 10) return { bar: "#00e5a0", text: "#00e5a0" };
  if (wait <= 30) return { bar: "#f5c842", text: "#f5c842" };
  return { bar: "#ff5c5c", text: "#ff5c5c" };
};

const TrendIcon = ({ trend }) => {
  if (trend === "up") return <span style={{ color: "#ff5c5c", fontSize: 12 }}>▲ Rising</span>;
  if (trend === "down") return <span style={{ color: "#00e5a0", fontSize: 12 }}>▼ Dropping</span>;
  return <span style={{ color: "#888", fontSize: 12 }}>● Steady</span>;
};

const ReportModal = ({ location, onClose, onSubmit }) => {
  const [selected, setSelected] = useState(null);
  const options = ["Under 5 min", "5–15 min", "15–30 min", "30–60 min", "60+ min"];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, backdropFilter: "blur(4px)", padding: "0 16px" }}>
      <div style={{ background: "#161b26", border: "1px solid #2a3244", borderRadius: 20, padding: "28px 24px", width: "100%", maxWidth: 360 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 4 }}>Report Wait Time</div>
        <div style={{ color: "#666", fontSize: 13, marginBottom: 20 }}>{location.name}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {options.map(opt => (
            <button key={opt} onClick={() => setSelected(opt)} style={{
              background: selected === opt ? "#00e5a0" : "#1e2535",
              border: selected === opt ? "none" : "1px solid #2a3244",
              borderRadius: 10, padding: "12px 16px",
              color: selected === opt ? "#0d1117" : "#ccc",
              fontWeight: selected === opt ? 700 : 400,
              cursor: "pointer", fontSize: 14, textAlign: "left"
            }}>{opt}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid #2a3244", borderRadius: 10, padding: 12, color: "#888", cursor: "pointer", fontSize: 13 }}>Cancel</button>
          <button onClick={() => selected && onSubmit(selected)} style={{ flex: 2, background: selected ? "#00e5a0" : "#1e2535", border: "none", borderRadius: 10, padding: 12, color: selected ? "#0d1117" : "#555", fontWeight: 700, cursor: selected ? "pointer" : "default", fontSize: 13 }}>Submit</button>
        </div>
      </div>
    </div>
  );
};

const LocationCard = ({ loc, onReport }) => {
  const wc = waitColor(loc.wait);
  return (
    <div style={{ background: "#161b26", border: "1px solid #1e2a3a", borderRadius: 18, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#1e2535", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{loc.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", lineHeight: 1.3 }}>{loc.name}</div>
          <div style={{ color: "#555", fontSize: 12, marginTop: 2 }}>{loc.address}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: wc.text, lineHeight: 1 }}>
            {loc.wait}<span style={{ fontSize: 12, fontWeight: 400, color: "#666" }}>m</span>
          </div>
          <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>est. wait</div>
        </div>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 11, color: "#555" }}>Capacity</span>
          <span style={{ fontSize: 11, color: wc.text }}>{loc.capacity}% full</span>
        </div>
        <div style={{ height: 4, background: "#1e2535", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${loc.capacity}%`, background: wc.bar, borderRadius: 99 }} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {loc.tags.map(t => (
          <span key={t} style={{ background: "#1e2535", border: "1px solid #2a3244", borderRadius: 99, padding: "2px 8px", fontSize: 10, color: "#888" }}>{t}</span>
        ))}
        <span style={{ marginLeft: "auto" }}><TrendIcon trend={loc.trend} /></span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #1e2535", paddingTop: 10 }}>
        <span style={{ fontSize: 11, color: "#444" }}>{loc.reports} reports · {loc.lastUpdated}</span>
        <button onClick={() => onReport(loc)} style={{ background: "transparent", border: "1px solid #2a3244", borderRadius: 8, padding: "5px 12px", color: "#00e5a0", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>+ Report</button>
      </div>
    </div>
  );
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [reportTarget, setReportTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [locs, setLocs] = useState(locations);

  const filtered = locs
    .filter(l => activeCategory === "All" || l.category === activeCategory)
    .filter(l => l.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.wait - b.wait);

  const handleSubmit = (range) => {
    const minuteMap = { "Under 5 min": 3, "5–15 min": 10, "15–30 min": 22, "30–60 min": 45, "60+ min": 70 };
    setLocs(prev => prev.map(l => l.id === reportTarget.id ? { ...l, wait: minuteMap[range], reports: l.reports + 1, lastUpdated: "just now" } : l));
    setReportTarget(null);
    setToast("Thanks! Your report helps everyone 🙌");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      {/* Sticky header */}
      <div style={{ position: "sticky", top: 0, background: "#0d1117", borderBottom: "1px solid #1a2030", padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/logo.png" alt="QueueCut Logo" style={{ width: 38, height: 38, objectFit: "contain" }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>Queue<span style={{ color: "#00e5a0" }}>Cut</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00e5a0", boxShadow: "0 0 6px #00e5a0" }} />
          <span style={{ fontSize: 12, color: "#555" }}>Live</span>
        </div>
      </div>

      <div style={{ padding: "20px 16px 0" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ display: "inline-block", background: "#00e5a015", border: "1px solid #00e5a030", borderRadius: 99, padding: "3px 12px", fontSize: 11, color: "#00e5a0", marginBottom: 12 }}>📍 New York City · 6 locations</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, lineHeight: 1.2, letterSpacing: -0.5, margin: 0 }}>
            Skip the wait.<br /><span style={{ color: "#00e5a0" }}>Cut the queue.</span>
          </h1>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Avg Wait", value: `${Math.round(locs.reduce((s,l)=>s+l.wait,0)/locs.length)}m`, icon: "⏱" },
            { label: "Short Waits", value: `${locs.filter(l=>l.wait<=10).length} spots`, icon: "✅" },
            { label: "Reports", value: `${locs.reduce((s,l)=>s+l.reports,0)}`, icon: "📣" },
          ].map(s => (
            <div key={s.label} style={{ background: "#161b26", border: "1px solid #1e2535", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 18, marginBottom: 3 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 14 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#555" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search locations..." style={{ width: "100%", background: "#161b26", border: "1px solid #1e2535", borderRadius: 12, padding: "11px 14px 11px 34px", color: "#fff", fontSize: 14, outline: "none" }} />
        </div>

        {/* Categories */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background: activeCategory === cat ? "#00e5a0" : "#161b26", border: activeCategory === cat ? "none" : "1px solid #1e2535", borderRadius: 99, padding: "6px 14px", color: activeCategory === cat ? "#0d1117" : "#888", fontWeight: activeCategory === cat ? 700 : 400, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>{cat}</button>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(loc => <LocationCard key={loc.id} loc={loc} onReport={setReportTarget} />)}
        </div>

        {/* Pro Banner */}
        <div style={{ marginTop: 24, background: "linear-gradient(135deg,#0f2a1e,#0d1a2e)", border: "1px solid #00e5a030", borderRadius: 18, padding: "20px" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>⚡ QueueCut Pro</div>
          <div style={{ color: "#777", fontSize: 13, marginBottom: 14 }}>Alerts before crowds form. Trends + history.</div>
          <button style={{ background: "#00e5a0", border: "none", borderRadius: 10, padding: "10px 20px", color: "#0d1117", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Try Free → $4.99/mo</button>
        </div>
      </div>

      {reportTarget && <ReportModal location={reportTarget} onClose={() => setReportTarget(null)} onSubmit={handleSubmit} />}
      {toast && (
        <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#00e5a0", color: "#0d1117", borderRadius: 12, padding: "12px 20px", fontWeight: 600, fontSize: 13, zIndex: 400, whiteSpace: "nowrap" }}>{toast}</div>
      )}
    </div>
  );
}
