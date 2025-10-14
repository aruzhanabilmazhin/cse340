// controllers/errorController.js

export function notFound(req, res) {
  res.status(404).render("errors/404", {
    title: "404 - Page Not Found",
    message: "The page you’re looking for doesn’t exist.",
    layout: "layouts/layout",
  });
}

export function serverError(err, req, res, next) {
  console.error("❌ Server error:", err.stack);
  res.status(500).render("errors/500", {
    title: "500 - Server Error",
    message: err.message || "Something went wrong on our server.",
    layout: "layouts/layout",
  });
}

export default { notFound, serverError };
