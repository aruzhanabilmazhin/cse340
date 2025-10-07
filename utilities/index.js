import * as invModel from "../models/inventory-model.js";

// --- Build vehicle detail HTML ---
export function buildVehicleDetailView(vehicle) {
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(vehicle.inv_price || 0);

  const mileage = vehicle.inv_miles ? vehicle.inv_miles.toLocaleString("en-US") : "0";

  return `
    <section class="vehicle-detail">
      <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
      <img src="${vehicle.inv_image || '/images/no-image.png'}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      <div class="vehicle-info">
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Mileage:</strong> ${mileage} miles</p>
        <p><strong>Description:</strong> ${vehicle.inv_description || 'No description available'}</p>
      </div>
    </section>
  `;
}

// --- Build classification select list ---
export async function buildClassificationList(selectedId = null) {
  const data = await invModel.getClassifications();
  let classificationList = '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";

  data.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`;
    if (selectedId != null && row.classification_id === selectedId) {
      classificationList += " selected";
    }
    classificationList += `>${row.classification_name}</option>`;
  });

  classificationList += "</select>";
  return classificationList;
}
