/* ============================================================
   EDIT THIS FILE to change your Google Maps API key and your
   highlighted stops. Nothing else in the site needs to change.
   ============================================================ */

// Paste your Google Maps API key here (see README.md for how to get one).
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY_HERE";

// Roughly centers the map on Puglia on first load.
const MAP_CENTER = { lat: 40.75, lng: 17.35 };
const MAP_ZOOM = 8;

// One entry per pin. `category` controls the marker color —
// see CATEGORY_COLORS below. Add or remove stops freely.
const TRIP_STOPS = [
  {
    name: "Alberobello",
    category: "see",
    lat: 40.7844,
    lng: 17.2378,
    note: "The trulli district — cone-roofed stone houses, UNESCO listed. Go early to beat the tour groups.",
  },
  {
    name: "Ostuni",
    category: "see",
    lat: 40.7302,
    lng: 17.5793,
    note: "The 'White City' on a hilltop. Wander the old town at sunset.",
  },
  {
    name: "Polignano a Mare",
    category: "see",
    lat: 41.0, 
    lng: 17.2199,
    note: "Cliffside town over the Adriatic. Swim at Lama Monachile beach.",
  },
  {
    name: "Masseria Il Frantoio",
    category: "stay",
    lat: 40.7600,
    lng: 17.6100,
    note: "Working olive farm with rooms, near Ostuni.",
  },
  {
    name: "Trattoria Terra Madre",
    category: "eat",
    lat: 40.7833,
    lng: 17.2400,
    note: "Orecchiette and local wine, walking distance from the trulli.",
  },
  {
    name: "Grotte di Castellana",
    category: "do",
    lat: 40.8814,
    lng: 17.1656,
    note: "Underground cave system, guided tours run most of the day.",
  },
];

const CATEGORY_COLORS = {
  see: "#a4502b",   // rust — sights and towns
  eat: "#c6862e",   // ochre — food
  stay: "#2c5f74",  // sea — lodging
  do: "#6e7f4b",    // olive — activities
};

const CATEGORY_LABELS = {
  see: "See",
  eat: "Eat",
  stay: "Stay",
  do: "Do",
};
