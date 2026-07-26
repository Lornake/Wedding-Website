/* ============================================================
   EDIT THIS FILE to change your pinned locations.
   Nothing else in the site needs to change — the map itself
   runs on Leaflet + OpenStreetMap, so no API key or billing
   account is needed.

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

// Roughly centers the map on Puglia on first load.
const MAP_CENTER = { lat: 40.351447, lng: 18.175153 };
const MAP_ZOOM = 8;

const TRIP_STOPS = [
  {
    name: "Torre del Paco",
    category: "wedding",
    lat: 40.347278,
    lng: 18.179814,
    note: "Ceremony and reception venue",
  },
  {
    name: "Alberobello",
    category: "attractions",
    lat: 40.7844,
    lng: 17.2378,
    note: "The Trulle, cone-roofed stone houses, UNESCO listed",
  },

  {
    name: "Torre dell'Orso",
    category: "attractions",
    lat: 40.273305,
    lng: 18.428250,
    note: "Best beach in the Mediterranean, but accordingly crowded",
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
