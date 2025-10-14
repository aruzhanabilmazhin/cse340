// controllers/errorController.js

// 404 - Not Found
function notFound(req, res) {
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    account: null,
    messages: [],
  });
}

// 500 - Server Error
function serverError(err, req, res, next) {
  console.error("❌ Server error:", err.stack);
  res.status(500).render("errors/500", {
    title: "Server Error",
    account: null,
    messages: ["An unexpected error occurred. Please try again later."],
  });
}

// ✅ Экспорт по умолчанию (default)
export default {
  notFound,
  serverError,
};
