// ===========================================
// CSE Motors - Main JavaScript
// Enhancement layer for UI interactions
// ===========================================

console.log("main.js loaded successfully.");


// ==================================================
// DRAG & DROP IMAGE UPLOAD SYSTEM
// ==================================================

function setupUploader(dropzoneId, previewId, hiddenFieldId) {
  const dropzone = document.getElementById(dropzoneId);
  const preview = document.getElementById(previewId);
  const hiddenField = document.getElementById(hiddenFieldId);

  if (!dropzone || !preview || !hiddenField) return;

  // Create hidden file input
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.hidden = true;
  document.body.appendChild(fileInput);

  // CLICK → open file dialog
  dropzone.addEventListener("click", () => fileInput.click());

  // DIALOG → file selected
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      processFile(fileInput.files[0], preview, hiddenField);
    }
  });

  // DRAG OVER
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#4B0082";
  });

  // DRAG LEAVE
  dropzone.addEventListener("dragleave", () => {
    dropzone.style.borderColor = "#999";
  });

  // DROP → upload
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#999";

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file, preview, hiddenField);
    }
  });
}


// Process file → convert to Base64 → preview → store in hidden input
function processFile(file, previewEl, hiddenField) {
  const reader = new FileReader();

  reader.onload = () => {
    previewEl.src = reader.result;
    previewEl.style.display = "block";
    hiddenField.value = reader.result;
  };

  reader.readAsDataURL(file);
}


// Initialize uploaders
document.addEventListener("DOMContentLoaded", () => {
  setupUploader("imageDropzone", "imagePreview", "inv_image");
  setupUploader("thumbDropzone", "thumbPreview", "inv_thumbnail");
});
