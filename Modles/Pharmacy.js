const { dbConnection } = require("../Configurations");
const { pharmacySchema } = require("../Validatores");
const { ObjectId } = require("mongodb");

class Pharmacy {
  constructor(pharmacyData) {
    this.pharmacyData = pharmacyData;
  }

  static validate(pharmacyData) {
    return pharmacySchema.validate(pharmacyData);
  }

  // isExist() {
  //   return new Promise((resolve, reject) => {
  //     dbConnection("pharmacies", async (collection) => {
  //       try {
  //         const pharmacy = await collection.findOne({
  //           pharmName: this.pharmacyData.pharmName,
  //         });

  //         if (!pharmacy) {
  //           resolve({ check: false });
  //         } else if (pharmacy.pharmName === this.pharmacyData.pharmName) {
  //           resolve({ check: true, message: "Pharmacy name already exists" });
  //         }
  //       } catch (err) {
  //         reject(err);
  //       }
  //     });
  //   });
  // }
  //insert/update
  save() {
    return new Promise((resolve, reject) => {
      dbConnection("pharmacies", async (collection) => {
        try {
          const result = await collection.findOne({
            pharmName: this.pharmacyData.pharmName,
          });
          if (result) {
            resolve({ status: false, message: "Pharmacy already exists" });
          } else {
            const insertResult = await collection.insertOne(this.pharmacyData);
            if (insertResult.insertedId) {
              resolve({
                status: true,
                message: "Pharmacy inserted successfully",
              });
            } else {
              resolve({ status: false, message: "Pharmacy insert failed" });
            }
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  update(_id, pharmacyData) {
    return new Promise((resolve, reject) => {
      dbConnection("pharmacies", async (collection) => {
        try {
          const existid = await Pharmacy.validID(_id);
          if (!existid.status) {
            return resolve({ status: false, message: existid.message });
          } else {
            const updateFields = {};
            if (pharmacyData.pharmName !== undefined)
              updateFields.pharmName = pharmacyData.pharmName;
            if (pharmacyData.address !== undefined)
              updateFields.address = pharmacyData.address;
            if (Object.keys(updateFields).length === 0) {
              return resolve({
                status: false,
                message: "No data provided for update",
              });
            }

            const updateresult = await collection.updateOne(
              { _id: new ObjectId(_id) },
              { $set: updateFields }
            );

            if (updateresult.modifiedCount > 0) {
              resolve({
                status: true,
                message: "Pharmacy updated successfully",
              });
            } else {
              resolve({
                status: false,
                message: "No changes applied",
              });
            }
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  static validID(_id) {
    console.log("Checking Pharmacy ID:", _id);
    return new Promise((resolve, reject) => {
      try {
        if (!ObjectId.isValid(_id)) {
          return resolve({
            status: false,
            message: "Invalid pharmacy ID format",
          });
        }
        _id = new ObjectId(_id);

        dbConnection("pharmacies", async (collection) => {
          const found = await collection.findOne({ _id });
          if (found) {
            resolve({ status: true, data: found });
          } else {
            resolve({ status: false, message: "Pharmacy ID not found" });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // remove
  static remove(_id) {
    return new Promise((resolve, reject) => {
      try {
        dbConnection("pharmacies", async (collection) => {
          const existid = await Pharmacy.validID(_id);
          if (existid.status) {
            const deletionResult = await collection.deleteOne({ _id });
            resolve({ status: true, message: "Pharmacy Delete successfully" });
          } else {
            resolve({ status: false, message: "This id is not exist" });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  // view
  static view() {
    return new Promise((resolve, reject) => {
      try {
        dbConnection("pharmacies", async (collection) => {
          const findall = await collection.find({}).toArray();
          if (findall) {
            resolve({ status: true, data: findall });
          } else {
            resolve({ status: false, message: "No pharmacirs added yet" });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static viewOne(_id) {
    return new Promise((resolve, reject) => {
      try {
        dbConnection("pharmacies", async (collection) => {
          const result = await collection
            .aggregate([
              {
                $match: { _id: new ObjectId(_id) },
              },
              {
                $lookup: {
                  from: "alternativedrugs",
                  localField: "_id",
                  foreignField: "pharmacy_id",
                  as: "alternatives",
                },
              },
              {
                $project: {
                  _id: 1,
                  pharmName: 1,
                  address: 1,
                  "alternatives._id": 1,
                  "alternatives.alternativedrugsName": 1,
                  "alternatives.drugForm": 1,
                  "alternatives.strength": 1,
                },
              },
            ])
            .toArray();
          if (!result || result.length === 0) {
            resolve({
              status: false,
              message: "No pharmacy with this id",
            });
          } else {
            resolve({
              status: true,
              data: result[0],
            });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
module.exports = Pharmacy;
