import { addUser, getAllUsers } from "../models/userModel.js";

export async function buildAddUserView(req, res) {
  res.render("users/add", { title: "Add User" });
}

export async function registerUser(req, res) {
  const { firstname, lastname, email, password } = req.body;

  try {
    await addUser(firstname, lastname, email, password);
    res.redirect("/users");
  } catch (err) {
    res.status(500).send("Error adding user.");
  }
}

export async function listUsers(req, res) {
  const users = await getAllUsers();
  res.render("users/list", { title: "User List", users });
}
