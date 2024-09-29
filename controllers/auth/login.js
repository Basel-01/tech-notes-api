const bcrypt = require("bcrypt");
const User = require("../../models/User");
const { loginSchema } = require("../../utils/validation");
const { signToken } = require("../../utils/jwt");
const { CustomError } = require("../../utils/helper");

// @desc Login
// @route POST /api/auth
// @access Public
const login = async (req, res, next) => {
  try {
    const { username, password, rememberMe } = await loginSchema.validate(
      {
        ...req.body,
        username: req.body?.username?.trim().toLowerCase(),
      },
      {
        abortEarly: false,
      }
    );

    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      throw new CustomError("Invalid username or password.", 400);
    }
    if (!foundUser.active) {
      throw new CustomError("User is inactive, please contact support.", 403);
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      throw new CustomError("Invalid username or password.", 400);
    }

    const accessToken = await signToken(
      { id: foundUser.id, username, roles: foundUser.roles },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshTokenExpiry = rememberMe ? "30d" : "1d";
    const refreshToken = await signToken(
      { id: foundUser.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: refreshTokenExpiry }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      ...(rememberMe ? { maxAge: 30 * 24 * 60 * 60 * 1000 } : {}),
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = login;
