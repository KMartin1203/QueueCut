import { useState } from "react";

const features = [
  {
    icon: "🔔",
    title: "Smart Alerts",
    desc: "Get notified the moment a location drops below your target wait time.",
    example: "Alert me when Shake Shack is under 10 min",
    pro: true,
  },
  {
    icon: "📈",
    title: "Historical Trends",
    desc: "See the best and worst times to visit any location by day and hour.",
    example: "Tuesday at 2pm is always dead at the DMV",
    pro: true,
  },
  {
    icon: "⭐",
    title: "Favorite Locations",
    desc: "Save your go-to spots for instant one-tap access.",
    example: "Your top 5 locations always front and center",
    pro: true,
  },
  {
    icon: "🗺️",
    title: "Nearby Mode",
    desc: "Auto-detect your location and show the shortest waits around you.",
    example: "Shortest wait within 0.5 miles right now",
    pro: true,
  },
  {
    icon: "📊",
    title: "Weekly Digest",
    desc: "Get a Sunday recap of the best times to visit your favorites.",
    example: "Best times this week for your saved spots",
    pro: true,
  },
  {
    icon: "⏱",
    title: "Live Wait Times",
    desc: "See real-time wait times for any location.",
    example: "Always free for everyone",
    pro: false,
  },
  {
    icon: "📣",
    title: "Community Reports",
    desc: "Submit and view crowdsourced wait time reports.",
    example: "Always free for everyone",
    pro: false,
  },
];

const plans = [
  {
    id: "monthly",
    label: "Monthly",
    price: "$4.99",
    period: "/mo",
    savings: null,
    badge: null,
  },
  {
    id: "yearly",
    label: "Yearly",
    price: "$3.99",
    period: "/mo",
    savings: "Save 20%",
    badge: "Best Value",
  },
];

const alertLocations = [
  { id: 1, name: "Shake Shack – Times Square", icon: "🍔" },
  { id: 2, name: "DMV – Downtown Branch", icon: "🏛️" },
  { id: 3, name: "Joe's Pizza – Carmine St", icon: "🍕" },
  { id: 4, name: "Carbone – Greenwich Village", icon: "🍝" },
];

const AlertSetup = ({ onClose }) => {
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [threshold, setThreshold] = useState(15);
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 400, backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#111827", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "28px 24px 44px", border: "1px solid #1e2535", borderBottom: "none" }}>
        <div style={{ width: 40, height: 4, background: "#2a3244", borderRadius: 99, margin: "0 auto 24px" }} />

        {saved ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔔</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#00e5a0", marginBottom: 8 }}>Alert Set!</div>
            <div style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
              We'll notify you when {alertLocations.find(l => l.id === selectedLoc)?.name} drops below <strong style={{ color: "#fff" }}>{threshold} min</strong>.
            </div>
            <button onClick={onClose} style={{ background: "#00e5a0", border: "none", borderRadius: 12, padding: "14px 32px", color: "#0d1117", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Done ✓</button>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 4 }}>Set a Wait Alert</div>
            <div style={{ fontSize: 13, color: "#555", marginBottom: 20 }}>Get notified when the wait drops to your target</div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>Choose location</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {alertLocations.map(loc => (
                  <button key={loc.id} onClick={() => setSelectedLoc(loc.id)} style={{ background: selectedLoc === loc.id ? "#00e5a022" : "#1e2535", border: `1.5px solid ${selectedLoc === loc.id ? "#00e5a0" : "#2a3244"}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
                    <span style={{ fontSize: 18 }}>{loc.icon}</span>
                    <span style={{ fontSize: 13, color: selectedLoc === loc.id ? "#00e5a0" : "#ccc", fontWeight: selectedLoc === loc.id ? 600 : 400 }}>{loc.name}</span>
                    {selectedLoc === loc.id && <span style={{ marginLeft: "auto", color: "#00e5a0" }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: "#888" }}>Alert me when wait is under</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#00e5a0" }}>{threshold} min</div>
              </div>
              <input type="range" min={5} max={60} step={5} value={threshold} onChange={e => setThreshold(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#00e5a0", cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "#444" }}>5 min</span>
                <span style={{ fontSize: 10, color: "#444" }}>60 min</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid #2a3244", borderRadius: 12, padding: 14, color: "#888", cursor: "pointer", fontSize: 14 }}>Cancel</button>
              <button onClick={() => selectedLoc && setSaved(true)} disabled={!selectedLoc} style={{ flex: 2, background: selectedLoc ? "#00e5a0" : "#1e2535", border: "none", borderRadius: 12, padding: 14, color: selectedLoc ? "#0d1117" : "#555", fontWeight: 700, cursor: selectedLoc ? "pointer" : "default", fontSize: 14 }}>Set Alert 🔔</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function Pro() {
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [isPro, setIsPro] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState([
    { id: 1, location: "Shake Shack – Times Square", icon: "🍔", threshold: 10, active: true },
  ]);
  const [favorites] = useState([
    { id: 1, name: "Joe's Pizza – Carmine St", icon: "🍕", wait: 5 },
    { id: 2, name: "Shake Shack – Times Square", icon: "🍔", wait: 22 },
  ]);

  const handleUpgrade = () => setIsPro(true);

  if (isPro) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
        {/* Header */}
        <div style={{ position: "sticky", top: 0, background: "#0d1117", borderBottom: "1px solid #1a2030", padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16 }}>Queue<span style={{ color: "#00e5a0" }}>Cut</span> <span style={{ color: "#f5c842", fontSize: 13 }}>⚡ Pro</span></span>
          <div style={{ background: "#f5c84222", border: "1px solid #f5c84244", borderRadius: 99, padding: "4px 12px", fontSize: 11, color: "#f5c842", fontWeight: 600 }}>Active</div>
        </div>

        <div style={{ padding: "20px 16px 0" }}>
          {/* Pro welcome */}
          <div style={{ background: "linear-gradient(135deg, #0f2a1e, #1a2a0f)", border: "1px solid #00e5a030", borderRadius: 20, padding: "20px", marginBottom: 24, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>⚡</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", marginBottom: 4 }}>You're a Pro!</div>
            <div style={{ fontSize: 13, color: "#666" }}>All features unlocked. Enjoy knowing before you go.</div>
          </div>

          {/* Smart Alerts */}
          <div style={{ background: "#161b26", border: "1px solid #1e2535", borderRadius: 18, padding: "18px 20px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#fff" }}>🔔 Smart Alerts</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{activeAlerts.length} active alert{activeAlerts.length !== 1 ? "s" : ""}</div>
              </div>
              <button onClick={() => setShowAlert(true)} style={{ background: "#00e5a015", border: "1px solid #00e5a030", borderRadius: 10, padding: "7px 14px", color: "#00e5a0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Add</button>
            </div>
            {activeAlerts.map(alert => (
              <div key={alert.id} style={{ background: "#1e2535", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{alert.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>{alert.location}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>Alert when under {alert.threshold} min</div>
                </div>
                <div style={{ width: 32, height: 18, borderRadius: 99, background: alert.active ? "#00e5a0" : "#2a3244", display: "flex", alignItems: "center", padding: "2px", cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", marginLeft: alert.active ? "auto" : 0, transition: "all 0.2s" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Favorites */}
          <div style={{ background: "#161b26", border: "1px solid #1e2535", borderRadius: 18, padding: "18px 20px", marginBottom: 14 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 14 }}>⭐ Favorites</div>
            {favorites.map(fav => (
              <div key={fav.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #1e2535" }}>
                <span style={{ fontSize: 20 }}>{fav.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>{fav.name}</div>
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: fav.wait <= 10 ? "#00e5a0" : fav.wait <= 30 ? "#f5c842" : "#ff5c5c" }}>{fav.wait}m</div>
              </div>
            ))}
            <button style={{ marginTop: 12, background: "transparent", border: "1px dashed #2a3244", borderRadius: 10, padding: "10px", width: "100%", color: "#555", fontSize: 13, cursor: "pointer" }}>+ Add Favorite</button>
          </div>

          {/* Trends preview */}
          <div style={{ background: "#161b26", border: "1px solid #1e2535", borderRadius: 18, padding: "18px 20px", marginBottom: 14 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 14 }}>📈 Best Times This Week</div>
            {[
              { day: "Mon", time: "2–4pm", wait: 5, location: "Joe's Pizza" },
              { day: "Wed", time: "10–11am", wait: 8, location: "Shake Shack" },
              { day: "Fri", time: "3–5pm", wait: 12, location: "Carbone" },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < 2 ? "1px solid #1e2535" : "none" }}>
                <div style={{ background: "#1e2535", borderRadius: 8, padding: "6px 10px", textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: "#555" }}>{t.day}</div>
                  <div style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{t.time}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#fff" }}>{t.location}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>Historically quiet</div>
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#00e5a0" }}>~{t.wait}m</div>
              </div>
            ))}
          </div>
        </div>

        {showAlert && <AlertSetup onClose={() => setShowAlert(false)} />}
      </div>
    );
  }

  // Upgrade screen
  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <div style={{ position: "sticky", top: 0, background: "#0d1117", borderBottom: "1px solid #1a2030", padding: "0 16px", height: 56, display: "flex", alignItems: "center", zIndex: 100 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16 }}>Queue<span style={{ color: "#00e5a0" }}>Cut</span> <span style={{ color: "#f5c842" }}>Pro</span></span>
      </div>

      <div style={{ padding: "24px 16px 100px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, margin: "0 0 10px", lineHeight: 1.2 }}>
            Upgrade to <span style={{ color: "#f5c842" }}>Pro</span>
          </h1>
          <p style={{ color: "#666", fontSize: 14, margin: 0 }}>Know before you go. Always.</p>
        </div>

        {/* Plan toggle */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {plans.map(plan => (
            <button key={plan.id} onClick={() => setSelectedPlan(plan.id)} style={{ flex: 1, background: selectedPlan === plan.id ? "#161b26" : "transparent", border: `2px solid ${selectedPlan === plan.id ? "#00e5a0" : "#1e2535"}`, borderRadius: 16, padding: "14px 10px", cursor: "pointer", textAlign: "center", position: "relative" }}>
              {plan.badge && (
                <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#f5c842", borderRadius: 99, padding: "2px 10px", fontSize: 10, color: "#0d1117", fontWeight: 700, whiteSpace: "nowrap" }}>{plan.badge}</div>
              )}
              <div style={{ fontSize: 11, color: selectedPlan === plan.id ? "#00e5a0" : "#555", marginBottom: 4 }}>{plan.label}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: selectedPlan === plan.id ? "#fff" : "#666" }}>{plan.price}</div>
              <div style={{ fontSize: 11, color: "#555" }}>{plan.period}</div>
              {plan.savings && <div style={{ fontSize: 11, color: "#00e5a0", fontWeight: 600, marginTop: 4 }}>{plan.savings}</div>}
            </button>
          ))}
        </div>

        {/* Features */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>What you get</div>
          {features.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 0", borderBottom: i < features.length - 1 ? "1px solid #1a2030" : "none" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: f.pro ? "#0f2a1e" : "#1e2535", border: `1px solid ${f.pro ? "#00e5a030" : "#2a3244"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{f.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: f.pro ? "#fff" : "#666" }}>{f.title}</div>
                  {f.pro ? (
                    <span style={{ background: "#f5c84222", border: "1px solid #f5c84244", borderRadius: 99, padding: "1px 8px", fontSize: 10, color: "#f5c842" }}>Pro</span>
                  ) : (
                    <span style={{ background: "#1e2535", borderRadius: 99, padding: "1px 8px", fontSize: 10, color: "#555" }}>Free</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>{f.desc}</div>
                <div style={{ fontSize: 11, color: "#444", fontStyle: "italic" }}>"{f.example}"</div>
              </div>
              <div style={{ color: f.pro ? "#00e5a0" : "#2a3244", fontSize: 16, flexShrink: 0, marginTop: 4 }}>{f.pro ? "✓" : "✓"}</div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div style={{ background: "#161b26", border: "1px solid #1e2535", borderRadius: 16, padding: "16px 18px", marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: "#aaa", fontStyle: "italic", marginBottom: 10 }}>
            "The alert feature alone saved me 45 minutes at the DMV. I got pinged when it dropped to 8 min and walked right in."
          </div>
          <div style={{ fontSize: 12, color: "#555" }}>— Early beta user, New York</div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ position: "fixed", bottom: 70, left: 0, right: 0, padding: "12px 16px", background: "linear-gradient(to top, #0d1117 60%, transparent)", zIndex: 150 }}>
        <button onClick={handleUpgrade} style={{ width: "100%", background: "linear-gradient(135deg, #00e5a0, #00b87a)", border: "none", borderRadius: 16, padding: "16px", color: "#0d1117", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "'Syne', sans-serif", boxShadow: "0 8px 32px rgba(0,229,160,0.3)" }}>
          Start Free Trial → {selectedPlan === "yearly" ? "$3.99" : "$4.99"}/mo
        </button>
        <div style={{ textAlign: "center", fontSize: 11, color: "#444", marginTop: 8 }}>Cancel anytime · No hidden fees · 7-day free trial</div>
      </div>
    </div>
  );
}
