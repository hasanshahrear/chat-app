// external imports
const express = require("express");

// internal imports
const { getLogin, login } = require("../controller/loginController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const {
  doLoginValidationHandler,
  doLoginValidators,
} = require("../middlewares/login/loginValidators");

const router = express.Router();

// page title
const pageTitle = "Login";

// login  page
router.get("/", decorateHtmlResponse(pageTitle), getLogin);

// process login
router.post(
  "/",
  decorateHtmlResponse(pageTitle),
  doLoginValidators,
  doLoginValidationHandler,
  login
);

module.exports = router;
