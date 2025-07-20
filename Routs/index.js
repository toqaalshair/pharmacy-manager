console.log("✅ routes/index.js loaded");

const express = require("express");
const authRouters = require("./auth");
const pharmacyRouters = require("./pharmacy");
const maindrugRouters = require("./maindrugs");
const altdrugRouters = require("./alternativeDrugs");
const auth = require("../MiddleWares/auth");
module.exports = (app) => {
  app.use("/auth", authRouters);
  app.use("/pharmacy", auth, pharmacyRouters);
  app.use("/maindrugs", auth, maindrugRouters);
  app.use("/altdrugs", auth, altdrugRouters);
};
