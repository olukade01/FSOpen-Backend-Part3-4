const {info} = require("./logger");
require("dotenv").config();
const User = require("../model/user");
const jwt = require('jsonwebtoken')

const requestLogger = (req, res, next) => {
  info("Method:", req.method);
  info("Path:", req.path);
  info("Body:", req.body);
  info("---");
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  req.token = authorization && authorization.toLowerCase().startsWith('bearer ') ? authorization.substring(7) : null
  
  next()
}

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  req.user = await User.findById(decodedToken.id)

  next()
}

const unknownEndPoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  info(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError"){
    return res.status(401).json({error: "invalid or missing token"})
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired'
    })
  }
  next(error);
};

module.exports = { unknownEndPoint, requestLogger, errorHandler, tokenExtractor, userExtractor }