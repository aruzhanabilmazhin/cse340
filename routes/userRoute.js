import express from "express";
import { buildAddUserView, registerUser, listUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/", listUsers);
router.get("/add", buildAddUserView);
router.post("/add", registerUser);

export default router;
