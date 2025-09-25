// models/mockInventory.js
export const vehicles = [
  {
    inv_id: 1,
    inv_make: "Toyota",
    inv_model: "Camry",
    inv_year: 2018,
    inv_price: 18500,
    inv_miles: 45230,
    inv_color: "White",
    inv_image: "/images/car1.jpg",
    inv_description: "Reliable sedan, clean history, single owner."
  },
  {
    inv_id: 2,
    inv_make: "Honda",
    inv_model: "Civic",
    inv_year: 2019,
    inv_price: 17200,
    inv_miles: 37200,
    inv_color: "Blue",
    inv_image: "/images/car2.jpg",
    inv_description: "Low mileage, fuel efficient and comfortable."
  },
  {
    inv_id: 3,
    inv_make: "Ford",
    inv_model: "Escape",
    inv_year: 2017,
    inv_price: 14950,
    inv_miles: 60210,
    inv_color: "Gray",
    inv_image: "/images/car3.jpg",
    inv_description: "Compact SUV, great family car."
  }
]

export function getAllVehicles() {
  return vehicles
}

export function getVehicleById(id) {
  const num = Number(id)
  return vehicles.find(v => v.inv_id === num) || null
}
