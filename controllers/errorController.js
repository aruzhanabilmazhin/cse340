// controllers/errorController.js

const errorController = {};

errorController.notFound = (req, res) => {
  res.status(404).render("errors/404", {
    title: "404 - Page Not Found",
    message: "Sorry, the page you are looking for does not exist.",
  });
};

errorController.serverError = (err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).render("errors/500", {
    title: "500 - Server Error",
    message: "Something went wrong on the server. Please try again later.",
  });
};

module.exports = errorController;
