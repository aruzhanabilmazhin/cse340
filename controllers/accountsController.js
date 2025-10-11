import jwt from "jsonwebtoken";

// ====== Отображение формы входа ======
export const buildLogin = (req, res) => {
  res.render("account/login", { title: "Login", messages: req.flash("info") });
};

// ====== Обработка входа ======
export const processLogin = (req, res) => {
  const { email } = req.body;

  // ⚠️ Здесь обычно идёт проверка email + password из БД.
  // Пока используем тестового пользователя:
  const fakeUser = {
    account_id: 1,
    firstname: "Arujan",
    lastname: "Abilmajin",
    email,
    account_type: "Client", // может быть "Employee" или "Admin"
  };

  // Создаём JWT токен (срок — 2 часа)
  const token = jwt.sign(fakeUser, process.env.JWT_SECRET || "secret", {
    expiresIn: "2h",
  });

  // Сохраняем токен в cookie
  res.cookie("jwt", token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 });

  // Переходим на страницу управления аккаунтом
  res.redirect("/accounts/manage");
};

// ====== Страница управления аккаунтом ======
export const buildAccountManagement = (req, res) => {
  const account = res.locals.account;

  if (!account) {
    req.flash("info", "Please log in to view your account.");
    return res.redirect("/accounts/login");
  }

  res.render("account/manage", {
    title: "My Account",
    account,
  });
};

// ====== Выход ======
export const logout = (req, res) => {
  res.clearCookie("jwt");
  req.flash("info", "You have successfully logged out.");
  res.redirect("/");
};
