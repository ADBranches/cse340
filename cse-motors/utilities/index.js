// ==============================================
// UTILITIES MODULE (Required for Rubric)
// ==============================================

/**
 * Navigation Builder
 * Returns navigation HTML used in layout.ejs
 */
export function getNav() {
  return `
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/inv">Inventory</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  `;
}

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
 * Required for the rubric: builds dynamic HTML
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

/**
 * Export as an object for app.locals.utils
 */
export default {
  getNav,
  formatPrice,
  formatMiles,
  buildVehicleList
};
