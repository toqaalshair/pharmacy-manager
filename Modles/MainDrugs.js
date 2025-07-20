const { date } = require("@hapi/joi");
const { dbConnection } = require("../Configurations");
const { ObjectId } = require("mongodb");

class MainDrug {
  constructor(maindrugData) {
    this.maindrugData = maindrugData;
  }

  // isExist() {
  //   return new Promise((resolve, reject) => {
  //     dbConnection("maindrugs", async (collection) => {
  //       try {
  //         const maindrug = await collection.findOne({
  //           maindrugName: this.maindrugData.maindrugName,
  //         });

  //         if (!maindrug) {
  //           resolve({ check: false });
  //         } else if (maindrug.maindrugName === this.maindrugData.maindrugName) {
  //           resolve({ check: true, message: "Maindrug name already exists" });
  //         }
  //       } catch (err) {
  //         reject(err);
  //       }
  //     });
  //   });
  // }
  //insert/update
  // save() {
  //   return new Promise((resolve, reject) => {
  //     dbConnection("maindrugs", async (collection) => {
  //       try {
  //         const result = await collection.updateOne(
  //           { maindrugName: this.maindrugData.maindrugName },
  //           {
  //             $set: {
  //               maindrugName: this.maindrugData.maindrugName,
  //               factory: this.maindrugData.factory,
  //               strength: this.maindrugData.strength,
  //               drugForm: this.maindrugData.drugForm,
  //             },
  //           },
  //           { upsert: true }
  //         );
  //         if (result.upsertedCount > 0) {
  //           resolve({
  //             status: true,
  //             message: "Maindrug inserted successfully",
  //           });
  //         } else if (result.modifiedCount > 0) {
  //           resolve({
  //             status: true,
  //             message: "Maindrug updated successfully",
  //           });
  //         } else {
  //           resolve({ status: false, message: "Maindrug is already exist" });
  //         }
  //       } catch (error) {
  //         reject(error);
  //       }
  //     });
  //   });
  // }
  save() {
    return new Promise((resolve, reject) => {
      dbConnection("maindrugs", async (collection) => {
        try {
          const result = await collection.findOne({
            maindrugName: this.maindrugData.maindrugName,
          });
          if (result) {
            resolve({ status: false, message: "Main Drug already exists" });
          } else {
            const insertResult = await collection.insertOne(this.maindrugData);
            if (insertResult.insertedId) {
              resolve({
                status: true,
                message: "Main Drug inserted successfully",
              });
            } else {
              resolve({ status: false, message: "Main Drug insert failed" });
            }
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  update(_id, maindrugData) {
    return new Promise((resolve, reject) => {
      dbConnection("maindrugs", async (collection) => {
        try {
          const existid = await MainDrug.validID(_id);
          if (!existid.status) {
            return resolve({ status: false, message: existid.message });
          }

          const updateFields = {};
          if (maindrugData.maindrugName !== undefined)
            updateFields.maindrugName = maindrugData.maindrugName;
          if (maindrugData.factory !== undefined)
            updateFields.factory = maindrugData.factory;
          if (maindrugData.drugForm !== undefined)
            updateFields.drugForm = maindrugData.drugForm;
          if (maindrugData.strength !== undefined)
            updateFields.strength = maindrugData.strength;

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
              message: "Main Drug updated successfully",
            });
          } else {
            resolve({
              status: false,
              message: "No changes applied",
            });
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  static validID(_id) {
    console.log("Checking ,ma ID:", _id);
    return new Promise((resolve, reject) => {
      try {
        if (!ObjectId.isValid(_id)) {
          return resolve({
            status: false,
            message: "Invalid main drug ID format",
          });
        }
        _id = new ObjectId(_id);

        dbConnection("maindrugs", async (collection) => {
          const found = await collection.findOne({ _id });
          if (found) {
            resolve({ status: true, data: found });
          } else {
            resolve({ status: false, message: "Maindrug ID not found" });
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
        dbConnection("maindrugs", async (collection) => {
          const existid = await MainDrug.validID(_id);
          if (existid.status) {
            const deletionResult = await collection.deleteOne({ _id });
            resolve({ status: true, message: "Maindrug Delete successfully" });
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
        dbConnection("maindrugs", async (collection) => {
          const findall = await collection.find({}).toArray();
          if (findall) {
            resolve({ status: true, data: findall });
          } else {
            resolve({ status: false, message: "No maindrugs added yet" });
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
        dbConnection("maindrugs", async (collection) => {
          const result = await collection
            .aggregate([
              {
                $match: { _id: new ObjectId(_id) },
              },
              {
                $lookup: {
                  from: "alternativedrugs",
                  localField: "_id",
                  foreignField: "_mdrug_id",
                  as: "alternatives",
                },
              },
              {
                $project: {
                  _id: 1,
                  maindrugName: 1,
                  factory:1,
                  drugForm:1,
                  strength:1,
                  "alternatives._id": 1,
                  "alternatives.alternativedrugsName": 1,
                },
              },
            ])
            .toArray();
          if (!result || result.length === 0) {
            resolve({
              status: false,
              message: "No main drug with this id",
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
module.exports = MainDrug;
