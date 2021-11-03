const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');
const { ObjectId } = require('mongodb');

const SECRET_KEY = 'secretKey';

const errorMessage = (message) => ({
  message,
});

const schemaTask = Joi.object({
  task: Joi.string().min(1).required(),
  private: Joi.bool().required(),
});

const verifyTaskFields = (req, res, next) => {
  const { error } = schemaTask.validate(req.body);
  if (error && error.details.find((err) => err)) {
    return res.status(StatusCodes.NOT_FOUND).json(errorMessage(error.message));
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

const validToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).json(errorMessage('missing auth token'));
  }
  return jwt.verify(authorization, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(StatusCodes.UNAUTHORIZED).json(errorMessage(err.message));
    }
    const id = '_id';
    req.userId = decoded[id];
    req.decoded = decoded;
    return next();
  });
};

module.exports = {
  verifyTaskFields,
  verifyId,
  validToken,
};
