const { verifyToken } = require("../utils/jwt");
const { CustomError } = require("../utils/helper");

const checkIsLoggedIn = async (req, _, next) => {
  try {
    const cookies = req.cookies;

    if (cookies.jwt) {
      const decoded = await verifyToken(
        cookies.jwt,
        process.env.REFRESH_TOKEN_SECRET
      );

      if (decoded) {
        throw new CustomError("User is already logged in.", 400);
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkIsLoggedIn;
