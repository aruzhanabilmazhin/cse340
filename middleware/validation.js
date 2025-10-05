// Проверка классификации
export const checkClassification = (req, res, next) => {
  const { classification_name } = req.body;
  const regex = /^[A-Za-z0-9]+$/; // только буквы и цифры
  if (!classification_name || !regex.test(classification_name)) {
    req.flash("errors", "Invalid classification name!");
    return res.redirect("/inv/classification/add");
  }
  next();
};

// Проверка инвентаря
export const checkInventory = (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_price, classification_id } = req.body;
  if (!inv_make || !inv_model || !inv_year || !inv_price || !classification_id) {
    req.flash("errors", "All fields are required!");
    return res.redirect("/inv/add");
  }
  next();
};
