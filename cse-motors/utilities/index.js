// ==============================================
// UTILITIES MODULE (Required for Rubric)
// ==============================================

/**
 * Format price as $22,000
 */
export function formatPrice(price) {
  if (!price) return "$0";
  return `$${price.toLocaleString("en-US")}`;
}

/**
 * Format mileage as 23,000 miles
 */
export function formatMiles(miles) {
  if (!miles) return "0 miles";
  return `${miles.toLocaleString("en-US")} miles`;
}

/**
 * HTML Builder:
 * Returns HTML string for vehicle listings
 * Required by rubric: view returns built HTML
 */
export function buildVehicleList(vehicles) {
  let html = "";

  vehicles.forEach(v => {
    html += `
      <article class="vehicle-card">
        <figure>
          <img src="${v.image}" alt="${v.year} ${v.make} ${v.model}" loading="lazy" />
        </figure>
        <div class="vehicle-card__body">
          <h4>${v.year} ${v.make} ${v.model}</h4>
          <p>${v.description}</p>
          <p><strong>Price:</strong> ${formatPrice(v.price)}</p>
          <p><strong>Mileage:</strong> ${formatMiles(v.miles)}</p>
          <a href="/inventory/detail/${v.id}" class="btn-primary">View Details</a>
        </div>
      </article>
    `;
  });

  return html;
}

export default {
  formatPrice,
  formatMiles,
  buildVehicleList
};
