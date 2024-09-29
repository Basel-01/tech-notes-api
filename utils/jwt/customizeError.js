const customizeError = (err) => {
  err.status = 401;

  if (err.name === "TokenExpiredError") {
    err.message = "Session expired, please log in again.";
  } else if (err.name === "JsonWebTokenError") {
    err.message = "Invalid session, please log in again.";
  }

  return err;
};

module.exports = customizeError;
