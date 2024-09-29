const { JsonWebTokenError } = require("jsonwebtoken");
const { ValidationError } = require("yup");
const { CustomError } = require("../../utils/helper");

const serverError = (err, _, res, error) => {
  console.log("Server Error:");
  console.log(err);

  if (err instanceof CustomError) {
    return res.status(err.status || 400).json({
      success: false,
      message: err.message || "Something went wrong, please try again later.",
    });
  } else if (err instanceof JsonWebTokenError) {
    return res.status(err.status || 401).json({
      success: false,
      message: err.message || "Invalid or expired token, please login again.",
    });
  } else if (err instanceof ValidationError) {
    const validationErrors = err.inner.reduce((acc, error) => {
      acc[error.path] = error.message;
      return acc;
    }, {});
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      error: validationErrors,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred, please try again later.",
    });
  }
};

module.exports = serverError;
