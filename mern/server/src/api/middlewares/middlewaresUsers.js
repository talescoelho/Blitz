const models = require('../models');
const Joi = require('joi');
var validator = require("email-validator");
const { StatusCodes } = require('http-status-codes');
 
// validator.validate("test@email.com");

const SECRET = 'xablasMaster';

const errorMessage = (message) => ({
  message,
});

const schema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().required(),
  password: Joi.string().min(1).required(),
  area: Joi.string().min(1).required(),
});

const verifyUserFields = async (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error && error.details.find((err) => err)) {
    return res.status(StatusCodes.NOT_FOUND).json(errorMessage(error.message));
  }

  const { email } = req.body;

  if (!validator.validate(email)) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json(errorMessage('Usuário já existe'));
  }

  const verifyEmail = await models.findByfield('users', 'email', email);
  if (verifyEmail.length !== 0) {
    return res.status(StatusCodes.CONFLICT).json(errorMessage('Email already registered'));
  }

  next();
};

module.exports = {
  verifyUserFields,
};
