import jwt from "jsonwebtoken";

// ====== Отображение формы входа ======
export const buildLogin = (req, res) => {
  res.render("account/login", { title: "Login", messages: req.flash("info") });
};

// ====== Отображение формы регистрации ======
export const buildRegister = (req, res) => {
  res.render("account/register", { title: "Register", messages: req.flash("info") });
};

// ====== Обработка регистрации ======
export const processRegister = (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // ⚠️ Обычно здесь — запись в базу данных, хэш пароля и т. д.
  // Пока просто имитация успешной регистрации:
  req.flash("info", "Registration successful! You can now log in.");
  res.redirect("/accounts/login");
};

// ====== Обработка входа ======
export const processLogin = (req, res) => {
  const { email } = req.body;

  // ⚠️ Тестовый пользователь
  const fakeUser = {
    account_id: 1,
    firstname: "Arujan",
    lastname: "Abilmajin",
    email,
    account_type: "Client",
  };

  // JWT токен на 2 часа
  const token = jwt.sign(fakeUser, process.env.JWT_SECRET || "secret", {
    expiresIn: "2h",
  });

  res.cookie("jwt", token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 });
  res.redirect("/accounts/manage");
};

// ====== Страница управления аккаунтом ======
export const buildAccountManagement = (req, res) => {
  const account = res.locals.account;

  if (!account) {
    req.flash("info", "Please log in to view your account.");
    return res.redirect("/accounts/login");
  }

  res.render("account/manage", { title: "My Account", account });
};

// ====== Выход ======
export const logout = (req, res) => {
  res.clearCookie("jwt");
  req.flash("info", "You have successfully logged out.");
  res.redirect("/");
};
