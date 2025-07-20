const { dbConnection } = require("../Configurations");
const { signupValidator, loginValidator } = require("../Validatores");
const { hashSync, compareSync } = require("bcryptjs");

class User {
  constructor(userData) {
    this.userData = userData;
  }

  static validate(userData) {
    return signupValidator.validate(userData);
  }

  isExist() {
    return new Promise((resolve, reject) => {
      dbConnection("users", async (collection) => {
        try {
          const user = await collection.findOne({});
          if (!user) {
            resolve({ check: false });
          } else {
            resolve({
              check: true,
              message: "Admin already exists. Only one admin allowed.",
            });
          }
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      dbConnection("users", async (collection) => {
        try {
          const hpassword = hashSync(this.userData.password);
          this.userData.password = hpassword;
          const result = await collection.insertOne(this.userData);
          if (result.insertedId) {
            resolve({ status: true, message: "User inserted successfully" });
          } else {
            resolve({ status: false, message: "User insert failed" });
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  }
  static login(loginData) {
    return new Promise((resolve, reject) => {
      dbConnection("users", async (collection) => {
        try {
          const validate = loginValidator.validate(loginData);
          if (validate.error) {
            return resolve({
              status: false,
              code: 400,
              message: validate.error.message,
            });
          }
          const loginuser = await collection.findOne(
            {
              userName: loginData.userName,
            },
            {
              projection: { userName: 1, password: 1, _id: 1 },
            }
          );
          if (loginuser) {
            if (!compareSync(loginData.password, loginuser.password)) {
              return resolve({
                status: false,
                code: 401,
                message: "login failed np",
              });
            } else {
              return resolve({
                status: true,
                data: loginuser,
                message: "Login successfully",
              });
            }
          } else {
            return resolve({
              status: false,
              message: "Login failed nu",
            });
          }
        } catch (err) {
          return reject({ status: false, message: err.message });
        }
      });
    });
  }
  static logout(token) {
    return new Promise((resolve, reject) => {
      dbConnection("outTokens", async (collection) => {
        try {
          const result = await collection.insertOne({ token });
          resolve({ status: true, message: "User logedout" });
        } catch (error) {
          reject(error);
        }
      });
    });
  }
  static isLogedin(token) {
    return new Promise((resolve, reject) => {
      dbConnection("outTokens", async (collection) => {
        try {
          const result = await collection.findOne({ token });
          if (result) {
            resolve({ status: false });
          } else {
            resolve({ status: true, message: "User loged out" });
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

module.exports = User;
