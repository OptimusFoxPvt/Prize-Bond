require("express-async-errors");
const express = require("express");
const error = require("../middleware/error");
const User = require("./user.route");
const Bond = require("./bond.route");

module.exports = function (app) {
  app.use(express.json());

  //middlewares
  app.use(express.static("public"));

  // routes
  app.use("/api/user", User);
  app.use("/api/bond", Bond);

  app.use(error);
};
