const Joi = require("joi");

module.exports = {
  addContactValidation: (req, res, next) => {
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      phone: Joi.number().required(),
    });

    const resultValidation = schema.validate(req.body);
    if (resultValidation.error) {
      return res.status(400).json({ message: resultValidation.error });
    }
    next();
  },

  putContactValidation: (req, res, next) => {
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).optional(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .optional(),
      phone: Joi.number().optional(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error });
    }
    next();
  },
};
