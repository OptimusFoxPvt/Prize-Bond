const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use("/public", express.static(__dirname + "/public"));
app.use(express.json());

app.set("views", path.join(__dirname, "public"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.json("Welcome to PrizeBond Backend!");
});

require("./config/db")();
require("./config/cors")(app);
require("./config/morgan")(app);
require("./api/routes/index.routes")(app);

const port = process.env.PORT || 4000;

const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`),
);

module.exports = server;
