# Puglia trip site

Two pages: a "coming soon" landing page, and an interactive map. No build
step — just HTML, CSS, and JS. No API keys, no billing account.

```
index.html               landing page
map.html                 interactive map
assets/css/style.css     shared design tokens (colors, fonts, map page)
assets/css/landing.css   landing page + sneak-peek panel styles
assets/js/site-config.js the "notify me" form endpoint
assets/js/landing.js     landing page behavior + the premium-box easter egg
assets/js/map-config.js  <-- edit this: your pinned locations
assets/js/map-init.js    builds the map from map-config.js (Leaflet + OpenStreetMap)
assets/img/wip-hero.webp landing page photo
```

## Editing the map pins

Open `assets/js/map-config.js` and edit the `TRIP_STOPS` list. Each stop
needs:

- `name` — shown as the pin's title and list label
- `category` — exactly one of `"wedding"`, `"attractions"`,
  `"accommodations"`, or `"restaurants"` — sorts it into the right tab
- `lat` / `lng` — right-click a spot on
  [Google Maps](https://www.google.com/maps) and click the coordinates
  that pop up to copy them
- `note` — short text shown in the pin's popup and in the sidebar list

The map itself runs on [Leaflet](https://leafletjs.com/) with free
OpenStreetMap tiles, loaded from a CDN in `map.html` — nothing to sign up
for.

## The landing page easter egg

Click the "Premium subscription" checkbox 5 times to reveal a side panel
linking to the map. It's controlled in `assets/js/landing.js` and stays
unlocked (via `localStorage`) once found.

## Hosting

Push this to a GitHub repo, then in **Settings → Pages** set the source to
your main branch. The `CNAME` file points it at
`www.kaylaandlorenzosfirstwedding.net` — update or remove it if you're using
a different domain.
