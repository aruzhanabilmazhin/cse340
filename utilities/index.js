import * as invModel from "../models/inventory-model.js";

export function buildVehicleDetailView(vehicle) {
  const price = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(vehicle.inv_price || 0);
  const mileage = vehicle.inv_miles ? vehicle.inv_miles.toLocaleString("en-US") : "0";
  return `
    <section class="vehicle-detail">
      <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
      <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
      <div class="vehicle-info">
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Mileage:</strong> ${mileage} miles</p>
        <p><strong>Description:</strong> ${vehicle.inv_description || 'No description'}</p>
      </div>
    </section>
  `;
}

export async function buildClassificationList(selectedId = null) {
  const data = await invModel.getClassifications();
  let list = '<select name="classification_id" id="classificationList" required>';
  list += '<option value="">Choose a Classification</option>';
  data.forEach(c => {
    list += `<option value="${c.classification_id}"${selectedId == c.classification_id ? ' selected' : ''}>${c.classification_name}</option>`;
  });
  list += '</select>';
  return list;
}
