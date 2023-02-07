const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const {
  signUp,
  signIn,
  metaMaskLogin,
  updateProfile,
  verifyUser,
} = require("../../data-validation/user");
const adminAuth = require("../middleware/admin-auth");
const userAuth = require("../middleware/user-auth");

//Sign Up

router.post("/sign-up", signUp, UserController.userSignUp);

//Sign In

router.post("/sign-in", signIn, UserController.userSignIn);

//get Profile User

router.get("/get-profile", adminAuth, UserController.getProfile);

//Update Profile User

router.put(
  "/update-profile",
  userAuth,
  updateProfile,
  UserController.updateProfile,
);

// MetaMask Login

router.post("/login", metaMaskLogin, UserController.loginWithMetaMask);

// Get Bond With Pagination

router.get("/kyc-submitted", adminAuth, UserController.getUsers);

// Change Status User with id

router.put("/verify-user", adminAuth, verifyUser, UserController.verifyUser);

module.exports = router;
