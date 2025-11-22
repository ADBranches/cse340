export function buildClassificationSelect(classifications, selectedId = null) {
  let html = `
    <div class="form-group">
      <label for="classification_id">Classification</label>
      <select id="classification_id" name="classification_id" required>
  `;

  classifications.forEach(c => {
    const selected = c.classification_id == selectedId ? "selected" : "";
    html += `<option value="${c.classification_id}" ${selected}>${c.classification_name}</option>`;
  });

  html += `</select></div>`;

  return html;
}
