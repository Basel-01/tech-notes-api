const { verifyToken } = require("../utils/jwt");
const { CustomError } = require("../utils/helper");

const checkAuth = async (req, _, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomError("Unauthorized, please login again.", 401);
    }

    const accessToken = authHeader.split(" ")[1];

    const decoded = await verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (!decoded || !decoded.roles) {
      throw new CustomError("Invalid token, please log in again.", 401);
    }

    let role = "employee";

    if (decoded.roles.includes("employee")) role = "employee";
    if (decoded.roles.includes("manager")) role = "manager";
    if (decoded.roles.includes("admin")) role = "admin";

    req.user = {
      id: decoded.id,
      username: decoded.username,
      roles: decoded.roles,
      role,
    };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkAuth;
