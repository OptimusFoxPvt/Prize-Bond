const { body } = require("express-validator");

exports.signUp = [
  body("firstName").trim().notEmpty().withMessage("firstName is required!"),
  body("lastName").trim().notEmpty().withMessage("lastName is required!"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required!")
    .isEmail()
    .withMessage("email is invalid!"),
  body("password").trim().notEmpty().withMessage("password is required!"),
];

exports.signIn = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required!")
    .isEmail()
    .withMessage("email is invalid!"),
  body("password").trim().notEmpty().withMessage("password is required!"),
];

exports.metaMaskLogin = [
  body("metaMaskAddress")
    .trim()
    .notEmpty()
    .withMessage("metaMaskAddress is required!"),
];

exports.updateProfile = [
  body("name").trim().notEmpty().withMessage("name is required!"),
  body("phone").trim().notEmpty().withMessage("phone is required!"),
  body("cnic").trim().notEmpty().withMessage("cnic is required!"),
  body("dob").trim().notEmpty().withMessage("dob is required!"),
];

exports.verifyUser = [
  body("userId").trim().notEmpty().withMessage("userId is required!"),
  body("isVerified").notEmpty().withMessage("isVerified is required!"),
];
