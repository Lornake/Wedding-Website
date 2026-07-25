# Puglia trip site

A small 4-page static site: a landing page, a "The Trip" dropdown menu leading
to an interactive map, a day-by-day itinerary, and an about/logistics page.
No build step — just HTML, CSS, and JS.

```
index.html        landing page
map.html          interactive map
itinerary.html    day-by-day text page
about.html        logistics text page
assets/css/style.css
assets/js/nav.js         dropdown menu behavior
assets/js/map-config.js  <-- edit this: your API key + your pins
assets/js/map-init.js    builds the map from map-config.js
```

## 1. Edit your content

- **Map pins**: open `assets/js/map-config.js` and edit the `TRIP_STOPS` list —
  each stop needs a name, category (`see` / `eat` / `stay` / `do`), lat/lng,
  and a short note. Get coordinates by right-clicking a spot on
  [Google Maps](https://www.google.com/maps) and copying the numbers shown.
- **Itinerary / About**: edit the text directly in `itinerary.html` and
  `about.html` — each day or section is a plain HTML block, easy to copy and
  edit.

## 2. Get a free Google Maps API key

1. Go to [console.cloud.google.com](https://console.cloud.google.com/) and
   create a project (or use an existing one).
2. In the search bar, go to **APIs & Services → Library**, and enable the
   **Maps JavaScript API**.
3. Go to **APIs & Services → Credentials → Create Credentials → API key**.
4. Click into the new key and, under **Application restrictions**, choose
   **Websites** and add your domain (e.g. `yourdomain.com/*`) once you know
   it — this stops anyone else from using your key.
5. Paste the key into `assets/js/map-config.js` in place of
   `YOUR_API_KEY_HERE`.

Google gives every account a recurring free monthly credit that comfortably
covers a small personal site like this one — you're very unlikely to be
charged anything for normal traffic. You'll need a credit card on file to
activate the API, but that's a Google requirement, not a cost.

## 3. Host it for free

Either of these work well for a static site like this:

**GitHub Pages**
1. Create a new GitHub repo and push these files to it.
2. In the repo, go to **Settings → Pages**, set the source to your main
   branch, and save.
3. Your site will be live at `https://yourusername.github.io/reponame`.

**Netlify**
1. Go to [app.netlify.com](https://app.netlify.com), sign up, and drag the
   whole `puglia-site` folder onto the "Deploy manually" area — no repo
   needed.
2. Netlify gives you a live URL immediately.

## 4. Point your Cloudflare domain at it

Your domain stays registered with Cloudflare — you're just telling it where
to send visitors. In the Cloudflare dashboard, go to your domain's **DNS**
settings and add records depending on where you hosted:

**For GitHub Pages:**
- Four `A` records for `@` (root domain), pointing to GitHub's IPs:
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- One `CNAME` record for `www` pointing to `yourusername.github.io`
- In your GitHub repo's **Settings → Pages**, enter your custom domain so
  GitHub knows to serve it there.

**For Netlify:**
- Netlify will show you the exact records to add once you connect a custom
  domain in its dashboard (usually a `CNAME` for `www` and an `A` record or
  `ALIAS`/`CNAME` for the root, depending on your plan).

Either way, turn Cloudflare's proxy (the orange cloud icon) **on** once it's
working — that gives you free SSL and CDN caching on top.

DNS changes can take anywhere from a few minutes to a few hours to
propagate.
