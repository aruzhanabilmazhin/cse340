import express from "express";
import * as accountsController from "../controllers/accountsController.js";

const router = express.Router();

// ====== Страница входа ======
router.get("/login", accountsController.buildLogin);

// ====== Обработка входа ======
router.post("/login", accountsController.processLogin);

// ====== Страница управления аккаунтом ======
router.get("/manage", accountsController.buildAccountManagement);

// ====== Выход ======
router.get("/logout", accountsController.logout);

export default router;
