// utilities/index.js

/**
 * Building the HTML for a single vehicle detail view.
 * - Uses formatted price in USD
 * - Uses formatted mileage with commas
 * - Includes year, make, model, description, image, and basic meta fields
 *
 * This is the "new custom function" required in utilities > index.js
 * for the Vehicle Detail assignment.
 */
export function buildVehicleDetailGrid(vehicle) {
  if (!vehicle) {
    return '<p class="notice">Vehicle details are not available.</p>';
  }

  // Formatting price as USD: $25,000.00
  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
  const price = priceFormatter.format(Number(vehicle.inv_price || 0));

  // Formatting mileage with commas: 101,222
  const miles = new Intl.NumberFormat("en-US").format(
    Number(vehicle.inv_miles || 0)
  );

  const rawImagePath = vehicle.inv_image || "";
  const imagePath = rawImagePath
    ? rawImagePath.includes("/vehicles/")
      ? rawImagePath
      : rawImagePath.replace("/images/", "/images/vehicles/")
    : "/images/vehicles/no-image.png";

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
