export function checkEmployee(req, res, next) {
  const account = res.locals.account;

  if (!account || (account.account_type !== "Employee" && account.account_type !== "Admin")) {
    req.flash("info", "You must be an employee or admin to access this area.");
    return res.redirect("/accounts/login");
  }

  next();
}
