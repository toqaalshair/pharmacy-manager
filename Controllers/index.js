const { sgin, login,logout } = require("./auth");
const pharmacy=require('./pharmacy')
const maindrugs=require('./maindrugs')
const alternativeDrugs = require("./alternativeDrugs");
module.exports = {
  sign: sgin,
  login: login,
  logout:logout,

  addpharmacy: pharmacy.add,
  updatepharmacy: pharmacy.update,
  removepharmacy: pharmacy.remove,
  viewAllpharmacies: pharmacy.viewAll,
  viewOnePharmacy: pharmacy.viewOne,

  addmdrug: maindrugs.add,
  updatemdrug: maindrugs.update,
  removemdrug: maindrugs.remove,
  viewAllmdrugs: maindrugs.viewAll,
  viewOnemdrug: maindrugs.viewOne,

  addaltdrug: alternativeDrugs.add,
  updatealtdrug: alternativeDrugs.update,
  removealtdrug: alternativeDrugs.remove,
  viewAllaltdrug: alternativeDrugs.viewAll,
  viewOnealtdrug: alternativeDrugs.viewOne,
  
};
