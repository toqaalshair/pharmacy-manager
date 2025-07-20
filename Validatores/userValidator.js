const joi = require("@hapi/joi");
const signupValidator = joi.object({
  userName: joi.string().min(4).max(25).alphanum().required(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/))
    .required(),
});
const loginValidator = joi.object({
  userName: joi.string().min(4).max(25).alphanum().required(),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/))
    .required(),
});
module.exports = { signupValidator, loginValidator };
