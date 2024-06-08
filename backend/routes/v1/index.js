const express = require("express");
const authRoutes = require("./authRoutes");
const problemRoutes = require("./problemRoutes")
const cookieParser = require("cookie-parser")
const router = express.Router();
router.use(cookieParser());

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/problems",
    route: problemRoutes
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
