// utilities/index.js
import inventoryModel from "../models/inventory-model.js";
export { testdriveRules, checkTestdriveData } from "./testdrive-validation.js";

/**
 * Wrap async controllers so errors go to next()
 * instead of crashing the app.
 */
function handleErrors(controller) {
  return async function (req, res, next) {
    try {
      await controller(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Building the HTML for a single vehicle detail view.
 * - Uses formatted price in USD
 * - Uses formatted mileage with commas
 * - Normalizes image path to /images/vehicles/*.webp
 */
function buildVehicleDetailGrid(vehicle) {
  if (!vehicle) {
    return '<p class="notice">Vehicle details are not available.</p>';
  }

  // Format price as USD: $25,000.00
  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
  const price = priceFormatter.format(Number(vehicle.inv_price || 0));

  // Format mileage with commas: 101,222
  const miles = new Intl.NumberFormat("en-US").format(
    Number(vehicle.inv_miles || 0)
  );

  // Normalize image path to /images/vehicles/*.webp
  const rawImagePath = vehicle.inv_image || "";

  // Ensure path is under /images/vehicles/
  let imagePath = rawImagePath.includes("/vehicles/")
    ? rawImagePath
    : rawImagePath.replace("/images/", "/images/vehicles/");

  // If DB still has .jpg/.jpeg/.png, silently switch to .webp
  if (!imagePath.toLowerCase().endsWith(".webp")) {
    imagePath = imagePath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  }

  // Fallback if somehow still empty
  if (!imagePath) {
    imagePath = "/images/vehicles/v1/no-image.png";
  }

  // Build HTML string
  return `
    <section class="vehicle-detail" aria-labelledby="vehicle-title">
      <div class="vehicle-detail__grid">
        <div class="vehicle-detail__info">
          <h2 id="vehicle-title" class="vehicle-detail__title">
            ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}
          </h2>

          <p class="vehicle-detail__price">${price}</p>
          <p class="vehicle-detail__miles">${miles} miles</p>

          <p class="vehicle-detail__description">
            ${vehicle.inv_description}
          </p>

          <ul class="vehicle-detail__meta">
            <li><strong>Color:</strong> ${vehicle.inv_color}</li>
            <li><strong>Classification ID:</strong> ${vehicle.classification_id}</li>
          </ul>
        </div>

        <div class="vehicle-detail__image-wrapper">
          <img
            src="${imagePath}"
            alt="Image of ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}"
            class="vehicle-detail__image"
          />
        </div>
      </div>
    </section>
  `;
}

async function buildClassificationList(selectedId = null) {
  const classifications = await inventoryModel.getClassifications();

  let options = '<option value="">Choose a Classification</option>';

  classifications.forEach((row) => {
    const selected =
      Number(selectedId) === Number(row.classification_id) ? " selected" : "";
    options += `<option value="${row.classification_id}"${selected}>${row.classification_name}</option>`;
  });

  return `
    <select id="classification_id" name="classification_id" required>
      ${options}
    </select>
  `;
}

const utilities = {
  handleErrors,
  buildVehicleDetailGrid,
  buildClassificationList,
};

export default utilities;
