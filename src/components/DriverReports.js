import { useState, useEffect, useCallback } from "react";

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

// Driver wait is different from dine-in:
// - Based on kitchen queue, not seating
// - Peak hours add significant time
// - High volume restaurants (lots of ratings) = longer driver waits
const estimateDriverWait = (rating, totalRatings, priceLevel) => {
  const hour = new Date().getHours();
  const isPeak = (hour >= 11 && hour <= 14) || (hour >= 17 && hour <= 21);
  let base = 5; // drivers often have shorter waits than dine-in
  if (totalRatings > 2000) base += 10; // very popular = high order volume
  else if (totalRatings > 500) base += 5;
  if (isPeak) base += 8; // lunch/dinner rush
  if (priceLevel >= 3) base += 4; // upscale = more complex orders
  if (rating >= 4.5) base += 5; // highly rated = very busy
  return Math.min(base + Math.floor(Math.random() * 6), 45);
};

const getDriverInsight = (wait, totalRatings) => {
  const hour = new Date().getHours();
  const isPeak = (hour >= 11 && hour <= 14) || (hour >= 17 && hour <= 21);
  if (wait <= 5) return "🟢 Quick pickup — order likely ready on arrival";
  if (wait <= 10 && !isPeak) return "🟡 Reasonable wait — off-peak hours";
  if (wait <= 10 && isPeak) return "🟠 Decent for peak hours";
  if (wait <= 20 && isPeak) return "🔴 Peak rush — expect a wait";
  if (totalRatings > 2000) return "🚨 Very high volume restaurant — plan ahead";
  return "🔴 Long wait — consider other nearby options";
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

// ── Restaurant Card (driver view) ──
const RestaurantCard = ({ place, onReport }) => {
  const wc = waitColor(place.driverWait);
  return (
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
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 3 }}>
            {place.name}
          </div>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>{place.address}</div>
          {place.distance && <div style={{ fontSize: 11, color: "#444" }}>📍 {place.distance}</div>}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: wc, lineHeight: 1 }}>
            {place.driverWait}<span style={{ fontSize: 12, color: "#555", fontWeight: 400 }}>m</span>
          </div>
          <div style={{ fontSize: 10, color: "#555" }}>driver wait</div>
        </div>
      </div>

      <div style={{ background: "#1e2535", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "#aaa" }}>
        {getDriverInsight(place.driverWait, place.totalRatings)}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {place.rating && <span style={{ fontSize: 11, color: "#f5c842" }}>⭐ {place.rating}</span>}
          {place.openNow && <span style={{ fontSize: 11, color: "#00e5a0" }}>● Open</span>}
          {place.totalRatings > 1000 && <span style={{ fontSize: 11, color: "#ff9500" }}>🔥 High volume</span>}
        </div>
        <button
          onClick={() => onReport(place)}
          style={{ background: "transparent", border: "1px solid #2a3244", borderRadius: 8, padding: "5px 12px", color: "#00e5a0", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
        >
          + Report
        </button>
      </div>

      {place.reports && place.reports.length > 0 && (
        <div style={{ borderTop: "1px solid #1e2535", paddingTop: 10 }}>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>Recent driver reports:</div>
          {place.reports.slice(0, 2).map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <PlatformBadge platform={r.platform} />
              <span style={{ fontSize: 12, color: waitColor(r.wait), fontWeight: 700 }}>{r.wait}m</span>
              <span style={{ fontSize: 11, color: "#444" }}>{r.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Driver Report Card ──
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
        <span style={{ fontSize: 11, color: "#00e5a0" }}>✓ Verified driver</span>
      )}
    </div>
  </div>
);

// ── Submit Modal with real restaurant search ──
const SubmitModal = ({ onClose, onSubmit, userLocation }) => {
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState(null);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [waitRange, setWaitRange] = useState(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Search restaurants via Google Places
  const searchRestaurants = useCallback(async (query) => {
    if (!query.trim() || query.length < 2) { setLocationResults([]); return; }
    setSearchLoading(true);
    try {
      const { Place } = await window.google.maps.importLibrary("places");
      const request = {
        textQuery: query,
        fields: ["id", "displayName", "formattedAddress", "location", "types"],
        maxResultCount: 5,
        ...(userLocation && { locationBias: { center: userLocation, radius: 8000 } }),
      };
      const { places } = await Place.searchByText(request);
      setLocationResults(places || []);
    } catch (err) {
      console.error("Restaurant search error:", err);
    }
    setSearchLoading(false);
  }, [userLocation]);

  useEffect(() => {
    if (selectedPlace) return; // don't search if already selected
    const timer = setTimeout(() => searchRestaurants(locationSearch), 400);
    return () => clearTimeout(timer);
  }, [locationSearch, searchRestaurants, selectedPlace]);

  const handleSubmit = () => {
    if (!platform || !selectedPlace || waitRange === null) return;
    setSubmitted(true);
    setTimeout(() => {
      onSubmit({
        platform,
        location: selectedPlace.displayName,
        address: selectedPlace.formattedAddress,
        wait: waitRange.value,
        note,
      });
    }, 1500);
  };

  const canProceed = (step === 1 && platform) ||
    (step === 2 && selectedPlace && waitRange !== null) ||
    step === 3;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 300, backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#111827", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "28px 24px 40px", border: "1px solid #1e2535", borderBottom: "none", maxHeight: "90vh", overflowY: "auto" }}>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#00e5a0", marginBottom: 8 }}>Report Submitted!</div>
            <div style={{ color: "#666", fontSize: 14 }}>Thanks for helping the driver community 🙌</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#fff" }}>Report Pickup Wait</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Step {step} of 3</div>
              </div>
              <button onClick={onClose} style={{ background: "#1e2535", border: "none", borderRadius: 8, width: 32, height: 32, color: "#666", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

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
                      <span style={{ fontSize: 18 }}>{p.emoji}</span>{p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Restaurant search + wait */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>Search for the restaurant</div>
                  {selectedPlace ? (
                    <div style={{ background: "#0f2a1e", border: "1px solid #00e5a040", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>{selectedPlace.displayName}</div>
                        <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{selectedPlace.formattedAddress}</div>
                      </div>
                      <button onClick={() => { setSelectedPlace(null); setLocationSearch(""); }} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16 }}>✕</button>
                    </div>
                  ) : (
                    <div style={{ position: "relative" }}>
                      <input
                        value={locationSearch}
                        onChange={e => setLocationSearch(e.target.value)}
                        placeholder="e.g. McDonald's, Chipotle..."
                        style={{ width: "100%", background: "#1e2535", border: "1px solid #2a3244", borderRadius: 12, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                      />
                      {searchLoading && <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#555" }}>...</div>}
                      {locationResults.length > 0 && (
                        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#1e2535", border: "1px solid #2a3244", borderRadius: 12, overflow: "hidden", zIndex: 10 }}>
                          {locationResults.map((place, i) => (
                            <button key={place.id || i} onClick={() => { setSelectedPlace(place); setLocationResults([]); }} style={{ width: "100%", background: "transparent", border: "none", borderBottom: i < locationResults.length - 1 ? "1px solid #2a3244" : "none", padding: "12px 14px", color: "#fff", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: 2 }}
                              onMouseEnter={e => e.currentTarget.style.background = "#2a3244"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                              <div style={{ fontSize: 13, fontWeight: 600 }}>{place.displayName}</div>
                              <div style={{ fontSize: 11, color: "#555" }}>{place.formattedAddress}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>How long did you wait for pickup?</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {waitRanges.map(r => (
                      <button key={r.value} onClick={() => setWaitRange(r)} style={{
                        background: waitRange?.value === r.value ? "#00e5a022" : "#1e2535",
                        border: `1.5px solid ${waitRange?.value === r.value ? "#00e5a0" : "#2a3244"}`,
                        borderRadius: 12, padding: "11px 12px",
                        color: waitRange?.value === r.value ? "#00e5a0" : "#888",
                        cursor: "pointer", fontSize: 12,
                        fontWeight: waitRange?.value === r.value ? 700 : 400,
                        display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s"
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
                  placeholder="e.g. Only 2 orders ahead, staff was quick, parking is tough..."
                  rows={4}
                  style={{ width: "100%", background: "#1e2535", border: "1px solid #2a3244", borderRadius: 12, padding: "12px 14px", color: "#fff", fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }}
                />
                <div style={{ background: "#0f2a1e", border: "1px solid #00e5a030", borderRadius: 12, padding: "12px 14px", marginTop: 12 }}>
                  <div style={{ fontSize: 12, color: "#00e5a0", fontWeight: 600, marginBottom: 6 }}>📍 Summary</div>
                  <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>{selectedPlace?.displayName}</div>
                  <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>{selectedPlace?.formattedAddress}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <PlatformBadge platform={platform} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: waitColor(waitRange?.value || 0) }}>{waitRange?.label}</span>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, background: "transparent", border: "1px solid #2a3244", borderRadius: 12, padding: 14, color: "#888", cursor: "pointer", fontSize: 14 }}>← Back</button>
              )}
              <button
                onClick={() => step < 3 ? setStep(s => s + 1) : handleSubmit()}
                disabled={!canProceed}
                style={{
                  flex: 2, background: canProceed ? "#00e5a0" : "#1e2535",
                  border: "none", borderRadius: 12, padding: 14,
                  color: canProceed ? "#0d1117" : "#555",
                  fontWeight: 700, cursor: canProceed ? "pointer" : "default", fontSize: 14, transition: "all 0.15s"
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

// ── Main Drivers Page ──
export default function DriverReports() {
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [driverReports, setDriverReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [activeTab, setActiveTab] = useState("nearby"); // "nearby" | "reports"
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const loadGoogleScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.google && window.google.maps) { resolve(); return; }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places&v=beta`;
      script.async = true;
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }, []);

  const fetchNearbyRestaurants = useCallback(async (lat, lng) => {
    setLoading(true);
    setLocationError(null);
    try {
      await loadGoogleScript();
      const { Place } = await window.google.maps.importLibrary("places");

      const { places } = await Place.searchNearby({
        fields: ["id", "displayName", "location", "types", "rating", "userRatingCount",
                 "priceLevel", "formattedAddress", "regularOpeningHours", "businessStatus"],
        locationRestriction: { center: { lat, lng }, radius: 2000 },
        includedTypes: ["restaurant", "cafe", "fast_food_restaurant", "meal_takeaway", "bakery"],
        maxResultCount: 20,
      });

      if (places && places.length > 0) {
        const mapped = places.map((p, i) => {
          const totalRatings = p.userRatingCount || 100;
          const driverWait = estimateDriverWait(p.rating || 3.5, totalRatings, p.priceLevel || 1);
          const distMeters = p.location ? Math.sqrt(
            Math.pow((p.location.lat() - lat) * 111000, 2) +
            Math.pow((p.location.lng() - lng) * 111000, 2)
          ) : 0;
          return {
            id: p.id,
            name: p.displayName || "Unknown",
            address: p.formattedAddress || "",
            distance: distMeters ? `${(distMeters / 1609).toFixed(1)} mi away` : null,
            rating: p.rating,
            totalRatings,
            openNow: p.regularOpeningHours?.isOpen?.() || p.businessStatus === "OPERATIONAL" || false,
            driverWait,
            reports: [],
          };
        });
        // Sort by driver wait time (shortest first — most useful for drivers)
        mapped.sort((a, b) => a.driverWait - b.driverWait);
        setNearbyRestaurants(mapped);
      } else {
        setLocationError("No restaurants found nearby.");
      }
    } catch (err) {
      console.error("fetchNearbyRestaurants error:", err);
      setLocationError("Couldn't load nearby restaurants.");
    }
    setLoading(false);
  }, [loadGoogleScript]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Location not supported on this device.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLocation({ lat, lng });
        fetchNearbyRestaurants(lat, lng);
      },
      () => {
        setLocationError("Location access denied. Enable location to see nearby restaurants.");
        setLoading(false);
      }
    );
  }, [fetchNearbyRestaurants]);

  const handleReport = (place) => {
    setShowModal(true);
  };

  const handleSubmit = ({ platform, location, address, wait, note }) => {
    const p = platforms.find(p => p.id === platform);
    const newReport = {
      id: Date.now(), platform, location, address, wait, note,
      time: "just now", verified: false,
    };
    setDriverReports(prev => [newReport, ...prev]);

    // Also update the restaurant's reports if it matches
    setNearbyRestaurants(prev => prev.map(r =>
      r.name === location
        ? { ...r, reports: [{ platform, wait, time: "just now" }, ...r.reports] }
        : r
    ));

    setShowModal(false);
    showToast(`✓ Report added for ${p?.label}!`);
  };

  const filteredReports = filterPlatform === "all"
    ? driverReports
    : driverReports.filter(r => r.platform === filterPlatform);

  const avgWait = nearbyRestaurants.length
    ? Math.round(nearbyRestaurants.reduce((s, r) => s + r.driverWait, 0) / nearbyRestaurants.length)
    : 0;
  const fastPickups = nearbyRestaurants.filter(r => r.driverWait <= 8).length;
  const hour = new Date().getHours();
  const isPeak = (hour >= 11 && hour <= 14) || (hour >= 17 && hour <= 21);

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
        <button onClick={() => setShowModal(true)} style={{ background: "#00e5a0", border: "none", borderRadius: 10, padding: "8px 16px", color: "#0d1117", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
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
              <div style={{ fontSize: 12, color: isPeak ? "#ff9500" : "#666" }}>
                {isPeak ? "⚠️ Peak hours — expect longer waits" : "Off-peak — generally quick pickups"}
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Avg Driver Wait", value: loading ? "..." : `${avgWait}m`, icon: "⏱" },
              { label: "Fast Pickups", value: loading ? "..." : fastPickups, icon: "⚡" },
              { label: "Nearby Spots", value: loading ? "..." : nearbyRestaurants.length, icon: "📍" },
            ].map(s => (
              <div key={s.label} style={{ background: "#0d1117", borderRadius: 12, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 16, marginBottom: 2 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#555" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[{ id: "nearby", label: "📍 Nearby Restaurants" }, { id: "reports", label: "📣 Driver Reports" }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, background: activeTab === tab.id ? "#00e5a0" : "#161b26",
              border: activeTab === tab.id ? "none" : "1px solid #1e2535",
              borderRadius: 10, padding: "10px", fontSize: 12, fontWeight: activeTab === tab.id ? 700 : 400,
              color: activeTab === tab.id ? "#0d1117" : "#888", cursor: "pointer"
            }}>{tab.label}</button>
          ))}
        </div>

        {/* Nearby Restaurants Tab */}
        {activeTab === "nearby" && (
          <>
            {loading && (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🛵</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 6 }}>Finding restaurants near you...</div>
                <div style={{ fontSize: 13, color: "#555" }}>Calculating driver wait times</div>
              </div>
            )}

            {locationError && !loading && (
              <div style={{ background: "#1e1a14", border: "1px solid #ff5c5c33", borderRadius: 16, padding: "20px", textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>📍</div>
                <div style={{ fontSize: 14, color: "#ff5c5c", fontWeight: 600, marginBottom: 6 }}>Location Required</div>
                <div style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>{locationError}</div>
                <button onClick={() => window.location.reload()} style={{ background: "#00e5a0", border: "none", borderRadius: 10, padding: "10px 20px", color: "#0d1117", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Try Again</button>
              </div>
            )}

            {!loading && nearbyRestaurants.length > 0 && (
              <>
                <div style={{ background: "#161b26", border: "1px solid #1e2535", borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>💡</span>
                  <span style={{ fontSize: 12, color: "#666" }}>Sorted by <span style={{ color: "#00e5a0" }}>shortest driver wait</span> first. Tap + Report to share your experience.</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {nearbyRestaurants.map(place => (
                    <RestaurantCard key={place.id} place={place} onReport={handleReport} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Driver Reports Tab */}
        {activeTab === "reports" && (
          <>
            {/* Platform filter */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
              <button onClick={() => setFilterPlatform("all")} style={{ background: filterPlatform === "all" ? "#00e5a0" : "#161b26", border: filterPlatform === "all" ? "none" : "1px solid #1e2535", borderRadius: 99, padding: "7px 16px", color: filterPlatform === "all" ? "#0d1117" : "#888", fontWeight: filterPlatform === "all" ? 700 : 400, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>All Platforms</button>
              {platforms.map(p => (
                <button key={p.id} onClick={() => setFilterPlatform(p.id)} style={{ background: filterPlatform === p.id ? `${p.color}22` : "#161b26", border: `1px solid ${filterPlatform === p.id ? p.color : "#1e2535"}`, borderRadius: 99, padding: "7px 16px", color: filterPlatform === p.id ? p.color : "#888", fontWeight: filterPlatform === p.id ? 700 : 400, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
                  {p.emoji} {p.label}
                </button>
              ))}
            </div>

            {filteredReports.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📣</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 6 }}>No reports yet</div>
                <div style={{ fontSize: 13, color: "#555", marginBottom: 20 }}>Be the first to report a pickup wait!</div>
                <button onClick={() => setShowModal(true)} style={{ background: "#00e5a0", border: "none", borderRadius: 10, padding: "10px 20px", color: "#0d1117", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Report Wait</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredReports.map(r => <ReportCard key={r.id} report={r} />)}
              </div>
            )}
          </>
        )}

        {/* How it works */}
        <div style={{ background: "#161b26", border: "1px solid #1e2535", borderRadius: 16, padding: "16px 18px", margin: "20px 0" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>💡 How driver waits are calculated</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { icon: "⏱", text: "Based on restaurant volume, ratings, and time of day" },
              { icon: "🔥", text: "High-volume spots (1000+ reviews) get longer estimates" },
              { icon: "🕐", text: "Peak hours (11am–2pm, 5pm–9pm) add extra time" },
              { icon: "📣", text: "Driver reports update estimates in real time" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: 13, color: "#888" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && <SubmitModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} userLocation={userLocation} />}

      {toast && (
        <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#00e5a0", color: "#0d1117", borderRadius: 12, padding: "12px 20px", fontWeight: 600, fontSize: 13, zIndex: 400, whiteSpace: "nowrap" }}>{toast}</div>
      )}

      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 0; height: 0; } textarea::placeholder, input::placeholder { color: #555; }`}</style>
    </div>
  );
}
