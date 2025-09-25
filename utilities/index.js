// utilities/index.js
export function formatCurrencyUSD(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(Number(num))
}

export function buildVehicleListHTML(vehicles) {
  // возврат строки HTML для вставки в layout.body
  const items = vehicles.map(v => `
    <li class="vehicle-card">
      <a href="/cars/${v.inv_id}">
        <img src="${v.inv_image}" alt="${v.inv_make} ${v.inv_model}" class="card-img" />
        <div class="card-info">
          <h3>${v.inv_year} ${v.inv_make} ${v.inv_model}</h3>
          <p class="price">${formatCurrencyUSD(v.inv_price)}</p>
          <p class="miles">${formatNumber(v.inv_miles)} miles</p>
        </div>
      </a>
    </li>
  `).join('\n')

  return `
    <section class="vehicle-list-section">
      <h1>Available Vehicles</h1>
      <ul class="vehicle-list">
        ${items}
      </ul>
    </section>
  `
}

export function buildVehicleDetailHTML(v) {
  return `
    <article class="vehicle-detail">
      <div class="vehicle-media">
        <img src="${v.inv_image}" alt="${v.inv_make} ${v.inv_model} ${v.inv_year}" />
      </div>
      <div class="vehicle-info">
        <h1>${v.inv_year} ${v.inv_make} ${v.inv_model}</h1>
        <p class="vehicle-price">${formatCurrencyUSD(v.inv_price)}</p>
        <ul class="vehicle-meta">
          <li><strong>Mileage:</strong> ${formatNumber(v.inv_miles)} miles</li>
          <li><strong>Color:</strong> ${v.inv_color}</li>
        </ul>
        <section class="vehicle-desc">
          <h2>Description</h2>
          <p>${v.inv_description}</p>
        </section>
        <p><a href="/cars" class="btn">Back to Listings</a></p>
      </div>
    </article>
  `
}
