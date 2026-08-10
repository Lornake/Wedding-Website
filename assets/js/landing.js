// ---------- translations for the landing directory ----------
const TRANSLATIONS = {
  en: {
    eyebrow: "Puglia, Italy",
    tagline: "Everything you need for the trip, all in one place.",
    navMap: "Map",
    navMapNote: "Venue, sights, and stops",
    navCalendar: "Calendar",
    navCalendarNote: "Day-by-day schedule",
    navFaq: "FAQ",
    navFaqNote: "Common questions",
    navRsvp: "RSVP",
    navRsvpNote: "Let us know you're coming",
    navInstructions: "Instructions",
    navInstructionsNote: "Travel & logistics",
    navRegistry: "Registry",
    navRegistryNote: "Gift ideas",
  },
  it: {
    eyebrow: "Puglia, Italia",
    tagline: "Tutto quello che serve per il viaggio, in un unico posto.",
    navMap: "Mappa",
    navMapNote: "Location, luoghi e tappe",
    navCalendar: "Calendario",
    navCalendarNote: "Programma giorno per giorno",
    navFaq: "FAQ",
    navFaqNote: "Domande frequenti",
    navRsvp: "RSVP",
    navRsvpNote: "Faccelo sapere se ci sarai",
    navInstructions: "Istruzioni",
    navInstructionsNote: "Viaggio e logistica",
    navRegistry: "Lista nozze",
    navRegistryNote: "Idee regalo",
  },
};

function applyLanguage(lang) {
  const dict = TRANSLATIONS[lang];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
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
});
