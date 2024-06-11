const express = require("express");
const authController = require("../../controllers/authController");
const cookieParser = require("cookie-parser")
const auth = require("../../../compiler/middlewares/auth");

const router = express.Router();

router.use(cookieParser());


router.post("/register", authController.signup);

router.post("/login", authController.login);

router.post("/logout", auth, authController.logout);

module.exports = router;
