// --- Build classification select list ---
export async function buildClassificationList(selectedId = null) {
  const data = await invModel.getClassifications(); // data.rows ожидается
  let classificationList = '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";

  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`;
    if (selectedId != null && row.classification_id == selectedId) { // сравниваем как числа
      classificationList += " selected";
    }
    classificationList += `>${row.classification_name}</option>`;
  });

  classificationList += "</select>";
  return classificationList;
}
