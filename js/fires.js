/* Fire layers on the satellite map.
   Live data: NIFC (National Interagency Fire Center) public wildfire perimeters.
   Always works: a short hand-picked list of famous past fires. */
(function () {
  const map = window.OHEMap;
  const panel = document.getElementById("fire-panel");
  if (!map || !panel || typeof L === "undefined") return;

  const BASE = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/";
  const ENVELOPE = "-121,32.3,-114,35.9"; // Southern California box: west, south, east, north
  const MIN_RECENT_ACRES = 100;
  const OFFICIAL = "https://www.fire.ca.gov/incidents";
  const RECENT_DAYS = 14; // "recent" = reported in the last two weeks
  const SOCAL_COUNTIES = ["imperial", "kern", "los angeles", "orange", "riverside", "san bernardino", "san diego", "san luis obispo", "santa barbara", "ventura"];

  const COLORS = {
    active: { stroke: "#FF3B1F", fill: "#FF7A1A" },
    recent: { stroke: "#FFD23F", fill: "#E8A33A" },
    old: { stroke: "#E9A8FF", fill: "#B070D0" }
  };

  const groups = {
    active: L.layerGroup().addTo(map),
    recent: L.layerGroup().addTo(map),
    old: L.layerGroup().addTo(map)
  };
  const statusEl = document.getElementById("fire-status");
  const refreshBtn = document.getElementById("fire-refresh");
  let lastClicked = null;

  /* ---------- famous past fires (approximate places, rounded sizes) ---------- */
  const OLD_FIRES = [
    { name: "Getty Fire", year: 2019, ll: [34.09, -118.48], acres: "about 745", text: "Started near the Getty Center in Los Angeles. It burned a small but important wild area right next to neighborhoods." },
    { name: "Woolsey Fire", year: 2018, ll: [34.12, -118.78], acres: "about 97,000", text: "Burned from near Simi Valley to the Malibu coast and much of the Santa Monica Mountains. Scientists have been watching how nature grows back." },
    { name: "Palisades Fire", year: 2025, ll: [34.07, -118.55], acres: "about 23,000", text: "Burned Pacific Palisades and wild hills in January 2025. Many families lost their homes. Be kind to friends who were affected." },
    { name: "Eaton Fire", year: 2025, ll: [34.19, -118.10], acres: "about 14,000", text: "Burned near Altadena and the San Gabriel foothills in January 2025. Many families lost their homes. Be kind to friends who were affected." },
    { name: "Griffith Park Fire", year: 2007, ll: [34.13, -118.30], acres: "about 800", text: "Burned part of Griffith Park, a big wild area inside the city. Plants and animals there have been regrowing since." },
    { name: "Station Fire", year: 2009, ll: [34.33, -118.17], acres: "about 160,000", text: "One of the largest fires in Los Angeles County history. It burned a huge part of the San Gabriel Mountains." },
    { name: "Bobcat Fire", year: 2020, ll: [34.20, -117.88], acres: "about 116,000", text: "Burned a big part of the San Gabriel Mountains in the fall of 2020." },
    { name: "Thomas Fire", year: 2017, ll: [34.43, -119.20], acres: "about 282,000", text: "Burned across Ventura and Santa Barbara counties in December 2017. The rain that came afterward caused deadly mudslides." },
    { name: "Cedar Fire", year: 2003, ll: [32.95, -116.75], acres: "about 273,000", text: "Burned a huge area of San Diego County in October 2003." }
  ];

  /* ---------- helpers ---------- */
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pick = (p, names) => { for (const n of names) if (p[n] !== undefined && p[n] !== null && p[n] !== "") return p[n]; return null; };
  const fmtAcres = n => {
    if (n === null || n === undefined || isNaN(n)) return "size not reported yet";
    n = Number(n);
    if (n < 1) return "size not updated yet (first reports are often tiny)";
    return (n < 10 ? n.toFixed(1) : Math.round(n).toLocaleString()) + " acres";
  };
  /* The national feed also holds many tiny dispatch reports with code names like LAC-355018 and old records nobody closed out.
     These helpers keep the map to real, recent, Southern California fires. */
  const cleanName = s => { s = String(s || "").trim(); const i = s.lastIndexOf("/"); return i >= 0 ? s.slice(i + 1).trim() : s; };
  const isCode = s => /^([A-Za-z]{1,4}[-_ ]?)?\d+[A-Za-z]?$/.test(String(s || "").trim());
  const ageDays = ms => { const t = Number(ms); return ms && !isNaN(t) ? (Date.now() - t) / 864e5 : null; };
  const inSoCal = (state, county) => {
    if (state && !/CA$/i.test(String(state))) return false;
    return SOCAL_COUNTIES.indexOf(String(county || "").toLowerCase()) >= 0;
  };
  const fmtDate = ms => {
    if (!ms) return "";
    const d = new Date(typeof ms === "string" && isNaN(Number(ms)) ? ms : Number(ms));
    return isNaN(d) ? "" : d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  };
  function flameIcon(kind, size) {
    const c = COLORS[kind];
    const s = size || 30;
    return L.divIcon({
      className: "flame-icon" + (kind === "active" ? " pulse" : ""),
      iconSize: [s, s], iconAnchor: [s / 2, s - 2],
      html: `<svg viewBox="0 0 32 40" width="${s}" height="${s * 1.25}" aria-hidden="true"><path d="M16 2 C18 10 28 14 28 25 C28 33 22 38 16 38 C10 38 4 33 4 25 C4 19 8 16 10 12 C11 16 13 17 14 17 C14 11 14 6 16 2Z" fill="${c.fill}" stroke="${c.stroke}" stroke-width="2.5"/><path d="M16 20 C19 24 21 26 21 30 C21 33 19 35 16 35 C13 35 11 33 11 30 C11 26 14 24 16 20Z" fill="#FFE27A"/></svg>`
    });
  }
  function boundsCenter(layerOrLatLng) {
    if (layerOrLatLng.getBounds) return layerOrLatLng.getBounds().getCenter();
    return layerOrLatLng;
  }

  /* ---------- the info panel with animals ---------- */
  function kindLabel(f) {
    if (f.kind === "active") return f.rx ? "Planned burn (last two weeks)" : "Recent fire (last two weeks)";
    if (f.kind === "recent") return f.rx ? "Planned burn earlier this year" : "Burned earlier this year";
    return "Famous past fire";
  }
  function showFire(f) {
    const center = f.ll;
    const habs = habitatGuess(center[0], center[1]);
    const list = animalsFor(habs, 6);
    const habNames = habs.filter(h => h !== "riparian").map(h => FIRE_HABITATS[h].name);
    const facts = [];
    if (f.kind !== "old") {
      facts.push(`<span><strong>Size:</strong> ${esc(fmtAcres(f.acres))}</span>`);
      if (f.date) facts.push(`<span><strong>Started:</strong> ${esc(fmtDate(f.date))}</span>`);
      if (f.contained !== null && f.contained !== undefined && !isNaN(f.contained)) facts.push(`<span><strong>Contained:</strong> ${Math.round(f.contained)}%</span>`);
    } else {
      facts.push(`<span><strong>Year:</strong> ${f.year}</span><span><strong>Size:</strong> ${esc(f.acres)} acres</span>`);
    }
    const habBlocks = habs.map(h => `<div class="fire-hab"><h4>${esc(FIRE_HABITATS[h].name)}</h4><p>${esc(FIRE_HABITATS[h].fire)}</p></div>`).join("");
    panel.innerHTML = `
      <button class="btn ghost small fire-close" type="button" id="fire-close" aria-label="Close fire information">Close</button>
      <p class="fire-kind fire-kind-${f.kind}">${esc(kindLabel(f))}</p>
      <h3>${esc(f.name)}</h3>
      <p class="fire-facts">${facts.join("")}</p>
      ${f.text ? `<p>${esc(f.text)}</p>` : ""}
      ${f.kind === "active" ? `<p class="fire-safety">If you are ever near a fire, listen to grown-ups and local officials. Wildfires can be dangerous. Check the official map: <a href="${OFFICIAL}" target="_blank" rel="noopener">Cal Fire incidents</a>.</p>` : ""}
      <div class="callout expert"><p><strong>Fire is a normal part of nature here.</strong> Many Southern California plants and animals have lived with fire for thousands of years. The trouble is that fires now start more often and burn hotter, and plant bullies make them worse.</p></div>
      <h3>How fire changes the land here</h3>
      <p class="muted-note">Best guess from the map spot: ${esc(habNames.join(", ") || "wild land")}. A map can't tell us exactly what grows in every spot, so ask an expert to check!</p>
      <div class="fire-habs">${habBlocks}</div>
      <h3>Animals that might live around here</h3>
      <div class="animal-grid">${list.map(a => `
        <article class="animal-card">
          <div class="animal-pic">${animalPic(a, 110)}</div>
          <div class="animal-body">
            <h4>${esc(a.name)}</h4>
            <p class="sci">${esc(a.sci)}</p>
            ${a.status ? `<p class="status">${esc(a.status)}</p>` : ""}
            <p>${esc(a.about)}</p>
            <p class="fire-effect"><strong>Fire and their home:</strong> ${esc(a.fire)}</p>
            ${animalCredit(a)}
          </div>
        </article>`).join("")}</div>
      <p>Native plants help the land heal. Read the <a href="plants.html">plant guide</a> and the <a href="seeds.html">seeds page</a> to see how seeds can help burned places grow back.</p>`;
    panel.hidden = false;
    document.getElementById("fire-close").addEventListener("click", () => { panel.hidden = true; });
    panel.setAttribute("tabindex", "-1");
    try { panel.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) { panel.scrollIntoView(); }
    panel.focus({ preventScroll: true });
    if (window.Bear && window.Bear.say) Bear.say("Fire is part of nature here, but animals need time and plants to come back. Look at who lives near " + f.name + "!", { mood: "wave", stay: 6000 });
    lastClicked = f;
  }

  /* ---------- drawing ---------- */
  function addFire(f, poly) {
    const group = groups[f.kind];
    const c = COLORS[f.kind];
    if (poly) {
      L.geoJSON(poly, {
        bubblingMouseEvents: false,
        style: { color: c.stroke, weight: f.kind === "active" ? 3 : 2, fillColor: c.fill, fillOpacity: f.kind === "active" ? .38 : .28, dashArray: f.kind === "recent" ? "6 4" : null },
        onEachFeature: (ft, layer) => layer.on("click", e => { L.DomEvent.stopPropagation(e); showFire(f); })
      }).addTo(group);
    }
    const m = L.marker(f.ll, { icon: flameIcon(f.kind, f.kind === "active" ? 34 : 28), title: f.name, keyboard: true, riseOnHover: true }).addTo(group);
    m.bindTooltip(f.name, { direction: "top", offset: [0, -26] });
    m.on("click", e => { showFire(f); });
  }

  function clearLive() { groups.active.clearLayers(); groups.recent.clearLayers(); }

  function normalize(feature, kindHint) {
    const p = feature.properties || {};
    const rawName = cleanName(pick(p, ["poly_IncidentName", "attr_IncidentName", "IncidentName", "incidentname", "FIRE_NAME", "poly_FeatureCategory"]) || "");
    const name = !rawName ? "Unnamed fire" : isCode(rawName) ? "Unnamed fire (report " + rawName + ")" : rawName;
    const state = pick(p, ["attr_POOState", "POOState"]);
    const county = pick(p, ["attr_POOCounty", "POOCounty"]);
    const acres = pick(p, ["attr_IncidentSize", "poly_GISAcres", "poly_Acres_AutoCalc", "GISAcres", "IncidentSize", "DailyAcres"]);
    const date = pick(p, ["attr_FireDiscoveryDateTime", "FireDiscoveryDateTime", "poly_CreateDate", "poly_DateCurrent"]);
    const contained = pick(p, ["attr_PercentContained", "PercentContained"]);
    const type = String(pick(p, ["attr_IncidentTypeCategory", "IncidentTypeCategory"]) || "").toUpperCase();
    const id = pick(p, ["attr_IrwinID", "poly_IRWINID", "IrwinID", "GlobalID"]) || name;
    return { id: String(id).toLowerCase(), name: toTitle(name), acres: acres === null ? null : Number(acres), date, contained: contained === null ? null : Number(contained), rx: type === "RX", kind: kindHint, state, county, code: isCode(rawName) };
  }
  function toTitle(s) {
    s = String(s);
    if (s === s.toUpperCase()) s = s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    return /fire$|incident$|\)$/i.test(s) || /\bfire\b/i.test(s) ? s : s + " Fire";
  }
  function polyCenter(feature) {
    try { return boundsCenter(L.geoJSON(feature)); } catch (e) { return null; }
  }
  function pointOf(feature) {
    const g = feature.geometry;
    if (g && g.type === "Point") return L.latLng(g.coordinates[1], g.coordinates[0]);
    return polyCenter(feature);
  }

  /* ---------- live data ---------- */
  function queryUrl(service, extra) {
    return BASE + service + "/FeatureServer/0/query?where=1%3D1&geometry=" + ENVELOPE +
      "&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=4326&f=geojson" + (extra || "");
  }
  function getJSON(url) {
    const ctl = ("AbortController" in window) ? new AbortController() : null;
    const timer = ctl ? setTimeout(() => ctl.abort(), 15000) : null;
    return fetch(url, ctl ? { signal: ctl.signal } : {}).then(r => {
      if (timer) clearTimeout(timer);
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(j => {
      if (j && j.error) throw new Error("service error");
      return j;
    });
  }

  function setStatus(html, kind) {
    if (!statusEl) return;
    statusEl.innerHTML = html;
    statusEl.className = "fire-status " + (kind || "");
  }

  function loadLive() {
    setStatus("Looking for fires&hellip;", "");
    if (refreshBtn) refreshBtn.disabled = true;
    const simplify = "&maxAllowableOffset=0.0008&resultRecordCount=400";
    const cur = getJSON(queryUrl("WFIGS_Interagency_Perimeters_Current", simplify));
    const ytd = getJSON(queryUrl("WFIGS_Interagency_Perimeters_YearToDate", simplify)).catch(() => null);
    const pts = getJSON(queryUrl("WFIGS_Incident_Locations_Current", "&resultRecordCount=400")).catch(() => null);
    return Promise.all([cur, ytd, pts]).then(([c, y, p]) => {
      clearLive();
      const seen = {};
      let nActive = 0, nRecent = 0;
      (c.features || []).forEach(ft => {
        const f = normalize(ft, "active");
        if (!inSoCal(f.state, f.county)) return;
        const age = ageDays(f.date);
        if (age === null || age > RECENT_DAYS) return;
        if (!(f.acres >= 10) && age > 7) return;
        const ll = polyCenter(ft); if (!ll) return;
        f.ll = [ll.lat, ll.lng];
        seen[f.id] = true; seen[f.name.toLowerCase()] = true;
        addFire(f, ft); nActive++;
      });
      if (p && p.features) p.features.forEach(ft => {
        const f = normalize(ft, "active");
        const cat = String((ft.properties || {}).IncidentTypeCategory || "").toUpperCase();
        if (cat && cat !== "WF" && cat !== "RX") return;
        if (seen[f.id] || seen[f.name.toLowerCase()]) return;
        if (!inSoCal(f.state, f.county)) return;
        f.acres = pick(ft.properties || {}, ["IncidentSize", "DailyAcres", "CalculatedAcres"]);
        f.acres = f.acres === null ? null : Number(f.acres);
        f.date = pick(ft.properties || {}, ["FireDiscoveryDateTime"]);
        const big = f.acres >= 10;
        const age = ageDays(f.date);
        if (age === null || age > RECENT_DAYS) return;      /* old records nobody closed out */
        if (f.code && !big) return;                          /* tiny dispatch reports like LAC-355018 */
        if (!big && age > 7) return;                         /* small and a week old: probably out */
        const ll = pointOf(ft); if (!ll) return;
        f.ll = [ll.lat, ll.lng]; f.rx = cat === "RX";
        f.contained = pick(ft.properties || {}, ["PercentContained"]);
        f.contained = f.contained === null ? null : Number(f.contained);
        seen[f.id] = true; seen[f.name.toLowerCase()] = true;
        addFire(f, null); nActive++;
      });
      if (y && y.features) y.features.forEach(ft => {
        const f = normalize(ft, "recent");
        if (seen[f.id] || seen[f.name.toLowerCase()]) return;
        if (f.acres !== null && f.acres < MIN_RECENT_ACRES) return;
        if (!inSoCal(f.state, f.county)) return;
        const ll = polyCenter(ft); if (!ll) return;
        f.ll = [ll.lat, ll.lng];
        seen[f.id] = true;
        addFire(f, ft); nRecent++;
      });
      const t = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      setStatus(`<strong>Fire map updated at ${t}.</strong> ${nActive} recent fires (last two weeks) and ${nRecent} bigger fires earlier this year. Source: National Interagency Fire Center, checked every 10 minutes while this page is open. That feed can be hours behind and early sizes are often too small, so for the newest facts see <a href="${OFFICIAL}" target="_blank" rel="noopener">Cal Fire</a>. ${nActive === 0 ? "No recent fires were reported in Southern California. That is good news!" : ""}`, "ok");
    }).catch(() => {
      clearLive();
      setStatus(`We could not reach the live fire map right now. Maybe the internet is off, or the fire service is busy. You can still click the purple flames for famous past fires. For today&rsquo;s fires, check the <a href="${OFFICIAL}" target="_blank" rel="noopener">official Cal Fire map</a>.`, "warn");
    }).then(() => { if (refreshBtn) refreshBtn.disabled = false; });
  }

  /* ---------- famous past fires ---------- */
  OLD_FIRES.forEach(o => addFire({ id: "old-" + o.name, name: o.name, kind: "old", year: o.year, acres: o.acres, ll: o.ll, text: o.text }, null));

  /* ---------- layer checkboxes ---------- */
  document.querySelectorAll("[data-fire-layer]").forEach(cb => {
    cb.addEventListener("change", () => {
      const g = groups[cb.dataset.fireLayer];
      if (cb.checked) g.addTo(map); else map.removeLayer(g);
    });
  });
  if (refreshBtn) refreshBtn.addEventListener("click", loadLive);
  loadLive();
  setInterval(() => { if (!document.hidden) loadLive(); }, 10 * 60 * 1000); // refresh every 10 minutes while the page is open

  window.OHEFires = { show: showFire, reload: loadLive };
})();
