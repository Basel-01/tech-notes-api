const { CustomError } = require("../utils/helper");

const requireRole = (roles) => {
  return async (req, _, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        throw new CustomError(
          "Access denied, insufficient role permissions.",
          403
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = requireRole;
