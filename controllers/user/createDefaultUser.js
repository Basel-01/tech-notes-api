const bcrypt = require("bcrypt");
const User = require("../../models/User");
const { CustomError } = require("../../utils/helper");

// @desc Create Default User For Testing
// @route POST /api/users/create-default-user
// @access Public
const createDefaultUser = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({
      username: process.env.SUPER_USER_NAME,
    }).lean();
    if (existingUser) {
      throw new CustomError(
        "Default only-admin user already exists. You can login with its credentials.",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_USER_PASSWORD,
      10
    );

    await User.create({
      username: process.env.SUPER_USER_NAME,
      password: hashedPassword,
      roles: ["admin"],
    });

    return res.status(201).json({
      success: true,
      message:
        "Default only-admin user created successfully. You can login with its credentials.",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = createDefaultUser;
