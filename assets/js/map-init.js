// Builds the map, drops one pin per entry in TRIP_STOPS, and wires
// up the category tabs + sidebar list on the map page.
// TRIP_STOPS / CATEGORY_* are defined in map-config.js.
// Uses Leaflet + OpenStreetMap tiles — no API key, no billing account.

let map;
const markersByCategory = {};
let activeCategory = CATEGORY_ORDER[0];

function makePinIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:16px; height:16px;
      border-radius:50% 50% 50% 0;
      transform: rotate(-45deg);
      background:${color};
      border:2px solid #f7f6f1;
      box-shadow:0 2px 6px rgba(28,43,51,0.35);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 16],
    popupAnchor: [0, -16],
  });
}

function popupHtml(stop) {
  const color = CATEGORY_COLORS[stop.category] || "#1c2b33";
  return `
    <div style="font-family: 'Public Sans', sans-serif; max-width: 220px; padding: 2px 0;">
      <div style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; color: ${color}; margin-bottom: 4px;">
        ${CATEGORY_LABELS[stop.category] || stop.category}
      </div>
      <div style="font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600; color: #1c2b33; margin-bottom: 6px;">
        ${stop.name}
      </div>
      <div style="font-size: 13px; color: #2c5f74; line-height: 1.4;">
        ${stop.note || ""}
      </div>
    </div>
  `;
}

function initTripMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  map = L.map(mapEl, {
    center: [MAP_CENTER.lat, MAP_CENTER.lng],
    zoom: MAP_ZOOM,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  CATEGORY_ORDER.forEach((cat) => (markersByCategory[cat] = []));

  TRIP_STOPS.forEach((stop) => {
    const color = CATEGORY_COLORS[stop.category] || "#1c2b33";

    const marker = L.marker([stop.lat, stop.lng], {
      icon: makePinIcon(color),
      title: stop.name,
    });

    marker.bindPopup(popupHtml(stop));

    stop._marker = marker;
    if (!markersByCategory[stop.category]) markersByCategory[stop.category] = [];
    markersByCategory[stop.category].push(stop);
  });

  setActiveCategory(CATEGORY_ORDER[0]);
  buildTabs();
}

function openStopInfo(stop) {
  if (!stop._marker) return;
  stop._marker.openPopup();
}

function setActiveCategory(category) {
  activeCategory = category;

  // show only this category's markers
  CATEGORY_ORDER.forEach((cat) => {
    const isActive = cat === category;
    (markersByCategory[cat] || []).forEach((stop) => {
      if (isActive) {
        stop._marker.addTo(map);
      } else {
        map.removeLayer(stop._marker);
      }
    });
  });

  // fit the map to the visible pins
  const stops = markersByCategory[category] || [];
  if (stops.length === 1) {
    map.setView([stops[0].lat, stops[0].lng], 13);
  } else if (stops.length > 1) {
    const bounds = L.latLngBounds(stops.map((s) => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [60, 60] });
  }

  renderStopList(category);

  document.querySelectorAll(".map-tab").forEach((btn) => {
    const isActive = btn.getAttribute("data-category") === category;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function renderStopList(category) {
  const listEl = document.getElementById("map-stop-list");
  if (!listEl) return;

  const stops = markersByCategory[category] || [];
  listEl.innerHTML = "";

  if (stops.length === 0) {
    const empty = document.createElement("p");
    empty.className = "map-stop-empty";
    empty.textContent = "Nothing added here yet.";
    listEl.appendChild(empty);
    return;
  }

  stops.forEach((stop) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "map-stop-item";
    item.style.setProperty("--stop-color", CATEGORY_COLORS[stop.category] || "#1c2b33");
    item.innerHTML = `
      <span class="map-stop-dot"></span>
      <span class="map-stop-text">
        <span class="map-stop-name">${stop.name}</span>
        <span class="map-stop-note">${stop.note || ""}</span>
      </span>
    `;
    item.addEventListener("click", () => {
      map.setView([stop.lat, stop.lng], 14);
      openStopInfo(stop);
    });
    listEl.appendChild(item);
  });
}

function buildTabs() {
  const tabsEl = document.getElementById("map-tabs");
  if (!tabsEl) return;

  tabsEl.innerHTML = "";
  CATEGORY_ORDER.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "map-tab" + (cat === activeCategory ? " active" : "");
    btn.setAttribute("role", "tab");
    btn.setAttribute("data-category", cat);
    btn.setAttribute("aria-selected", cat === activeCategory ? "true" : "false");
    btn.style.setProperty("--tab-color", CATEGORY_COLORS[cat] || "#1c2b33");
    btn.textContent = CATEGORY_LABELS[cat] || cat;
    btn.addEventListener("click", () => setActiveCategory(cat));
    tabsEl.appendChild(btn);
  });
}

document.addEventListener("DOMContentLoaded", initTripMap);
