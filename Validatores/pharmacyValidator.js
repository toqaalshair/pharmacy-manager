const joi = require("@hapi/joi");
const pharmacySchema = joi.object({
  pharmName: joi.string().min(3).required(),
  address: joi.string().min(15).required(),
});
module.exports = {pharmacySchema};
