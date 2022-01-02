const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invaild ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidatorErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invaild input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const field = JSON.stringify(Object.keys(err.keyValue).join(' '));
  const value = JSON.stringify(Object.values(err.keyValue).join(' '));

  const message = `Duplicate field ${field} with value: ${value}. Please use another value!`;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invaild token. Please log in again', 401);

const handleExpiredError = () =>
  new AppError('Your token has expired. Please log in again', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  // Programming or other unknown error: don't leak error details
  else {
    // 1) Log error
    // console.error(`Error 💥`, err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);

    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.name === 'ValidationError') error = handleValidatorErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleExpiredError();

    sendErrorProd(error, res);
  }
};