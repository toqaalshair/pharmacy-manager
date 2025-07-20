const Joi = require("@hapi/joi");

const alternativeDrugValidator = Joi.object({
  alternativedrugsName: Joi.string().min(2).required(),

  _mdrug_id: Joi.string()
    .pattern(/^[a-f\d]{24}$/i) 
    .required(),

  pharmacy_id: Joi.alternatives()
    .try(
      Joi.array().items(
        Joi.string()
          .pattern(/^[a-f\d]{24}$/i)
          .required()
      ),
      Joi.string().pattern(/^[a-f\d]{24}$/i)
    )
    .required(),

  strength: Joi.number().required(),
  factory: Joi.string().required(),
  drugForm: Joi.string().required(),
});

module.exports =  {alternativeDrugValidator} ;
