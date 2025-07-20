const createError = require("http-errors");
const User = require("../Modles/User"); 
const jwt=require('jsonwebtoken')
const {readFileSync}=require('fs')

const sgin = async (req, res, next) => {
  const userData = req.body;

  // Validate
  const validate = User.validate(userData);
  if (validate.error) {
    return next(createError(400, validate.error.message));
  }
  console.log("Validation done");

  // Check existence
  const user = new User(userData);
  try {
    const existResult = await user.isExist();
    if (existResult.check) {
      return next(createError(409, existResult.message));
    }
  } catch (err) {
    return next(createError(500, err.message));
  }
  console.log("Existence check done");

  // Save
  try {
    const saveResult = await user.save();
    if (!saveResult.status) {
      return next(createError(500, saveResult.message));
    }
    return returnjson(res, 201, true, "User created successfully", null);

  } catch (err) {
    next(createError(500, err.message));
  }
};

const login = async (req, res, next) => {
  try {
    const logResult = await User.login(req.body);
    console.log(logResult);
    
    if (!logResult.status) {
      return next(createError(logResult.code, logResult.message));
    }

    // const secretKey=readFileSync('./Configurations/private.key')
    const secretKey = process.env.PRIVATKEY;
    const userToken=jwt.sign({_id:logResult.data._id},secretKey)
    return returnjson(res, 200, true, logResult.message, {userToken});

  } catch (error) {
    return next(createError(500, error.message));
  }
};
const logout=async(req,res,next)=>{
  try {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(createError(400, "No token to logout"));
    }

    const result = await User.logout(token);
    if (result.status) {
      return returnjson(res,200,result.message,null)
    } else {
      return next(createError(500, result.message));
    }
  } catch (error) {
    return next(createError(500, err.message));
  }
}

module.exports = { sgin, login,logout };
