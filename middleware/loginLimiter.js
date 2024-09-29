const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  message: {
    message:
      "Too many login attempts, Please try again after a 60 second pause",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;
