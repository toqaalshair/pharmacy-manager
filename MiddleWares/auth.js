console.log("🔐 reached auth middleware");
const createError = require("http-errors");
const { readFileSync } = require("fs");
const jwt = require("jsonwebtoken");
const {User}=require('../Modles')
module.exports =async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return next(createError(404));
  }
  const userToken = authHeader.split(" ")[1];
  const secretKey = process.env.PRIVATKEY;

  const isLogedin = await User.isLogedin(userToken);
  if (!isLogedin.status) {
    return next(createError(401, isLogedin.message));
  }
  try {
    const decode = jwt.verify(userToken, secretKey);
    req._user_id = decode._id;
    return next()
  } catch (error) {
    return next(createError(404));
  }
};
