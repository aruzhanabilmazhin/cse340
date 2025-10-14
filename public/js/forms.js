// public/js/forms.js
// Client-side form validation

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      let valid = true;
      const requiredFields = form.querySelectorAll("[required]");

      requiredFields.forEach((field) => {
        const errorId = `${field.id || field.name}-error`;
        let errorElement = document.getElementById(errorId);

        if (!errorElement) {
          errorElement = document.createElement("small");
          errorElement.id = errorId;
          errorElement.style.color = "red";
          field.insertAdjacentElement("afterend", errorElement);
        }

        if (!field.value.trim()) {
          errorElement.textContent = "This field is required.";
          valid = false;
        } else if (field.type === "email" && !/^[^@]+@[^@]+\.[^@]+$/.test(field.value)) {
          errorElement.textContent = "Please enter a valid email.";
          valid = false;
        } else if (field.name === "password" && field.value.length < 8) {
          errorElement.textContent = "Password must be at least 8 characters.";
          valid = false;
        } else {
          errorElement.textContent = "";
        }
      });

      if (!valid) {
        event.preventDefault();
      }
    });
  });
});
