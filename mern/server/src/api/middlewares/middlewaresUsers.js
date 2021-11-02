const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');
const validator = require('email-validator');
const { ObjectId } = require('mongodb');
const models = require('../models');

const errorMessage = (message) => ({
  message,
});

const schemaUser = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().required(),
  password: Joi.string().min(1).required(),
  area: Joi.string().min(1).required(),
});

const verifyUserFields = async (req, res, next) => {
  const { error } = schemaUser.validate(req.body);
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

  return next();
};

const schemaLogin = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(1).required(),
});

const verifyLoginFields = async (req, res, next) => {
  const { error } = schemaLogin.validate(req.body);
  if (error && error.details.find((err) => err)) {
    return res.status(StatusCodes.NOT_FOUND).json(errorMessage(error.message));
  }

  const { email } = req.body;

  if (!validator.validate(email)) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).json(errorMessage('Email or password do not match'));
  }

  return next();
};

const verifyId = (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'id not Found' });
  }
  return next();
};

module.exports = {
  verifyUserFields,
  verifyLoginFields,
  verifyId,
};
