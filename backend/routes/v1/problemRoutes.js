
const problemController = require('../../controllers/problemController')
const express = require("express");
const cookieParser = require("cookie-parser")
const auth = require("../../middlewares/auth");


const router = express.Router();

router.use(cookieParser());

router.get('/all', auth, problemController.getAllProblems)
router.get('/:id', auth, problemController.getProblemById);


module.exports = router