import { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);

const mockPlaces = [
  {
    place_id: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    name: "Shake Shack – Times Square",
    category: "Restaurant", icon: "🍔",
    current_popularity: 67,
    populartimes: [
      { name: "Sunday",    data: [0,0,0,0,0,0,20,35,50,60,70,75,80,72,65,55,45,35,25,15,5,0,0,0] },
      { name: "Monday",    data: [0,0,0,0,0,0,15,25,40,55,80,90,95,85,70,60,50,40,30,20,10,0,0,0] },
      { name: "Tuesday",   data: [0,0,0,0,0,0,15,25,40,55,78,88,92,82,68,58,48,38,28,18,8,0,0,0] },
      { name: "Wednesday", data: [0,0,0,0,0,0,18,28,45,60,82,92,96,86,72,62,52,42,32,22,12,0,0,0] },
      { name: "Thursday",  data: [0,0,0,0,0,0,18,30,48,62,85,95,98,88,74,64,54,44,34,24,14,0,0,0] },
      { name: "Friday",    data: [0,0,0,0,0,0,20,35,55,70,88,98,100,92,80,72,65,58,50,40,30,20,10,0] },
      { name: "Saturday",  data: [0,0,0,0,0,0,25,40,60,75,85,90,95,90,82,75,68,60,52,42,32,22,12,0] },
    ],
    time_spent: [30, 60], rating: 4.3,
  },
  {
    place_id: "ChIJaXQRs6lZwokRY6EFpJnhNNE",
    name: "Blue Bottle Coffee",
    category: "Cafe", icon: "☕",
    current_popularity: 34,
    populartimes: [
      { name: "Sunday",    data: [0,0,0,0,0,0,40,60,75,70,60,50,40,30,25,20,15,10,5,0,0,0,0,0] },
      { name: "Monday",    data: [0,0,0,0,0,0,55,80,90,75,60,50,40,30,25,20,15,10,5,0,0,0,0,0] },
      { name: "Tuesday",   data: [0,0,0,0,0,0,52,78,88,72,58,48,38,28,22,18,12,8,4,0,0,0,0,0] },
      { name: "Wednesday", data: [0,0,0,0,0,0,55,82,92,78,62,52,42,32,26,20,15,10,5,0,0,0,0,0] },
      { name: "Thursday",  data: [0,0,0,0,0,0,58,85,95,80,65,55,45,35,28,22,16,10,5,0,0,0,0,0] },
      { name: "Friday",    data: [0,0,0,0,0,0,60,88,96,82,68,58,48,38,30,24,18,12,6,0,0,0,0,0] },
      { name: "Saturday",  data: [0,0,0,0,0,0,45,65,78,72,62,52,42,35,28,22,16,10,5,0,0,0,0,0] },
    ],
    time_spent: [10, 30], rating: 4.6,
  },
  {
    place_id: "ChIJOwg_06VPwokRYv534QaPC8g",
    name: "DMV – Downtown Branch",
    category: "Government", icon: "🏛️",
    current_popularity: 88,
    populartimes: [
      { name: "Sunday",    data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
      { name: "Monday",    data: [0,0,0,0,0,0,0,0,80,95,90,85,80,75,70,65,55,40,0,0,0,0,0,0] },
      { name: "Tuesday",   data: [0,0,0,0,0,0,0,0,75,90,85,80,75,70,65,60,50,35,0,0,0,0,0,0] },
      { name: "Wednesday", data: [0,0,0,0,0,0,0,0,70,85,80,75,70,65,60,55,45,30,0,0,0,0,0,0] },
      { name: "Thursday",  data: [0,0,0,0,0,0,0,0,75,90,85,80,75,70,65,60,50,35,0,0,0,0,0,0] },
      { name: "Friday",    data: [0,0,0,0,0,0,0,0,85,98,95,90,85,80,75,70,60,45,0,0,0,0,0,0] },
      { name: "Saturday",  data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
    ],
    time_spent: [60, 120], rating: 2.1,
  },
];

const barColor = (val) => {
  if (val <= 33) return "#00e5a0";
  if (val <= 66) return "#f5c842";
  return "#ff5c5c";
};

const popularityToWait = (pop, cat) => {
  const m = { Restaurant: 0.45, Cafe: 0.25, Government: 0.9, Retail: 0.3 }[cat] || 0.4;
  return Math.round(pop * m);
};

const Heatmap = ({ data, category }) => {
  const today = new Date().getDay();
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 440 }}>
        <div style={{ display: "flex", marginLeft: 38, marginBottom: 4 }}>
          {HOURS.map(h => (
            <div key={h} style={{ flex: 1, textAlign: "center", fontSize: 8, color: "#444", fontFamily: "'DM Mono', monospace" }}>
              {h === 12 ? "12p" : h > 12 ? `${h-12}p` : `${h}a`}
            </div>
          ))}
        </div>
        {data.map((day, di) => (
          <div key={day.name} style={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <div style={{ width: 30, fontSize: 10, color: di === today ? "#00e5a0" : "#555", fontWeight: di === today ? 700 : 400, flexShrink: 0, fontFamily: "'DM Mono', monospace" }}>{DAYS[di]}</div>
            {HOURS.map(h => {
              const val = day.data[h] || 0;
              const wait = popularityToWait(val, category);
              return (
                <div key={h} title={val > 0 ? `~${wait}m wait` : "Closed"} style={{
                  flex: 1, height: 20, margin: "0 1px", borderRadius: 3,
                  background: val === 0 ? "#111" : `${barColor(val)}${Math.round(val * 2.2 + 30).toString(16).padStart(2,"0")}`,
                  border: di === today && h === new Date().getHours() ? "1px solid #fff" : "none",
                }} />
              );
            })}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, marginLeft: 38 }}>
          <span style={{ fontSize: 10, color: "#555" }}>Low</span>
          {[15,35,55,75,95].map(v => (
            <div key={v} style={{ width: 14, height: 8, borderRadius: 2, background: `${barColor(v)}${Math.round(v*2.2+30).toString(16).padStart(2,"0")}` }} />
          ))}
          <span style={{ fontSize: 10, color: "#555" }}>Busy</span>
        </div>
      </div>
    </div>
  );
};

const pipelineSteps = [
  { num: 1, title: "Get a Google Place ID", status: "done", desc: "Every business on Google Maps has a unique ID", code: `# Find it in the Google Maps URL:\n# maps.google.com → search → Share → copy link\n# Look for: place_id=ChIJ...\n\n# Or use the Places API:\nimport requests\nresp = requests.get(\n  "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",\n  params={"input": "Shake Shack Times Square",\n          "inputtype": "textquery",\n          "fields": "place_id,name",\n          "key": "YOUR_API_KEY"}\n)\nplace_id = resp.json()["candidates"][0]["place_id"]` },
  { num: 2, title: "Fetch Popular Times (Python)", status: "done", desc: "Use populartimes library to scrape Google", code: `# pip install populartimes\nimport populartimes\n\ndata = populartimes.get_id(\n  api_key="YOUR_GOOGLE_API_KEY",\n  place_id="ChIJN1t_tDeuEmsRUsoyG83frY4"\n)\n# Returns:\n# { "current_popularity": 67,\n#   "populartimes": [\n#     {"name": "Monday", "data": [0,0,...,90,...]}\n#   ]\n# }` },
  { num: 3, title: "Store & Refresh Every 30 Min", status: "active", desc: "Cache in Supabase, refresh on a schedule", code: `# Supabase table:\nCREATE TABLE popular_times (\n  place_id    TEXT PRIMARY KEY,\n  current_pop INT,\n  hourly_data JSONB,\n  fetched_at  TIMESTAMPTZ DEFAULT now()\n);\n\n# Railway cron job (every 30 min):\nimport schedule\ndef refresh():\n  for pid in TRACKED_PLACES:\n    data = populartimes.get_id(KEY, pid)\n    supabase.table("popular_times")\n      .upsert({"place_id": pid,\n               "current_pop": data["current_popularity"],\n               "hourly_data": data["populartimes"]})\n      .execute()\nschedule.every(30).minutes.do(refresh)` },
  { num: 4, title: "Blend with User Reports", status: "active", desc: "Weight fresh crowdsourced reports higher", code: `function getWait(placeId) {\n  const google = db.getGoogleData(placeId);\n  const reports = db.getRecentReports(placeId);\n  const googleWait = google.current_pop * 0.45;\n  if (!reports.length)\n    return { wait: googleWait, source: "google" };\n  const avg = reports.reduce((s,r) => s+r.wait,0)/reports.length;\n  const age = (Date.now()-reports[0].created_at)/60000;\n  const w = Math.max(0.3, 1-(age/120));\n  return { wait: Math.round(avg*w + googleWait*(1-w)),\n           source: "blended" };\n}` },
  { num: 5, title: "Expose via REST API", status: "pending", desc: "Your frontend calls this for live data", code: `# FastAPI (Python)\n@app.get("/api/locations/{place_id}/wait")\nasync def get_wait(place_id: str):\n  google = await fetch_popular_times(place_id)\n  reports = await fetch_recent_reports(place_id)\n  blended = blend_wait(google, reports)\n  return {\n    "wait_minutes": blended["wait"],\n    "current_popularity": google["current_pop"],\n    "source": blended["source"],\n    "updated_at": google["fetched_at"]\n  }` },
];

export default function PopularTimes() {
  const [selected, setSelected] = useState(mockPlaces[0]);
  const [view, setView] = useState("heatmap");
  const [openStep, setOpenStep] = useState(null);
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const pop = selected.populartimes[currentDay].data[currentHour] || 0;
  const wait = popularityToWait(pop, selected.category);
  const statusColors = { done: "#00e5a0", active: "#f5c842", pending: "#555" };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <div style={{ position: "sticky", top: 0, background: "#0d1117", borderBottom: "1px solid #1a2030", padding: "0 16px", height: 56, display: "flex", alignItems: "center", zIndex: 100 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16 }}>Queue<span style={{ color: "#00e5a0" }}>Cut</span> <span style={{ color: "#555", fontWeight: 400, fontSize: 13 }}>/ Data</span></span>
      </div>

      <div style={{ padding: "16px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[["heatmap","🗓 Heatmap"],["pipeline","🔧 Pipeline"]].map(([v,label]) => (
            <button key={v} onClick={() => setView(v)} style={{ background: view===v?"#00e5a0":"#161b26", border: view===v?"none":"1px solid #1e2535", borderRadius: 99, padding: "7px 16px", color: view===v?"#0d1117":"#888", fontWeight: view===v?700:400, fontSize: 13, cursor: "pointer" }}>{label}</button>
          ))}
        </div>

        {view === "heatmap" && (
          <>
            {/* Place selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {mockPlaces.map(p => {
                const isSel = selected.place_id === p.place_id;
                const pPop = p.populartimes[currentDay].data[currentHour] || 0;
                return (
                  <div key={p.place_id} onClick={() => setSelected(p)} style={{ background: isSel ? "#161b26" : "transparent", border: `1px solid ${isSel ? "#2a3244" : "#1a2030"}`, borderRadius: 14, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{p.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: isSel ? "#fff" : "#888" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>{p.category}</div>
                    </div>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: barColor(pPop) }}>
                      {pPop > 0 ? `${popularityToWait(pPop, p.category)}m` : "–"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Detail */}
            <div style={{ background: "#161b26", border: "1px solid #1e2535", borderRadius: 18, padding: "18px", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16 }}>{selected.name}</div>
                  <div style={{ fontSize: 10, color: "#444", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{selected.place_id}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: barColor(pop), lineHeight: 1 }}>{pop > 0 ? `${wait}m` : "–"}</div>
                  <div style={{ fontSize: 10, color: "#555" }}>now</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
                {[
                  { l: "Popularity", v: `${pop}%` },
                  { l: "Time Spent", v: `${selected.time_spent[0]}–${selected.time_spent[1]}m` },
                  { l: "Rating", v: `${selected.rating}★` },
                ].map(s => (
                  <div key={s.l} style={{ background: "#1e2535", borderRadius: 10, padding: "10px" }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 3 }}>{s.l}</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>{s.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 10 }}>Weekly Heatmap · <span style={{ color: "#00e5a0" }}>Google Popular Times</span></div>
              <Heatmap data={selected.populartimes} category={selected.category} />
            </div>
          </>
        )}

        {view === "pipeline" && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 4 }}>Data Pipeline</div>
              <div style={{ color: "#666", fontSize: 13 }}>Tap each step to see the code.</div>
            </div>
            {pipelineSteps.map(step => (
              <div key={step.num} style={{ border: `1px solid ${statusColors[step.status]}33`, borderRadius: 14, overflow: "hidden", marginBottom: 10 }}>
                <div onClick={() => setOpenStep(openStep === step.num ? null : step.num)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer", background: openStep === step.num ? "#161b26" : "transparent" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${statusColors[step.status]}22`, border: `1.5px solid ${statusColors[step.status]}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: statusColors[step.status], flexShrink: 0 }}>{step.num}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#fff" }}>{step.title}</div>
                    <div style={{ fontSize: 11, color: "#666", marginTop: 1 }}>{step.desc}</div>
                  </div>
                  <span style={{ fontSize: 12 }}>{openStep === step.num ? "▲" : "▼"}</span>
                </div>
                {openStep === step.num && (
                  <div style={{ background: "#0a0e16", borderTop: "1px solid #1a2030", padding: "14px 16px", fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#a8d8b0", lineHeight: 1.7, overflowX: "auto" }}>
                    <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{step.code}</pre>
                  </div>
                )}
              </div>
            ))}

            <div style={{ background: "#0f1e14", border: "1px solid #00e5a030", borderRadius: 14, padding: "16px", marginTop: 8 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 10 }}>💡 Recommended Stack</div>
              {[
                { layer: "Scraping", tool: "populartimes", note: "Free Python lib" },
                { layer: "Database", tool: "Supabase", note: "Free tier" },
                { layer: "Scheduler", tool: "Railway.app", note: "$5/mo" },
                { layer: "API", tool: "FastAPI", note: "Python" },
              ].map(r => (
                <div key={r.layer} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1a2030" }}>
                  <span style={{ fontSize: 12, color: "#666" }}>{r.layer}</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#00e5a0" }}>{r.tool}</div>
                    <div style={{ fontSize: 11, color: "#555" }}>{r.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
