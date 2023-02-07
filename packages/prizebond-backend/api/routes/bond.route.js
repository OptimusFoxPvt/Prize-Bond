const express = require("express");
const router = express.Router();
const BondController = require("../controllers/bond.controller");
const adminAuth = require("../middleware/admin-auth");
const userAuth = require("../middleware/user-auth");
const upload = require("../../helpers/multer");

//Create Bond
router.post(
  "/",
  adminAuth,
  upload.any(),
  createBond,
  BondController.createBond,
);

// Send New Limit
router.get("/get-series/:type", adminAuth, BondController.sendSeries);

module.exports = router;
