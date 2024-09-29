const User = require("../../models/User");
const { signToken, verifyToken } = require("../../utils/jwt");
const { CustomError } = require("../../utils/helper");

// @desc Refresh
// @route GET /api/auth/refresh
// @access Public
const refresh = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies.jwt) {
      throw new CustomError("Unauthorized, please login again.", 401);
    }

    const refreshToken = cookies.jwt;

    const decoded = await verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decoded) {
      throw new CustomError("Invalid token, please log in again.", 401);
    }

    const foundUser = await User.findById(decoded.id);
    if (!foundUser) {
      throw new CustomError("User not found. Please log in again.", 401);
    }
    if (!foundUser.active) {
      throw new CustomError("User is inactive, please contact support.", 403);
    }

    const accessToken = await signToken(
      {
        id: foundUser.id,
        username: foundUser.username,
        roles: foundUser.roles,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully.",
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = refresh;
