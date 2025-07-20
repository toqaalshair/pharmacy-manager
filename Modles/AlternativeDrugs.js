const { dbConnection } = require("../Configurations");
const { ObjectId } = require("mongodb");
const MainDrug = require("./MainDrugs");
const { alternativeDrugValidator } = require("../Validatores");
const Pharmacy = require("./Pharmacy");
class AlternativeDrugs {
  constructor(alternativedrugsData) {
    this.alternativedrugsData = alternativedrugsData;
  }

  // isExist() {
  //   return new Promise((resolve, reject) => {
  //     dbConnection("alternativedrugs", async (collection) => {
  //       try {
  //         const alternativedrugs = await collection.findOne({
  //           alternativedrugsName:
  //             this.alternativedrugsData.alternativedrugsName,
  //         });

  //         if (!alternativedrugs) {
  //           resolve({ check: false });
  //         } else if (
  //           alternativedrugs === this.alternativedrugsData.alternativedrugsName
  //         ) {
  //           resolve({
  //             check: true,
  //             message: "AlternativeDrugs name already exists",
  //           });
  //         }
  //       } catch (err) {
  //         reject(err);
  //       }
  //     });
  //   });
  // }
  //insert/update
  // فحص تنسيق ووجود البيانات
  static async validate(alternativedrugsData) {
    return alternativeDrugValidator.validate(alternativedrugsData);
  }
  static async check(alternativedrugsData) {
    if (
      !alternativedrugsData._mdrug_id ||
      !ObjectId.isValid(alternativedrugsData._mdrug_id)
    ) {
      return { status: false, message: "Invalid or missing _mdrug_id" };
    }
    let pharmacyIds = alternativedrugsData.pharmacy_id;
    if (!pharmacyIds) {
      return { status: false, message: "Missing pharmacy_id" };
    }
    if (!Array.isArray(pharmacyIds)) pharmacyIds = [pharmacyIds];
    for (const id of pharmacyIds) {
      if (!ObjectId.isValid(id)) {
        return { status: false, message: `Invalid Pharmacy ID: ${id}` };
      }
    }

    const mainDrugCheck = await MainDrug.validID(
      alternativedrugsData._mdrug_id
    );
    if (!mainDrugCheck.status) {
      return { status: false, message: "MainDrug not found" };
    }

    for (const id of pharmacyIds) {
      const pharmacyCheck = await Pharmacy.validID(id);
      if (!pharmacyCheck.status) {
        return { status: false, message: `Pharmacy not found: ${id}` };
      }
    }

    return { status: true, pharmacyIds };
  }

  async save() {
    try {
      const validate = await AlternativeDrugs.validate(
        this.alternativedrugsData
      );
      if (validate.error) return {status:false,message:error.message};

      const check = await AlternativeDrugs.check(this.alternativedrugsData);
      if (!check.status) return check;

      this.alternativedrugsData._mdrug_id =
        this.alternativedrugsData._mdrug_id instanceof ObjectId
          ? this.alternativedrugsData._mdrug_id
          : new ObjectId(this.alternativedrugsData._mdrug_id);

      this.alternativedrugsData.pharmacy_id = check.pharmacyIds.map((id) =>
        id instanceof ObjectId ? id : new ObjectId(id)
      );

      return new Promise((resolve, reject) => {
        dbConnection("alternativedrugs", async (collection) => {
          const existing = await collection.findOne({
            alternativedrugsName:
              this.alternativedrugsData.alternativedrugsName,
          });

          if (existing) {
            return resolve({
              status: false,
              message: "Alternative drug already exists",
            });
          }

          const insertResult = await collection.insertOne(
            this.alternativedrugsData
          );

          if (insertResult.insertedId) {
            return resolve({
              status: true,
              message: "Alternative drug inserted successfully",
            });
          } else {
            return resolve({
              status: false,
              message: "Failed to insert alternative drug",
            });
          }
        });
      });
    } catch (error) {
      return { status: false, message: error.message };
    }
  }

  update(_id, altdrugData) {
    return new Promise((resolve, reject) => {
      dbConnection("alternativedrugs", async (collection) => {
        try {
          const existid = await AlternativeDrugs.validID(_id);
          if (!existid.status) {
            return resolve({ status: false, message: existid.message });
          }

          const updateFields = {};

          if (altdrugData.alternativedrugsName)
            updateFields.alternativedrugsName =
              altdrugData.alternativedrugsName;

          if (altdrugData.factory) updateFields.factory = altdrugData.factory;

          if (altdrugData.drugForm)
            updateFields.drugForm = altdrugData.drugForm;

          if (altdrugData.strength)
            updateFields.strength = altdrugData.strength;

          if (
            altdrugData._mdrug_id &&
            ObjectId.isValid(altdrugData._mdrug_id)
          ) {
            const checkMain = await MainDrug.validID(altdrugData._mdrug_id);
            if (!checkMain.status) {
              return resolve({ status: false, message: checkMain.message });
            }
            updateFields._mdrug_id = new ObjectId(altdrugData._mdrug_id);
          }

          let pharmacyIds = altdrugData.pharmacy_id;

          if (pharmacyIds) {
            // حوله لمصفوفة لو مش مصفوفة
            if (!Array.isArray(pharmacyIds)) pharmacyIds = [pharmacyIds];

            const validPharmacyIds = [];

            for (const id of pharmacyIds) {
              if (!ObjectId.isValid(id)) {
                return resolve({
                  status: false,
                  message: `Invalid Pharmacy ID: ${id}`,
                });
              }
              const checkPharm = await Pharmacy.validID(id);
              if (!checkPharm.status) {
                return resolve({ status: false, message: checkPharm.message });
              }
              validPharmacyIds.push(new ObjectId(id));
            }

            updateFields.pharmacy_id = validPharmacyIds;
          }

           

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
              message: "Alternative drug updated successfully",
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
    return new Promise((resolve, reject) => {
      try {
        _id = new ObjectId(_id);
        dbConnection("alternativedrugs", async (collection) => {
          const validid = await collection.findOne({ _id });
          if (validid) {
            resolve({ status: true, data: validid });
          } else {
            resolve({ status: false, message: "ID not found" });
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
        dbConnection("alternativedrugs", async (collection) => {
          const existid = await AlternativeDrugs.validID(_id);
          if (existid.status) {
            const deletionResult = await collection.deleteOne({ _id });
            resolve({
              status: true,
              message: "AlternativeDrugs Delete successfully",
            });
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
        dbConnection("alternativedrugs", async (collection) => {
          const findall = await collection.find({}).toArray();
          if (!findall || findall.length === 0) {
            resolve({
              status: false,
              message: "No alternativedrugs added yet",
            });
          } else {
            resolve({ status: true, data: findall });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static viewOne(_id) {
    return new Promise((resolve, reject) => {
      dbConnection("alternativedrugs", async (collection) => {
        try {
          const result = await collection
            .aggregate([
              { $match: { _id: new ObjectId(_id) } },
              {
                $lookup: {
                  from: "maindrugs",
                  localField: "_mdrug_id",
                  foreignField: "_id",
                  as: "mainDrug",
                },
              },
              {
                $lookup: {
                  from: "pharmacies",
                  localField: "pharmacy_id",
                  foreignField: "_id",
                  as: "pharmacy",
                },
              },
              {
                $project: {
                  _id: 1,
                  alternativedrugsName: 1,
                  strength: 1,
                  drugForm: 1,
                  factory: 1,
                  "pharmacy._id": 1,
                  "pharmacy.name": 1,
                  "pharmacy.address": 1,
                  "mainDrug._id": 1,
                  "mainDrug.maindrugName": 1,
                },
              },
            ])
            .toArray();

          if (!result || result.length === 0) {
            resolve({
              status: false,
              message: "No alternative drug with this id",
            });
          } else {
            resolve({ status: true, data: result[0] });
          }
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}
module.exports = AlternativeDrugs;
