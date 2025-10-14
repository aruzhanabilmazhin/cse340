// controllers/errorController.js
const errorController = {
  notFound: (req, res) => {
    res.status(404).render("errors/404", {
      title: "404 - Not Found",
      account: null,
      messages: [],
      message: "The page you are looking for does not exist.",
    });
  },

  serverError: (err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).render("errors/500", {
      title: "500 - Server Error",
      account: null,
      messages: [],
      message: err.message || "Something went wrong on the server.",
    });
  },
};

export default errorController;
