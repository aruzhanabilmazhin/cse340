import express from "express";
import {
  buildLogin,
  processLogin,
  buildRegister,
  processRegister,
  buildAccountManagement,
  logout
} from "../controllers/accountsController.js";

const router = express.Router();

router.get("/login", buildLogin);
router.post("/login", processLogin);

router.get("/register", buildRegister);
router.post("/register", processRegister);

router.get("/manage", buildAccountManagement);
router.get("/logout", logout);

export default router;
