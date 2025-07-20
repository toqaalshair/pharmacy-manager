const  createError  = require('http-errors')
const Pharmacy=require('../Modles/Pharmacy');
const {ObjectId}=require('mongodb')
const add=async(req,res,next)=>{
  console.log("Adding.....");
  console.log("📥 Reached add controller");

    const pharmacyData=req.body;
    const validator = Pharmacy.validate(pharmacyData);
    if(validator.error){
        return next(createError(400,validator.error.message))
    }
    const pharmacy=new Pharmacy(pharmacyData)
      console.log("Existence check done");

       try {
          const saveResult = await pharmacy.save();
          if (!saveResult.status) {
            return next(createError(500, saveResult.message));
          }
          return returnjson(res, 201, true, saveResult.message, null);

        } catch (err) {
         return next(createError(500, err.message));
        }
}
const update=async(req,res,next)=>{
  const _id = new ObjectId(req.params.id);
  const pharmacyData=req.body
  const pharmacy=new Pharmacy(pharmacyData)
  
  try {
    const updateResult = await pharmacy.update(_id,pharmacy.pharmacyData);
    if (updateResult.status) {
      // res.status(200).json(removeResult)
      return returnjson(res, 200, true, updateResult.message, null);
    } else {
      return next(createError(404, updateResult.message));
    }
  } catch (error) {
    return next(createError(500, error.message));
  }
}
const remove=async(req,res,next)=>{
  const _id=new ObjectId(req.params.id)
  try {
    const removeResult=await Pharmacy.remove(_id)
    if (removeResult.status) {
      // res.status(200).json(removeResult)
      return returnjson(res, 200, true, removeResult.message, null);

    } else {
      return next(createError(404,removeResult.message))
    }
  } catch (error) {
    return next(createError(500, error.message));
    
  }

}
const viewAll = async (req, res, next) => {
  try {
    const result = await Pharmacy.view();
    if (result.status) {
      // res.status(200).json(result);
      return returnjson(res, 200, true, "", result.data);

    } else {
      return next(createError(404), result.message);
    }
  } catch (error) {
    return next(createError(500), error.message);
  }
};
const viewOne=async(req,res,next)=>{
  const id=new ObjectId(req.params.id)
  const viewResut=await Pharmacy.viewOne(id)
  if (viewResut.status) {
    return returnjson(res, 200, true, "", viewResut.data);

    // return res.status(200).json(viewResut.data)
  } else {
    return next(createError(404,viewResut.message))
  }
}
const viewAlternatives = async (req, res, next) => {
  const mainDrugId = req.params.id;

  try {
    const alternatives = await dbConnection(
      "alternativedrugs",
      async (collection) => {
        return await collection
          .aggregate([
            { $match: { _mdrug_id: new ObjectId(mainDrugId) } },
            {
              $lookup: {
                from: "pharmacies",
                localField: "pharmacy_id",
                foreignField: "_id",
                as: "pharmacy",
              },
            },
          ])
          .toArray();
      }
    );

    if (alternatives.length === 0) {
      return returnjson(res, 404, false, "No alternatives found", null);

      // return res.status(404).json({ message: "No alternatives found" });
    }
    return returnjson(res, 200, true, "", alternatives);

    // res.status(200).json(alternatives);
  } catch (err) {
    next(err);
  }
};


module.exports={add,update,remove, viewAll,viewOne}