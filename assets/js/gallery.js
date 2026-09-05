// ---- Configuration ----
// These are meant to be public/client-side values — that's how Supabase's
// anon/publishable key is designed to work. Access is controlled by the
// bucket policies you set up in the Supabase dashboard, not by hiding this key.
const SUPABASE_URL = "https://urywwodnoibfmhfspwvr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyeXd3b2Rub2liZm1oZnNwd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2Mzc1OTQsImV4cCI6MjEwNDIxMzU5NH0.Cag1EmykkkBKmJlpzM9evFIqJOm2wpMi-qQd1YhdP6Y";
const BUCKET_NAME = "wedding-photos";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const galleryGrid = document.getElementById("gallery-grid");
const uploadBtn = document.getElementById("upload-btn");
const photoInput = document.getElementById("photo-input");
const statusEl = document.getElementById("upload-status");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? "#c0392b" : "";
}

function uniqueFileName(originalName) {
  const ext = originalName.includes(".") ? originalName.split(".").pop() : "jpg";
  const id = window.crypto && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${id}.${ext}`;
}

async function uploadFiles(fileList) {
  const files = Array.from(fileList || []);
  if (files.length === 0) return;

  uploadBtn.disabled = true;
  let successCount = 0;

  for (const file of files) {
    setStatus(`Uploading ${file.name}...`);
    const fileName = uniqueFileName(file.name);

    const { error } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) {
      setStatus(`Couldn't upload ${file.name}: ${error.message}`, true);
    } else {
      successCount++;
    }
  }

  uploadBtn.disabled = false;
  photoInput.value = "";

  if (successCount > 0) {
    setStatus(`Uploaded ${successCount} photo${successCount > 1 ? "s" : ""}!`);
    loadGallery();
  }
}

uploadBtn.addEventListener("click", () => uploadFiles(photoInput.files));

async function loadGallery() {
  const { data, error } = await supabaseClient.storage
    .from(BUCKET_NAME)
    .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });

  if (error) {
    galleryGrid.innerHTML = `<p class="gallery-empty">Couldn't load photos: ${error.message}</p>`;
    return;
  }

  const files = (data || []).filter((f) => f.name !== ".emptyFolderPlaceholder");

  if (files.length === 0) {
    galleryGrid.innerHTML = `<p class="gallery-empty">No photos yet — be the first to add one!</p>`;
    return;
  }

  galleryGrid.innerHTML = "";
  for (const file of files) {
    const { data: urlData } = supabaseClient.storage.from(BUCKET_NAME).getPublicUrl(file.name);
    const img = document.createElement("img");
    img.src = urlData.publicUrl;
    img.alt = "Wedding guest photo";
    img.loading = "lazy";
    img.addEventListener("click", () => {
      lightboxImg.src = urlData.publicUrl;
      lightbox.classList.add("active");
    });
    galleryGrid.appendChild(img);
  }
}

lightbox.addEventListener("click", () => {
  lightbox.classList.remove("active");
  lightboxImg.src = "";
});

loadGallery();
