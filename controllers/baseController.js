// controllers/baseController.js

export default {
  // --- Главная страница ---
  buildHome(req, res) {
    res.render("index", {
      title: "Home",
      account: null,
      messages: [],
    })
  },

  // --- Страница About ---
  buildAbout(req, res) {
    res.render("about", {
      title: "About Us",
      account: null,
      messages: [],
    })
  },
}
