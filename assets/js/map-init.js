// Builds the map, drops one pin per entry in TRIP_STOPS, and wires
// up the category tabs + sidebar list on the map page.
// TRIP_STOPS / CATEGORY_* are defined in map-config.js.

let map;
let infoWindow;
const markersByCategory = {};
let activeCategory = CATEGORY_ORDER[0];

function initTripMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  map = new google.maps.Map(mapEl, {
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    mapId: "PUGLIA_TRIP_MAP",
    disableDefaultUI: false,
    streetViewControl: false,
    fullscreenControl: true,
  });

  infoWindow = new google.maps.InfoWindow();

  CATEGORY_ORDER.forEach((cat) => (markersByCategory[cat] = []));

  TRIP_STOPS.forEach((stop) => {
    const color = CATEGORY_COLORS[stop.category] || "#1c2b33";

    const pin = document.createElement("div");
    pin.style.width = "16px";
    pin.style.height = "16px";
    pin.style.borderRadius = "50% 50% 50% 0";
    pin.style.transform = "rotate(-45deg)";
    pin.style.background = color;
    pin.style.border = "2px solid #f7f6f1";
    pin.style.boxShadow = "0 2px 6px rgba(28,43,51,0.35)";

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat: stop.lat, lng: stop.lng },
      title: stop.name,
      content: pin,
    });

    marker.addListener("click", () => openStopInfo(stop, marker));

    stop._marker = marker;
    if (!markersByCategory[stop.category]) markersByCategory[stop.category] = [];
    markersByCategory[stop.category].push(stop);
  });

  setActiveCategory(CATEGORY_ORDER[0]);
  buildTabs();
}

function openStopInfo(stop, marker) {
  const color = CATEGORY_COLORS[stop.category] || "#1c2b33";
  infoWindow.setContent(`
    <div style="font-family: 'Public Sans', sans-serif; max-width: 220px; padding: 4px 2px;">
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
  `);
  infoWindow.open(map, marker);
}

function setActiveCategory(category) {
  activeCategory = category;

  // show only this category's markers
  CATEGORY_ORDER.forEach((cat) => {
    const isActive = cat === category;
    (markersByCategory[cat] || []).forEach((stop) => {
      stop._marker.map = isActive ? map : null;
    });
  });

  // fit the map to the visible pins
  const stops = markersByCategory[category] || [];
  if (stops.length === 1) {
    map.setCenter({ lat: stops[0].lat, lng: stops[0].lng });
    map.setZoom(13);
  } else if (stops.length > 1) {
    const bounds = new google.maps.LatLngBounds();
    stops.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }));
    map.fitBounds(bounds, 60);
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
      map.panTo({ lat: stop.lat, lng: stop.lng });
      map.setZoom(14);
      openStopInfo(stop, stop._marker);
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

window.initTripMap = initTripMap;
