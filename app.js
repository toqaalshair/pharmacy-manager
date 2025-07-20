const express = require("express");
const routes = require("./Routs");
const app = express();
const { returnjson } = require("./json_responces");
global.returnjson = returnjson;
app.use(express.json());
process.on("unhandledRejection", (reson) => {
  console.log("****unhandledRejection****", reson.message);
  process.exit(1);
});
console.log("✅ app.js loaded");
routes(app);
app.use((req, res, next) => {
  next();
});
app.use((error, req, res, next) => {
  return returnjson(res, 500, false, error.message, null);
});

module.exports = app;
