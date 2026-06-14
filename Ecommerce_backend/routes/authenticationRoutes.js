const express = require("express");

const router = express.Router();
const {  body } = require( "express-validator");

const validate = require("../middleware/Validate");
const {register, login} = require("../controllers/authenticationController");

router.post("/register",body("email").isEmail().normalizeEmail(),validate,register);
router.post("/login",body("email").isEmail().normalizeEmail(),body("password").isLength({ min: 6 }),validate,login);

module.exports = router;