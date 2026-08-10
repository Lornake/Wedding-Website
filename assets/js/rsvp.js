/* ============================================================
   RSVP form: submits privately to Formspree (only you see the
   answers, in your Formspree inbox/email — nothing is written
   to this repo). A separate, keyless counter service tracks
   only the total NUMBER of RSVPs, not their contents, so the
   page can show a public headcount without exposing any of the
   personal fields.
   ============================================================ */

const COUNTER_NAMESPACE = "wedding-rsvp-kayla-lorenzo"; // edit in site-config.js if you want a different namespace
const COUNTER_KEY = "rsvps";

async function fetchCount() {
  try {
    const res = await fetch(`https://api.countapi.xyz/get/${COUNTER_NAMESPACE}/${COUNTER_KEY}`);
    if (!res.ok) throw new Error("count fetch failed");
    const data = await res.json();
    return typeof data.value === "number" ? data.value : 0;
  } catch (err) {
    return null;
  }
}

async function incrementCount() {
  try {
    const res = await fetch(`https://api.countapi.xyz/hit/${COUNTER_NAMESPACE}/${COUNTER_KEY}`);
    if (!res.ok) throw new Error("count hit failed");
    const data = await res.json();
    return typeof data.value === "number" ? data.value : null;
  } catch (err) {
    return null;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const counterEl = document.getElementById("rsvp-counter-number");
  if (counterEl) {
    const count = await fetchCount();
    counterEl.textContent = count === null ? "?" : String(count);
  }

  const form = document.getElementById("rsvp-form");
  const status = document.getElementById("rsvp-status");
  const confirmWarning = document.getElementById("rsvp-confirm-warning");
  const submitBtn = form ? form.querySelector(".rsvp-submit") : null;
  const sensitiveFields = form ? Array.from(form.querySelectorAll("[data-sensitive='true']")) : [];

  if (!form) return;

  // If someone edits a sensitive field after the warning is shown, require
  // them to re-confirm rather than letting a stale confirmation slip through.
  let confirmed = false;
  sensitiveFields.forEach((field) => {
    field.addEventListener("input", () => {
      confirmed = false;
      if (confirmWarning) confirmWarning.hidden = true;
    });
  });

  function anySensitiveFieldFilled() {
    return sensitiveFields.some((field) => field.value.trim() !== "");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.classList.remove("error");

    const firstName = document.getElementById("rsvp-first-name").value.trim();
    if (!firstName) {
      status.textContent = "We at least need a first name to RSVP you!";
      status.classList.add("error");
      return;
    }

    if (!confirmed && anySensitiveFieldFilled()) {
      if (confirmWarning) confirmWarning.hidden = false;
      status.textContent = "Hit \u201cSend RSVP\u201d again to confirm, or clear those fields.";
      confirmed = true; // next submit goes through
      return;
    }

    if (typeof RSVP_FORM_ENDPOINT === "undefined" || RSVP_FORM_ENDPOINT.includes("YOUR_FORM_ID")) {
      status.textContent = "RSVP submissions aren't connected yet — check back soon.";
      status.classList.add("error");
      return;
    }

    status.textContent = "Sending…";
    if (submitBtn) submitBtn.disabled = true;

    try {
      const response = await fetch(RSVP_FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (response.ok) {
        status.textContent = "Thank you — we've got your RSVP!";
        form.reset();
        confirmed = false;
        if (confirmWarning) confirmWarning.hidden = true;
        const newCount = await incrementCount();
        if (newCount !== null && counterEl) counterEl.textContent = String(newCount);
      } else {
        status.textContent = "Something went wrong — try again in a moment.";
        status.classList.add("error");
      }
    } catch (err) {
      status.textContent = "Something went wrong — try again in a moment.";
      status.classList.add("error");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});
