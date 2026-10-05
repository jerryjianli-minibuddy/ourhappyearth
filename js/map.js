/* Where page: satellite map, explore spots, your own pins, spot checklist */
(function () {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  if (typeof L === "undefined") {
    mapEl.innerHTML = '<p style="padding:20px">The map could not load. Check your internet connection and try again.</p>';
    return;
  }

  const map = L.map("map", { scrollWheelZoom: false }).setView([34.0, -118.4], 9);
  window.OHEMap = map;

  const sat = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 18,
    attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics"
  });
  const street = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  });
  sat.addTo(map);
  L.control.layers({ "Satellite view": sat, "Street map": street }, null, { collapsed: false }).addTo(map);

  /* Explore spots: approximate areas to study, NOT places we say need planting */
  const SPOTS = [
    { name: "Ballona Wetlands area", ll: [33.969, -118.437], note: "A wetland near the coast, close to Culver City. Zoom in to see what the land looks like." },
    { name: "Santa Monica Mountains", ll: [34.09, -118.65], note: "Lots of wild hills here. Look for the different colors of plants from above." },
    { name: "Griffith Park", ll: [34.1366, -118.2942], note: "A huge park in the middle of the city. Can you find wild areas and built-up areas?" },
    { name: "Los Angeles River", ll: [34.095, -118.257], note: "A river that runs through the city. Rivers are home to wetland plants and animals." }
  ];
  SPOTS.forEach(s => {
    L.marker(s.ll).addTo(map).bindPopup(`<strong>${s.name}</strong><br>${s.note}<br><em>(approximate spot)</em>`);
  });

  /* Your own pins, saved only in this browser */
  const KEY = "ohe-pins-v1";
  let pins = [];
  try { pins = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { pins = []; }
  const layer = L.layerGroup().addTo(map);
  const form = document.getElementById("pin-form");
  const noteInput = document.getElementById("pin-note");
  let pending = null;

  function save() { try { localStorage.setItem(KEY, JSON.stringify(pins)); } catch (e) {} }
  function esc(t) { return t.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  function draw() {
    layer.clearLayers();
    pins.forEach(p => {
      L.circleMarker(p.ll, { radius: 9, color: "#B4452A", fillColor: "#FFC94A", fillOpacity: .95, weight: 3 })
        .addTo(layer).bindPopup(`<strong>Our idea:</strong> ${esc(p.note)}`);
    });
  }
  draw();

  map.on("click", e => {
    pending = [e.latlng.lat, e.latlng.lng];
    form.classList.add("show");
    noteInput.value = "";
    noteInput.focus();
  });
  document.getElementById("pin-save").addEventListener("click", () => {
    if (!pending) return;
    const note = noteInput.value.trim() || "A place to study";
    pins.push({ ll: pending, note: note.slice(0, 120) });
    pending = null;
    form.classList.remove("show");
    save(); draw();
  });
  document.getElementById("pin-cancel").addEventListener("click", () => { pending = null; form.classList.remove("show"); });
  document.getElementById("pin-clear").addEventListener("click", () => { pins = []; save(); draw(); });
  noteInput.addEventListener("keydown", e => { if (e.key === "Enter") document.getElementById("pin-save").click(); });
  document.getElementById("map-wheel").addEventListener("change", e => {
    if (e.target.checked) map.scrollWheelZoom.enable(); else map.scrollWheelZoom.disable();
  });
})();
