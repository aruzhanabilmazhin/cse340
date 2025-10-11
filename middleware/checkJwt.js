import jwt from "jsonwebtoken";

export function checkJwt(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    res.locals.account = null;
    return next();
  }

  try {
    const account = jwt.verify(token, process.env.JWT_SECRET || "secret");
    res.locals.account = account;
  } catch (err) {
    res.locals.account = null;
  }

  next();
}
