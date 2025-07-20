const {pharmacySchema} = require("./pharmacyValidator");
const { signupValidator, loginValidator } = require("./userValidator");
const {alternativeDrugValidator}=require('./alternativeDrugValidator')

module.exports = {
  signupValidator: signupValidator,
  loginValidator: loginValidator,
  pharmacySchema: pharmacySchema,
  alternativeDrugValidator:alternativeDrugValidator
};
