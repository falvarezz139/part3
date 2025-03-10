const logger = require("./logger");
const jwt = require("jsonwebtoken");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// Middleware para manejar errores
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  // Manejo de errores de CastError (por ejemplo, ID malformado)
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  // Manejo de errores de validación
  else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  // Errores de JWT
  else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" });
  }
  // Errores de token expirado
  else if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
