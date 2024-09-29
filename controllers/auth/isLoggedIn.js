const { JsonWebTokenError } = require("jsonwebtoken");
const { verifyToken } = require("../../utils/jwt");

// @desc Is Logged In
// @route GET /api/auth/is-logged-in
// @access Public
const isLoggedIn = async (req, res, next) => {
  try {
    const { jwt } = req.cookies;

    if (!jwt) {
      return res.status(200).json({
        success: true,
        message: "User not logged in.",
        isLoggedIn: false,
      });
    }

    const decoded = await verifyToken(jwt, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded) {
      return res.status(200).json({
        success: true,
        message: "User not logged in.",
        isLoggedIn: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User logged in.",
      isLoggedIn: true,
    });
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
      });
    }
    next(err);
  }
};

module.exports = isLoggedIn;
