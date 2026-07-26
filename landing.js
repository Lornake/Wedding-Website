// ---------- translations ----------
const TRANSLATIONS = {
  en: {
    wip: "Work in progress",
    prompt: "Please put your email in the box below to be notified when the website is done.",
    emailPlaceholder: "you@example.com",
    submit: "Notify me",
    premium: "Premium subscription",
    sending: "Sending…",
    thanks: "Thanks — we'll email you when it's ready.",
    error: "Something went wrong — try again in a moment.",
    invalidEmail: "That doesn't look like a valid email.",
    notConfigured: "Signup isn't connected yet — check back soon.",
    sneakEyebrow: "You found something",
    sneakTitle: "The map's already live",
    sneakText: "The venue, sights, and stops for the trip — have a look while the rest of the site catches up.",
    sneakLink: "Open the map →",
  },
  it: {
    wip: "Lavori in corso",
    prompt: "Inserisci la tua email qui sotto per essere avvisato quando il sito sarà pronto.",
    emailPlaceholder: "tuaemail@esempio.com",
    submit: "Avvisami",
    premium: "Abbonamento Premium",
    sending: "Invio in corso…",
    thanks: "Grazie — ti scriveremo appena sarà pronto.",
    error: "Qualcosa è andato storto — riprova tra un momento.",
    invalidEmail: "Questa email non sembra valida.",
    notConfigured: "L'iscrizione non è ancora attiva — torna presto.",
    sneakEyebrow: "Hai trovato qualcosa",
    sneakTitle: "La mappa è già online",
    sneakText: "Il luogo della cerimonia, le tappe e i posti da vedere — dai un'occhiata mentre il resto del sito si completa.",
    sneakLink: "Apri la mappa →",
  },
};

let currentLang = "en";

function applyLanguage(lang) {
  currentLang = lang;
  const dict = TRANSLATIONS[lang];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) el.setAttribute("placeholder", dict[key]);
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const isActive = btn.getAttribute("data-lang") === lang;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  document.documentElement.setAttribute("lang", lang);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyLanguage(btn.getAttribute("data-lang")));
  });

  // ---------- notify form ----------
  const form = document.getElementById("notify-form");
  const emailInput = document.getElementById("notify-email");
  const status = document.getElementById("notify-status");
  const submitBtn = form ? form.querySelector(".notify-submit") : null;

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const dict = TRANSLATIONS[currentLang];
      const email = emailInput.value.trim();

      if (!email || !emailInput.checkValidity()) {
        status.textContent = dict.invalidEmail;
        status.classList.add("error");
        return;
      }

      if (!NOTIFY_FORM_ENDPOINT || NOTIFY_FORM_ENDPOINT.includes("YOUR_FORM_ID")) {
        status.textContent = dict.notConfigured;
        status.classList.add("error");
        return;
      }

      status.classList.remove("error");
      status.textContent = dict.sending;
      if (submitBtn) submitBtn.disabled = true;

      try {
        const response = await fetch(NOTIFY_FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });

        if (response.ok) {
          status.textContent = dict.thanks;
          form.reset();
        } else {
          status.textContent = dict.error;
          status.classList.add("error");
        }
      } catch (err) {
        status.textContent = dict.error;
        status.classList.add("error");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // ---------- premium checkbox easter egg: 5 clicks reveals the sneak-peek panel ----------
  const premiumCheckbox = document.getElementById("premium-checkbox");
  const sneakPanel = document.getElementById("sneak-peek-panel");
  const sneakClose = document.getElementById("sneak-peek-close");
  const CLICKS_NEEDED = 5;
  const UNLOCK_KEY = "sneakPeekUnlocked";
  let premiumClicks = 0;

  function openSneakPanel() {
    if (!sneakPanel) return;
    sneakPanel.classList.add("open");
    sneakPanel.setAttribute("aria-hidden", "false");
    try {
      localStorage.setItem(UNLOCK_KEY, "1");
    } catch (err) {
      /* localStorage unavailable — panel still opens for this visit */
    }
  }

  function closeSneakPanel() {
    if (!sneakPanel) return;
    sneakPanel.classList.remove("open");
    sneakPanel.setAttribute("aria-hidden", "true");
  }

  if (premiumCheckbox) {
    // Listen on "change" (not "click") — clicking a <label> fires a click on
    // both the label and the checkbox it wraps, which would double-count.
    // "change" fires exactly once per real toggle.
    premiumCheckbox.addEventListener("change", () => {
      premiumClicks += 1;
      if (premiumClicks >= CLICKS_NEEDED) {
        openSneakPanel();
      }
    });
  }

  if (sneakClose) {
    sneakClose.addEventListener("click", closeSneakPanel);
  }

  try {
    if (localStorage.getItem(UNLOCK_KEY) === "1") {
      openSneakPanel();
    }
  } catch (err) {
    /* localStorage unavailable — easter egg just won't persist across visits */
  }
});
