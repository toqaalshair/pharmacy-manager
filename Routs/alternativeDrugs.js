console.log("✅ mdrug routes loaded");

const { Router } = require("express");
const router = Router();
const {
  addaltdrug,
  updatealtdrug,
  removealtdrug,
  viewAllaltdrug,
  viewOnealtdrug,
} = require("../Controllers");
router
  .post("/add", addaltdrug)
  .post("/update/:id", updatealtdrug)
  .post("/remove/:id", removealtdrug)
  .post("/viewAll", viewAllaltdrug)
  .post("/viewOne/:id", viewOnealtdrug);

module.exports = router;
