const createError = require("http-errors");
const MainDrugs = require("../Modles/MainDrugs");
const { ObjectId } = require("mongodb");
const { dbConnection } = require("../Configurations");
// const add = async (req, res, next) => {
  const add = async (req, res, next) => {
    console.log("Adding.....");
    console.log("📥 Reached add controller");

    const maindrugData = req.body;
    const maindrug = new MainDrugs(maindrugData);
    console.log("Existence check done");

    try {
      const saveResult = await maindrug.save();
      if (!saveResult.status) {
        return next(createError(500, saveResult.message));
      }
      return returnjson(res, 201, true, saveResult.message, null);
    } catch (err) {
      return next(createError(500, err.message));
    }
  };
  const update = async (req, res, next) => {
    const _id = new ObjectId(req.params.id);
    const maindrugData = req.body;
    const maindrug = new MainDrugs(maindrugData);

    try {
      const updateResult = await maindrug.update(_id, maindrug.maindrugData);
      if (updateResult.status) {
        return returnjson(res, 200, true, updateResult.message, null);
      } else {
        return next(createError(404, updateResult.message));
      }
    } catch (error) {
      return next(createError(500, error.message));
    }
  };
//   console.log("Adding.....");
//   console.log("📥 Reached add controller");
//   const maindrugData = req.body;
//   const maindrug = new MainDrugs(maindrugData);
//   console.log("Existence check done");
//   try {
//     const saveResult = await maindrug.save();
//     if (!saveResult.status) {
//       return next(createError(500, saveResult.message));
//     }
//     return returnjson(res, 201, true, saveResult.message, null);

//     // return res.status(201).json({ message: saveResult.message });
//   } catch (err) {
//     return next(createError(500, err.message));
//   }
// };
const remove = async (req, res, next) => {
  const _id = new ObjectId(req.params.id);
  try {
    const removeResult = await MainDrugs.remove(_id);
    if (removeResult.status) {
      return returnjson(res, 200, true, "", {removeResult});

      // res.status(200).json(removeResult);
    } else {
      return next(createError(404, removeResult.message));
    }
  } catch (error) {
    return next(createError(500, error.message));
  }
};
const viewAll = async (req, res, next) => {
  try {
    const result = await MainDrugs.view();
    if (result.status) {
      return returnjson(res, 200, true, "", result.data);

      // res.status(200).json(result);
    } else {
      return next(createError(404), result.message);
    }
  } catch (error) {
    return next(createError(500), error.message);
  }
};
const viewOne = async (req, res, next) => {
  const id = new ObjectId(req.params.id);
  const viewResut = await MainDrugs.viewOne(id);
  if (viewResut.status) {
    return returnjson(res, 200, true, "", viewResut.data);

    // return res.status(200).json(viewResut.data);
  } else {
    return next(createError(404, viewResut.message));
  }
};

module.exports = { add,update, remove, viewAll, viewOne };
