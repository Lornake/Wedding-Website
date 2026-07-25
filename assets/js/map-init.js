// Builds the map and drops one custom pin per entry in TRIP_STOPS
// (defined in map-config.js). Called by the Google Maps script
// callback once the API has loaded.

function initTripMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  const map = new google.maps.Map(mapEl, {
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    mapId: "PUGLIA_TRIP_MAP",
    disableDefaultUI: false,
    streetViewControl: false,
    fullscreenControl: true,
  });

  const infoWindow = new google.maps.InfoWindow();

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
      map,
      position: { lat: stop.lat, lng: stop.lng },
      title: stop.name,
      content: pin,
    });

    marker.addListener("click", () => {
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
    });
  });
}

window.initTripMap = initTripMap;
