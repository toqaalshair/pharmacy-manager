console.log("✅ pharmacy routes loaded");

const { Router } = require("express");
const router = Router();
const {
  addpharmacy,
  updatepharmacy,
  removepharmacy,
  viewAllpharmacies,
  viewOnePharmacy: viewOne,
} = require("../Controllers");
router
  .post("/add", addpharmacy)
  .post("/update/:id", updatepharmacy)
  .post("/remove/:id", removepharmacy)
  .post("/viewAll", viewAllpharmacies)
  .post("/viewOne/:id", viewOne);

module.exports = router;
