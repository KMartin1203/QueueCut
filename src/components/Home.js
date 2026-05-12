import { useState, useEffect, useCallback } from "react";

const categories = ["All", "Food", "Government", "Retail", "Healthcare", "Grocery"];

const iconMap = {
  Food: "🍔", Grocery: "🛒", Healthcare: "🏥",
  Retail: "🛍️", Government: "🏛️", Other: "📍",
};

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

const estimateWait = (rating, totalRatings, priceLevel) => {
  let base = 8;
  if (rating >= 4.5) base += 20;
  else if (rating >= 4.0) base += 12;
  if (totalRatings > 1000) base += 8;
  if (priceLevel >= 3) base += 10;
  return Math.min(base + Math.floor(Math.random() * 8), 75);
};

const getCategory = (types = []) => {
  const map = {
    restaurant: "Food", cafe: "Food", bar: "Food", bakery: "Food",
    meal_takeaway: "Food", meal_delivery: "Food", food: "Food",
    grocery_or_supermarket: "Grocery", supermarket: "Grocery",
    hospital: "Healthcare", pharmacy: "Healthcare", doctor: "Healthcare", drugstore: "Healthcare",
    store: "Retail", shopping_mall: "Retail", clothing_store: "Retail", electronics_store: "Retail",
    local_government_office: "Government", post_office: "Government", city_hall: "Government",
  };
  for (const t of types) if (map[t]) return map[t];
  return "Other";
};

// ── Wait Type Modal ──
const WaitTypeModal = ({ location, onClose, onReport }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState(null);
  const [partySize, setPartySize] = useState(null);
  const isFood = location.category === "Food";
  const base = location.wait;
  const dineInWaits = { 1: Math.round(base*0.8), 2: base, 3: Math.round(base*1.3), 4: Math.round(base*1.6), 5: Math.round(base*2), 6: Math.round(base*2.4) };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:300, backdropFilter:"blur(6px)" }}>
      <div style={{ background:"#111827", borderRadius:"24px 24px 0 0", width:"100%", maxWidth:480, padding:"28px 24px 44px", border:"1px solid #1e2535", borderBottom:"none" }}>
        <div style={{ width:40, height:4, background:"#2a3244", borderRadius:99, margin:"0 auto 24px" }} />
        {step === 1 && (
          <>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:"#fff", marginBottom:4 }}>{location.name}</div>
            <div style={{ fontSize:13, color:"#555", marginBottom:20 }}>How are you visiting?</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
              {isFood && (
                <button onClick={() => setType("dinein")} style={{ background:type==="dinein"?"#00e5a022":"#1e2535", border:`2px solid ${type==="dinein"?"#00e5a0":"#2a3244"}`, borderRadius:16, padding:"18px 20px", cursor:"pointer", display:"flex", alignItems:"center", gap:14, textAlign:"left" }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:"#161b26", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🪑</div>
                  <div><div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:type==="dinein"?"#00e5a0":"#fff" }}>Dine In</div><div style={{ fontSize:12, color:"#666", marginTop:2 }}>Get wait time for your party size</div></div>
                  {type==="dinein" && <span style={{ marginLeft:"auto", color:"#00e5a0", fontSize:18 }}>✓</span>}
                </button>
              )}
              <button onClick={() => setType("pickup")} style={{ background:type==="pickup"?"#00e5a022":"#1e2535", border:`2px solid ${type==="pickup"?"#00e5a0":"#2a3244"}`, borderRadius:16, padding:"18px 20px", cursor:"pointer", display:"flex", alignItems:"center", gap:14, textAlign:"left" }}>
                <div style={{ width:44, height:44, borderRadius:12, background:"#161b26", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🥡</div>
                <div><div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:type==="pickup"?"#00e5a0":"#fff" }}>Pickup / Takeout</div><div style={{ fontSize:12, color:"#666", marginTop:2 }}>Order ready wait time</div></div>
                {type==="pickup" && <span style={{ marginLeft:"auto", color:"#00e5a0", fontSize:18 }}>✓</span>}
              </button>
              <button onClick={() => setType("delivery")} style={{ background:type==="delivery"?"#00e5a022":"#1e2535", border:`2px solid ${type==="delivery"?"#00e5a0":"#2a3244"}`, borderRadius:16, padding:"18px 20px", cursor:"pointer", display:"flex", alignItems:"center", gap:14, textAlign:"left" }}>
                <div style={{ width:44, height:44, borderRadius:12, background:"#161b26", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🛵</div>
                <div><div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:type==="delivery"?"#00e5a0":"#fff" }}>Delivery Driver</div><div style={{ fontSize:12, color:"#666", marginTop:2 }}>Driver pickup wait time</div></div>
                {type==="delivery" && <span style={{ marginLeft:"auto", color:"#00e5a0", fontSize:18 }}>✓</span>}
              </button>
            </div>
            {(type==="pickup"||type==="delivery") && (
              <div style={{ background:"#0f2a1e", border:"1px solid #00e5a030", borderRadius:14, padding:"14px 16px", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ fontSize:12, color:"#666" }}>Estimated wait</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:32, color:waitColor(base).text }}>{base}<span style={{ fontSize:13, color:"#555", fontWeight:400 }}>m</span></div>
              </div>
            )}
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={onClose} style={{ flex:1, background:"transparent", border:"1px solid #2a3244", borderRadius:12, padding:14, color:"#888", cursor:"pointer", fontSize:14 }}>Cancel</button>
              <button onClick={() => type==="dinein"?setStep(2):onReport({type,partySize})} disabled={!type} style={{ flex:2, background:type?"#00e5a0":"#1e2535", border:"none", borderRadius:12, padding:14, color:type?"#0d1117":"#555", fontWeight:700, cursor:type?"pointer":"default", fontSize:14 }}>
                {type==="dinein"?"Select Party Size →":"See Wait Time →"}
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:"#fff", marginBottom:4 }}>Party Size</div>
            <div style={{ fontSize:13, color:"#555", marginBottom:16 }}>How many people are dining?</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
              {[1,2,3,4,5,6].map(size => {
                const sw = dineInWaits[size];
                const isSel = partySize===size;
                return (
                  <button key={size} onClick={() => setPartySize(size)} style={{ background:isSel?"#00e5a022":"#1e2535", border:`2px solid ${isSel?"#00e5a0":"#2a3244"}`, borderRadius:14, padding:"14px 10px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                    <div style={{ fontSize:22 }}>{size===1?"🧑":size===2?"👫":size<=4?"👨‍👩‍👧":"👨‍👩‍👧‍👦"}</div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:isSel?"#00e5a0":"#fff" }}>{size===6?"6+":size}</div>
                    <div style={{ fontSize:11, color:waitColor(sw).text, fontWeight:600 }}>{sw}m</div>
                  </button>
                );
              })}
            </div>
            {partySize && (
              <div style={{ background:"#0f2a1e", border:"1px solid #00e5a030", borderRadius:14, padding:"16px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div><div style={{ fontSize:13, color:"#00e5a0", fontWeight:600 }}>🪑 Table for {partySize}</div><div style={{ fontSize:12, color:"#555", marginTop:2 }}>Estimated wait</div></div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:36, color:waitColor(dineInWaits[partySize]).text }}>{dineInWaits[partySize]}<span style={{ fontSize:14, color:"#555", fontWeight:400 }}>m</span></div>
              </div>
            )}
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setStep(1)} style={{ flex:1, background:"transparent", border:"1px solid #2a3244", borderRadius:12, padding:14, color:"#888", cursor:"pointer", fontSize:14 }}>← Back</button>
              <button onClick={() => partySize&&onReport({type,partySize})} disabled={!partySize} style={{ flex:2, background:partySize?"#00e5a0":"#1e2535", border:"none", borderRadius:12, padding:14, color:partySize?"#0d1117":"#555", fontWeight:700, cursor:partySize?"pointer":"default", fontSize:14 }}>Got it ✓</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ── Report Modal ──
const ReportModal = ({ location, onClose, onSubmit }) => {
  const [selected, setSelected] = useState(null);
  const options = ["Under 5 min","5–15 min","15–30 min","30–60 min","60+ min"];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300, backdropFilter:"blur(4px)", padding:"0 16px" }}>
      <div style={{ background:"#161b26", border:"1px solid #2a3244", borderRadius:20, padding:"28px 24px", width:"100%", maxWidth:360 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"#fff", marginBottom:4 }}>Report Wait Time</div>
        <div style={{ color:"#666", fontSize:13, marginBottom:20 }}>{location.name}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
          {options.map(opt => (
            <button key={opt} onClick={() => setSelected(opt)} style={{ background:selected===opt?"#00e5a0":"#1e2535", border:selected===opt?"none":"1px solid #2a3244", borderRadius:10, padding:"12px 16px", color:selected===opt?"#0d1117":"#ccc", fontWeight:selected===opt?700:400, cursor:"pointer", fontSize:14, textAlign:"left" }}>{opt}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, background:"transparent", border:"1px solid #2a3244", borderRadius:10, padding:12, color:"#888", cursor:"pointer", fontSize:13 }}>Cancel</button>
          <button onClick={() => selected&&onSubmit(selected)} style={{ flex:2, background:selected?"#00e5a0":"#1e2535", border:"none", borderRadius:10, padding:12, color:selected?"#0d1117":"#555", fontWeight:700, cursor:selected?"pointer":"default", fontSize:13 }}>Submit</button>
        </div>
      </div>
    </div>
  );
};

// ── Location Card ──
const LocationCard = ({ loc, onReport, onTap }) => {
  const wc = waitColor(loc.wait);
  return (
    <div onClick={() => onTap(loc)} style={{ background:"#161b26", border:"1px solid #1e2a3a", borderRadius:18, padding:"18px 20px", display:"flex", flexDirection:"column", gap:12, cursor:"pointer", transition:"transform 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform=""}
    >
      <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
        <div style={{ width:44, height:44, borderRadius:12, background:"#1e2535", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{iconMap[loc.category]||"📍"}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"#fff", lineHeight:1.3 }}>{loc.name}</div>
          <div style={{ color:"#555", fontSize:12, marginTop:2 }}>{loc.address}</div>
          {loc.distance && <div style={{ color:"#444", fontSize:11, marginTop:2 }}>📍 {loc.distance}</div>}
          {loc.category==="Food" && (
            <div style={{ display:"flex", gap:6, marginTop:5 }}>
              <span style={{ background:"#1e3a2a", border:"1px solid #00e5a030", borderRadius:99, padding:"2px 8px", fontSize:10, color:"#00e5a0" }}>🪑 Dine In</span>
              <span style={{ background:"#1e2535", border:"1px solid #2a3244", borderRadius:99, padding:"2px 8px", fontSize:10, color:"#888" }}>🥡 Takeout</span>
            </div>
          )}
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:26, color:wc.text, lineHeight:1 }}>{loc.wait}<span style={{ fontSize:12, fontWeight:400, color:"#666" }}>m</span></div>
          <div style={{ fontSize:10, color:"#444", marginTop:2 }}>est. wait</div>
        </div>
      </div>
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
          <span style={{ fontSize:11, color:"#555" }}>Popularity</span>
          <span style={{ fontSize:11, color:wc.text }}>{loc.popularity}%</span>
        </div>
        <div style={{ height:4, background:"#1e2535", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${loc.popularity}%`, background:wc.bar, borderRadius:99 }} />
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
        {loc.rating && <span style={{ background:"#1e2535", border:"1px solid #2a3244", borderRadius:99, padding:"2px 8px", fontSize:10, color:"#f5c842" }}>⭐ {loc.rating}</span>}
        {loc.openNow && <span style={{ background:"#1e3a2a", border:"1px solid #00e5a030", borderRadius:99, padding:"2px 8px", fontSize:10, color:"#00e5a0" }}>Open Now</span>}
        <span style={{ marginLeft:"auto" }}><TrendIcon trend={loc.trend}/></span>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid #1e2535", paddingTop:10 }}>
        <span style={{ fontSize:11, color:"#444" }}>{loc.reports} reports</span>
        <button onClick={e => { e.stopPropagation(); onReport(loc); }} style={{ background:"transparent", border:"1px solid #2a3244", borderRadius:8, padding:"5px 12px", color:"#00e5a0", fontSize:12, cursor:"pointer", fontWeight:600 }}>+ Report</button>
      </div>
    </div>
  );
};

// ── Main Home ──
export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);
  const [waitTypeTarget, setWaitTypeTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  const loadGoogleScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.google && window.google.maps) { resolve(); return; }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }, []);

  const fetchNearbyPlaces = useCallback(async (lat, lng) => {
    setLoading(true);
    try {
      await loadGoogleScript();
      const service = new window.google.maps.places.PlacesService(document.createElement("div"));
      const request = {
        location: new window.google.maps.LatLng(lat, lng),
        radius: 1500,
        type: ["restaurant", "cafe", "store", "hospital", "local_government_office", "grocery_or_supermarket"],
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const trends = ["up", "down", "stable"];
          const mapped = results.slice(0, 20).map((p, i) => {
            const category = getCategory(p.types);
            const wait = estimateWait(p.rating || 3.5, p.user_ratings_total || 100, p.price_level || 1);
            const distMeters = Math.sqrt(
              Math.pow((p.geometry.location.lat() - lat) * 111000, 2) +
              Math.pow((p.geometry.location.lng() - lng) * 111000, 2)
            );
            const distMiles = (distMeters / 1609).toFixed(1);
            return {
              id: p.place_id,
              name: p.name,
              category,
              address: p.vicinity,
              distance: `${distMiles} mi away`,
              wait,
              popularity: Math.min(Math.round((wait / 75) * 100), 100),
              trend: trends[i % 3],
              rating: p.rating,
              openNow: p.opening_hours?.isOpen?.() || false,
              reports: Math.floor(Math.random() * 30) + 1,
            };
          });
          setLocations(mapped);
        } else {
          setLocationError("Couldn't load nearby places. Please try again.");
        }
        setLoading(false);
      });
    } catch (err) {
      setLocationError("Something went wrong loading places.");
      setLoading(false);
    }
  }, [loadGoogleScript]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Location not supported on this device.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        fetchNearbyPlaces(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLocationError("Location access denied. Please enable location to see nearby places.");
        setLoading(false);
      }
    );
  }, [fetchNearbyPlaces]);

  const filtered = locations
    .filter(l => activeCategory === "All" || l.category === activeCategory)
    .filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = (range) => {
    const minuteMap = { "Under 5 min":3, "5–15 min":10, "15–30 min":22, "30–60 min":45, "60+ min":70 };
    setLocations(prev => prev.map(l => l.id===reportTarget.id ? {...l, wait:minuteMap[range], reports:l.reports+1} : l));
    setReportTarget(null);
    showToast("Thanks! Your report helps everyone 🙌");
  };

  const handleWaitType = ({ type, partySize }) => {
    const loc = waitTypeTarget;
    setWaitTypeTarget(null);
    const multipliers = { 1:0.8, 2:1, 3:1.3, 4:1.6, 5:2, 6:2.4 };
    if (type==="dinein"&&partySize) showToast(`🪑 Table for ${partySize}: ~${Math.round(loc.wait*multipliers[partySize])} min wait`);
    else if (type==="pickup") showToast(`🥡 Pickup wait: ~${loc.wait} min`);
    else if (type==="delivery") showToast(`🛵 Driver pickup: ~${loc.wait} min`);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0d1117", fontFamily:"'DM Sans',sans-serif", color:"#fff" }}>
      <div style={{ position:"sticky", top:0, background:"#0d1117", borderBottom:"1px solid #1a2030", padding:"0 16px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <img src="/logo.png" alt="QueueCut Logo" style={{ width:38, height:38, objectFit:"contain" }} />
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, letterSpacing:-0.5 }}>Queue<span style={{ color:"#00e5a0" }}>Cut</span></span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:"#00e5a0", boxShadow:"0 0 6px #00e5a0" }} />
          <span style={{ fontSize:12, color:"#555" }}>Live</span>
        </div>
      </div>

      <div style={{ padding:"20px 16px 0" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ display:"inline-block", background:"#00e5a015", border:"1px solid #00e5a030", borderRadius:99, padding:"3px 12px", fontSize:11, color:"#00e5a0", marginBottom:12 }}>
            {userLocation ? "📍 Using your location" : "📍 QueueCut"}
          </div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, lineHeight:1.2, letterSpacing:-0.5, margin:0 }}>
            Check the line.<br /><span style={{ color:"#00e5a0" }}>Save the time.</span>
          </h1>
        </div>

        {!loading && locations.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
            {[
              { label:"Avg Wait", value:`${Math.round(locations.reduce((s,l)=>s+l.wait,0)/locations.length)}m`, icon:"⏱" },
              { label:"Short Waits", value:`${locations.filter(l=>l.wait<=10).length} spots`, icon:"✅" },
              { label:"Nearby", value:`${locations.length} spots`, icon:"📍" },
            ].map(s => (
              <div key={s.label} style={{ background:"#161b26", border:"1px solid #1e2535", borderRadius:14, padding:"12px 10px", textAlign:"center" }}>
                <div style={{ fontSize:18, marginBottom:3 }}>{s.icon}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:17 }}>{s.value}</div>
                <div style={{ fontSize:10, color:"#555", marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ position:"relative", marginBottom:14 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#555" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search nearby locations..." style={{ width:"100%", background:"#161b26", border:"1px solid #1e2535", borderRadius:12, padding:"11px 14px 11px 34px", color:"#fff", fontSize:14, outline:"none" }} />
        </div>

        <div style={{ display:"flex", gap:8, overflowX:"auto", marginBottom:16, paddingBottom:4 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background:activeCategory===cat?"#00e5a0":"#161b26", border:activeCategory===cat?"none":"1px solid #1e2535", borderRadius:99, padding:"6px 14px", color:activeCategory===cat?"#0d1117":"#888", fontWeight:activeCategory===cat?700:400, fontSize:12, cursor:"pointer", whiteSpace:"nowrap" }}>{cat}</button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign:"center", padding:"48px 0" }}>
            <div style={{ fontSize:36, marginBottom:12 }}>📍</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:"#fff", marginBottom:6 }}>Finding places near you...</div>
            <div style={{ fontSize:13, color:"#555" }}>Allow location access when prompted</div>
          </div>
        )}

        {locationError && !loading && (
          <div style={{ background:"#1e1a14", border:"1px solid #ff5c5c33", borderRadius:16, padding:"20px", textAlign:"center", marginBottom:20 }}>
            <div style={{ fontSize:32, marginBottom:10 }}>📍</div>
            <div style={{ fontSize:14, color:"#ff5c5c", fontWeight:600, marginBottom:6 }}>Location Required</div>
            <div style={{ fontSize:13, color:"#666", marginBottom:16 }}>{locationError}</div>
            <button onClick={() => window.location.reload()} style={{ background:"#00e5a0", border:"none", borderRadius:10, padding:"10px 20px", color:"#0d1117", fontWeight:700, fontSize:13, cursor:"pointer" }}>Try Again</button>
          </div>
        )}

        {!loading && locations.length > 0 && (
          <div style={{ background:"#0f1e14", border:"1px solid #00e5a020", borderRadius:12, padding:"10px 14px", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:14 }}>💡</span>
            <span style={{ fontSize:12, color:"#666" }}>Tap a location to see wait times by <span style={{ color:"#00e5a0" }}>party size</span> or <span style={{ color:"#00e5a0" }}>pickup type</span></span>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {filtered.map(loc => (
            <LocationCard key={loc.id} loc={loc} onReport={e => setReportTarget(e)} onTap={loc => setWaitTypeTarget(loc)} />
          ))}
        </div>

        {!loading && (
          <div style={{ marginTop:24, background:"linear-gradient(135deg,#0f2a1e,#0d1a2e)", border:"1px solid #00e5a030", borderRadius:18, padding:"20px" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, marginBottom:6 }}>⚡ QueueCut Pro</div>
            <div style={{ color:"#777", fontSize:13, marginBottom:14 }}>Alerts before crowds form. Trends + history.</div>
            <button style={{ background:"#00e5a0", border:"none", borderRadius:10, padding:"10px 20px", color:"#0d1117", fontWeight:700, fontSize:13, cursor:"pointer" }}>Try Free → $4.99/mo</button>
          </div>
        )}
      </div>

      {reportTarget && <ReportModal location={reportTarget} onClose={() => setReportTarget(null)} onSubmit={handleSubmit} />}
      {waitTypeTarget && <WaitTypeModal location={waitTypeTarget} onClose={() => setWaitTypeTarget(null)} onReport={handleWaitType} />}

      {toast && (
        <div style={{ position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)", background:"#00e5a0", color:"#0d1117", borderRadius:12, padding:"12px 20px", fontWeight:600, fontSize:13, zIndex:400, whiteSpace:"nowrap", maxWidth:"90vw", textAlign:"center" }}>{toast}</div>
      )}

      <style>{`* { box-sizing:border-box; } ::-webkit-scrollbar { width:0; height:0; } input::placeholder { color:#555; }`}</style>
    </div>
  );
}