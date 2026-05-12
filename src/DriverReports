import { useState } from "react";

// ── Mock data for driver reports ──
const mockDriverReports = [
  { id: 1, platform: "doordash", location: "McDonald's – Times Square", wait: 12, note: "Only 2 orders ahead of me", time: "3 min ago", verified: true },
  { id: 2, platform: "ubereats", location: "Shake Shack – 8th Ave", wait: 22, note: "Super busy, staff overwhelmed", time: "7 min ago", verified: true },
  { id: 3, platform: "doordash", location: "Chipotle – Midtown", wait: 8, note: "Order was ready when I arrived", time: "12 min ago", verified: false },
  { id: 4, platform: "ubereats", location: "Five Guys – 42nd St", wait: 35, note: "Short staffed today", time: "18 min ago", verified: true },
  { id: 5, platform: "doordash", location: "Sweetgreen – Bryant Park", wait: 5, note: "Quick pickup, no issues", time: "24 min ago", verified: false },
];

const platforms = [
  { id: "doordash", label: "DoorDash", color: "#FF3008", emoji: "🔴" },
  { id: "ubereats", label: "Uber Eats", color: "#06C167", emoji: "🟢" },
  { id: "grubhub", label: "Grubhub", emoji: "🟠", color: "#F63440" },
  { id: "instacart", label: "Instacart", emoji: "🟡", color: "#43B02A" },
];

const waitRanges = [
  { label: "Ready now", value: 0, emoji: "⚡" },
  { label: "Under 5 min", value: 4, emoji: "🟢" },
  { label: "5–10 min", value: 8, emoji: "🟡" },
  { label: "10–20 min", value: 15, emoji: "🟠" },
  { label: "20–30 min", value: 25, emoji: "🔴" },
  { label: "30+ min", value: 35, emoji: "🚨" },
];

const waitColor = (wait) => {
  if (wait <= 5) return "#00e5a0";
  if (wait <= 15) return "#f5c842";
  if (wait <= 25) return "#ff9500";
  return "#ff5c5c";
};

const PlatformBadge = ({ platform }) => {
  const p = platforms.find(p => p.id === platform);
  return (
    <span style={{
      background: `${p?.color}22`, border: `1px solid ${p?.color}44`,
      borderRadius: 99, padding: "3px 10px", fontSize: 11,
      color: p?.color, fontWeight: 600, display: "inline-flex",
      alignItems: "center", gap: 4
    }}>
      {p?.emoji} {p?.label}
    </span>
  );
};

const ReportCard = ({ report }) => (
  <div style={{
    background: "#161b26", border: "1px solid #1e2535",
    borderRadius: 16, padding: "16px 18px",
    display: "flex", flexDirection: "column", gap: 10,
    transition: "transform 0.15s",
  }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
    onMouseLeave={e => e.currentTarget.style.transform = ""}
  >
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 4 }}>
          {report.location}
        </div>
        <PlatformBadge platform={report.platform} />
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: waitColor(report.wait), lineHeight: 1 }}>
          {report.wait}<span style={{ fontSize: 12, color: "#555", fontWeight: 400 }}>m</span>
        </div>
        <div style={{ fontSize: 10, color: "#555" }}>pickup wait</div>
      </div>
    </div>

    {report.note && (
      <div style={{ background: "#1e2535", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "#aaa", fontStyle: "italic" }}>
        "{report.note}"
      </div>
    )}

    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 11, color: "#444" }}>🕐 {report.time}</span>
      {report.verified && (
        <span style={{ fontSize: 11, color: "#00e5a0", display: "flex", alignItems: "center", gap: 3 }}>
          ✓ Verified driver
        </span>
      )}
    </div>
  </div>
);

const SubmitModal = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState(null);
  const [location, setLocation] = useState("");
  const [waitRange, setWaitRange] = useState(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!platform || !location || waitRange === null) return;
    setSubmitted(true);
    setTimeout(() => { onSubmit({ platform, location, wait: waitRange.value, note }); }, 1500);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 300, backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#111827", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "28px 24px 40px", border: "1px solid #1e2535", borderBottom: "none" }}>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#00e5a0", marginBottom: 8 }}>Report Submitted!</div>
            <div style={{ color: "#666", fontSize: 14 }}>Thanks for helping the driver community 🙌</div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#fff" }}>Report Pickup Wait</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Step {step} of 3</div>
              </div>
              <button onClick={onClose} style={{ background: "#1e2535", border: "none", borderRadius: 8, width: 32, height: 32, color: "#666", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            {/* Progress bar */}
            <div style={{ height: 3, background: "#1e2535", borderRadius: 99, marginBottom: 24, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(step / 3) * 100}%`, background: "#00e5a0", borderRadius: 99, transition: "width 0.3s ease" }} />
            </div>

            {/* Step 1: Platform */}
            {step === 1 && (
              <div>
                <div style={{ fontSize: 14, color: "#888", marginBottom: 16 }}>Which platform are you driving for?</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {platforms.map(p => (
                    <button key={p.id} onClick={() => setPlatform(p.id)} style={{
                      background: platform === p.id ? `${p.color}22` : "#1e2535",
                      border: `1.5px solid ${platform === p.id ? p.color : "#2a3244"}`,
                      borderRadius: 14, padding: "14px 12px",
                      color: platform === p.id ? p.color : "#888",
                      cursor: "pointer", fontSize: 13, fontWeight: platform === p.id ? 700 : 400,
                      display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s"
                    }}>
                      <span style={{ fontSize: 18 }}>{p.emoji}</span>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Location + Wait */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>Restaurant name</div>
                  <input
                    value={location} onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. McDonald's – Times Square"
                    style={{ width: "100%", background: "#1e2535", border: "1px solid #2a3244", borderRadius: 12, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>How long did you wait?</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {waitRanges.map(r => (
                      <button key={r.value} onClick={() => setWaitRange(r)} style={{
                        background: waitRange?.value === r.value ? "#00e5a022" : "#1e2535",
                        border: `1.5px solid ${waitRange?.value === r.value ? "#00e5a0" : "#2a3244"}`,
                        borderRadius: 12, padding: "11px 12px",
                        color: waitRange?.value === r.value ? "#00e5a0" : "#888",
                        cursor: "pointer", fontSize: 12,
                        fontWeight: waitRange?.value === r.value ? 700 : 400,
                        display: "flex", alignItems: "center", gap: 6,
                        transition: "all 0.15s"
                      }}>
                        {r.emoji} {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Note */}
            {step === 3 && (
              <div>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>Add a note for other drivers <span style={{ color: "#444" }}>(optional)</span></div>
                <textarea
                  value={note} onChange={e => setNote(e.target.value)}
                  placeholder="e.g. Only 2 orders ahead, staff was quick..."
                  rows={4}
                  style={{ width: "100%", background: "#1e2535", border: "1px solid #2a3244", borderRadius: 12, padding: "12px 14px", color: "#fff", fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }}
                />
                <div style={{ background: "#0f2a1e", border: "1px solid #00e5a030", borderRadius: 12, padding: "12px 14px", marginTop: 12 }}>
                  <div style={{ fontSize: 12, color: "#00e5a0", fontWeight: 600, marginBottom: 4 }}>📍 Summary</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{location}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                    <PlatformBadge platform={platform} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: waitColor(waitRange?.value || 0) }}>{waitRange?.label}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, background: "transparent", border: "1px solid #2a3244", borderRadius: 12, padding: 14, color: "#888", cursor: "pointer", fontSize: 14 }}>← Back</button>
              )}
              <button
                onClick={() => step < 3 ? setStep(s => s + 1) : handleSubmit()}
                disabled={
                  (step === 1 && !platform) ||
                  (step === 2 && (!location || waitRange === null))
                }
                style={{
                  flex: 2, background: (step === 1 && !platform) || (step === 2 && (!location || waitRange === null)) ? "#1e2535" : "#00e5a0",
                  border: "none", borderRadius: 12, padding: 14,
                  color: (step === 1 && !platform) || (step === 2 && (!location || waitRange === null)) ? "#555" : "#0d1117",
                  fontWeight: 700, cursor: "pointer", fontSize: 14, transition: "all 0.15s"
                }}
              >
                {step < 3 ? "Continue →" : "Submit Report ✓"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function DriverReports() {
  const [reports, setReports] = useState(mockDriverReports);
  const [showModal, setShowModal] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [toast, setToast] = useState(null);

  const filtered = filterPlatform === "all" ? reports : reports.filter(r => r.platform === filterPlatform);

  const avgWait = Math.round(filtered.reduce((s, r) => s + r.wait, 0) / (filtered.length || 1));
  const fastPickups = filtered.filter(r => r.wait <= 8).length;

  const handleSubmit = ({ platform, location, wait, note }) => {
    const p = platforms.find(p => p.id === platform);
    setReports(prev => [{
      id: Date.now(), platform, location, wait, note,
      time: "just now", verified: false
    }, ...prev]);
    setShowModal(false);
    setToast(`✓ Report added for ${p?.label}!`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, background: "#0d1117", borderBottom: "1px solid #1a2030", padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "#00e5a0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🛵</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: -0.5 }}>
            Queue<span style={{ color: "#00e5a0" }}>Cut</span>
            <span style={{ color: "#555", fontWeight: 400, fontSize: 12, marginLeft: 6 }}>/ Drivers</span>
          </span>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: "#00e5a0", border: "none", borderRadius: 10, padding: "8px 16px", color: "#0d1117", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          + Report Wait
        </button>
      </div>

      <div style={{ padding: "20px 16px 0" }}>
        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #0f2a1e, #0d1a2e)", border: "1px solid #00e5a030", borderRadius: 20, padding: "20px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 24 }}>🛵</span>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#fff" }}>Driver Pickup Times</div>
              <div style={{ fontSize: 12, color: "#666" }}>Real reports from DoorDash & Uber Eats drivers</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Avg Wait", value: `${avgWait}m`, icon: "⏱" },
              { label: "Fast Pickups", value: fastPickups, icon: "⚡" },
              { label: "Reports Today", value: reports.length, icon: "📣" },
            ].map(s => (
              <div key={s.label} style={{ background: "#0d1117", borderRadius: 12, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 16, marginBottom: 2 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#555" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform filter */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
          <button onClick={() => setFilterPlatform("all")} style={{ background: filterPlatform === "all" ? "#00e5a0" : "#161b26", border: filterPlatform === "all" ? "none" : "1px solid #1e2535", borderRadius: 99, padding: "7px 16px", color: filterPlatform === "all" ? "#0d1117" : "#888", fontWeight: filterPlatform === "all" ? 700 : 400, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>All Platforms</button>
          {platforms.map(p => (
            <button key={p.id} onClick={() => setFilterPlatform(p.id)} style={{ background: filterPlatform === p.id ? `${p.color}22` : "#161b26", border: `1px solid ${filterPlatform === p.id ? p.color : "#1e2535"}`, borderRadius: 99, padding: "7px 16px", color: filterPlatform === p.id ? p.color : "#888", fontWeight: filterPlatform === p.id ? 700 : 400, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
              {p.emoji} {p.label}
            </button>
          ))}
        </div>

        {/* How it works */}
        <div style={{ background: "#161b26", border: "1px solid #1e2535", borderRadius: 16, padding: "16px 18px", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>💡 How it works</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { icon: "🛵", text: "Drivers report pickup wait times after each order" },
              { icon: "📊", text: "Data updates in real-time for other drivers nearby" },
              { icon: "⚡", text: "See which restaurants are slow before you accept the order" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: 13, color: "#888" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reports list */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            Recent Reports
            <span style={{ fontSize: 12, color: "#555", fontWeight: 400 }}>{filtered.length} reports</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(r => <ReportCard key={r.id} report={r} />)}
          </div>
        </div>
      </div>

      {showModal && <SubmitModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} />}

      {toast && (
        <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#00e5a0", color: "#0d1117", borderRadius: 12, padding: "12px 20px", fontWeight: 600, fontSize: 13, zIndex: 400, whiteSpace: "nowrap" }}>{toast}</div>
      )}

      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 0; height: 0; } textarea::placeholder, input::placeholder { color: #555; }`}</style>
    </div>
  );
}
