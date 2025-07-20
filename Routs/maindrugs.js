console.log("✅ mdrug routes loaded");

const { Router } = require("express");
const router = Router();
const {
  addmdrug,
  updatemdrug,
  removemdrug,
  viewAllmdrugs,
  viewOnemdrug,
} = require("../Controllers");
router
  .post("/add", addmdrug)
  .post("/update/:id", updatemdrug)
  .post("/remove/:id", removemdrug)
  .post("/viewAll", viewAllmdrugs)
  .post("/viewOne/:id", viewOnemdrug);

module.exports = router;
