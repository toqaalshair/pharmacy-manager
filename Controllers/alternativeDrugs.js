const createError = require("http-errors");
// const AlternativeDrugs = require("../Modles/AlternativeDrugs");
const { MainDrudgs, Pharmacy,AlternativeDrugs } = require("../Modles");
const { ObjectId } = require("mongodb");
const add = async (req, res, next) => {
  const altData = req.body;
  const alternativeDrug = new AlternativeDrugs(altData);
  try {
    const result = await alternativeDrug.save();
    if (!result.status) {
      return next(createError(400, result.message));
    }
    return returnjson(res, 201, true, result.message, null);
  } catch (err) {
    return next(createError(500, err.message));
  }
};
const update = async (req, res, next) => {
    const _id = new ObjectId(req.params.id);
    const altdrugData = req.body;
    const altdrug = new AlternativeDrugs(altdrugData);

    try {
      const updateResult = await altdrug.update(_id, altdrug.alternativedrugsData);
      if (updateResult.status) {
        return returnjson(res, 200, true, updateResult.message, null);
      } else {
        return next(createError(404, updateResult.message));
      }
    } catch (error) {
      return next(createError(500, error.message));
    }
  };
const remove = async (req, res, next) => {
  const _id = new ObjectId(req.params.id);
  try {
    const removeResult = await AlternativeDrugs.remove(_id);
    if (removeResult.status) {
      return returnjson(res, 200, true, removeResult.message, null);

    } else {
      return next(createError(404, removeResult.message));
    }
  } catch (error) {
    return next(createError(500, error.message));
  }
};
const viewAll = async (req, res, next) => {
  try {
    const result = await AlternativeDrugs.view();
    if (result.status) {
      return returnjson(res, 200, true, "", result.data);

    } else {
      return next(createError(404, result.message));
    }
  } catch (error) {
    return next(createError(500, error.message));
  }
};
const viewOne = async (req, res, next) => {
  const id = new ObjectId(req.params.id);
  const viewResut = await AlternativeDrugs.viewOne(id);
  if (viewResut.status) {
    return returnjson(res, 200, true, "", viewResut.data);
  } else {
    return next(createError(404, viewResut.message));
  }
};


module.exports = { add,update, remove, viewAll, viewOne };
