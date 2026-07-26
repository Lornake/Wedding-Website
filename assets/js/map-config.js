/* ============================================================
   EDIT THIS FILE to change your Google Maps API key and your
   pinned locations. Nothing else in the site needs to change.

   HOW TO ADD A LOCATION:
   Copy one of the entries in TRIP_STOPS below, paste it back into
   the list, and edit the fields:
     - name:     shown as the pin's title and list label
     - category: must be exactly one of "wedding", "attractions",
                 "accommodations", or "restaurants" — this is what
                 sorts it into the right tab on the map page
     - lat/lng:  right-click the spot on https://www.google.com/maps
                 and click the coordinates that pop up to copy them
     - note:     short text shown in the pin's popup and in the list
   ============================================================ */

// Paste your Google Maps API key here (see README.md for how to get one).
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY_HERE";

// Roughly centers the map on Puglia on first load.
const MAP_CENTER = { lat: 40.75, lng: 17.35 };
const MAP_ZOOM = 8;

const TRIP_STOPS = [
  {
    name: "Masseria Il Frantoio",
    category: "wedding",
    lat: 40.76,
    lng: 17.61,
    note: "Ceremony and reception venue — working olive farm just outside Ostuni.",
  },
  {
    name: "Alberobello",
    category: "attractions",
    lat: 40.7844,
    lng: 17.2378,
    note: "The trulli district — cone-roofed stone houses, UNESCO listed.",
  },
  {
    name: "Ostuni",
    category: "attractions",
    lat: 40.7302,
    lng: 17.5793,
    note: "The 'White City' on a hilltop. Best explored at sunset.",
  },
  {
    name: "Polignano a Mare",
    category: "attractions",
    lat: 41.0,
    lng: 17.2199,
    note: "Cliffside town over the Adriatic. Swim at Lama Monachile beach.",
  },
  {
    name: "Grotte di Castellana",
    category: "attractions",
    lat: 40.8814,
    lng: 17.1656,
    note: "Underground cave system, guided tours run most of the day.",
  },
  {
    name: "Masseria Il Frantoio — Rooms",
    category: "accommodations",
    lat: 40.76,
    lng: 17.611,
    note: "On-site rooms at the venue, book directly for the wedding block.",
  },
  {
    name: "Ostuni old town B&B",
    category: "accommodations",
    lat: 40.7295,
    lng: 17.58,
    note: "Walkable to the old town, good option for guests without a car.",
  },
  {
    name: "Trattoria Terra Madre",
    category: "restaurants",
    lat: 40.7833,
    lng: 17.24,
    note: "Orecchiette and local wine, walking distance from the trulli.",
  },
  {
    name: "Osteria del Tempo Perso",
    category: "restaurants",
    lat: 40.731,
    lng: 17.5805,
    note: "Cave-cellar restaurant in Ostuni's old town, book ahead.",
  },
];

const CATEGORY_COLORS = {
  wedding: "#9b1b30",        // ruby — the wedding venue itself
  attractions: "#a4502b",    // rust — sights and towns
  accommodations: "#2c5f74", // sea — places to stay
  restaurants: "#c6862e",    // ochre — food
};

const CATEGORY_LABELS = {
  wedding: "Wedding Locations",
  attractions: "Attractions",
  accommodations: "Accommodations",
  restaurants: "Restaurants",
};

// Order the tabs appear in on the map page.
const CATEGORY_ORDER = ["wedding", "attractions", "accommodations", "restaurants"];
