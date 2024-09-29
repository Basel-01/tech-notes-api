const bcrypt = require("bcrypt");
const User = require("../../models/User");
const { createUserSchema } = require("../../utils/validation");
const { CustomError } = require("../../utils/helper");
const { canCreateUser } = require("../../utils/permissions");

// @desc Create User
// @route POST /api/users
// @access Private
const createUser = async (req, res, next) => {
  try {
    const { username, password, roles } = await createUserSchema.validate(
      { ...req.body, username: req.body?.username?.trim().toLowerCase() },
      {
        abortEarly: false,
      }
    );

    const { isAllowed, errorMessage, statusCode } = canCreateUser({
      user: req.user,
      roles,
      createdUserName: username,
    });
    if (!isAllowed) {
      throw new CustomError(errorMessage, statusCode);
    }

    const duplicate = await User.findOne({ username }).lean();
    if (duplicate) {
      throw new CustomError("Username is already taken.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      roles,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: {
        id: user._id,
        username: user.username,
        roles: user.roles,
        active: user.active,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = createUser;
