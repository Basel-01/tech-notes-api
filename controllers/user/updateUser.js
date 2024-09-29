const bcrypt = require("bcrypt");
const { isValidObjectId } = require("mongoose");
const User = require("../../models/User");
const { updateUserSchema } = require("../../utils/validation");
const { CustomError } = require("../../utils/helper");
const { canUpdateUser } = require("../../utils/permissions");

// @desc Update A User
// @route PATCH /api/users
// @access Private
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!isValidObjectId(id)) {
      throw new CustomError("Invalid user ID.", 400);
    }

    const { username, roles, active, password } =
      await updateUserSchema.validate(
        { ...req.body, username: req.body?.username?.trim().toLowerCase() },
        {
          abortEarly: false,
        }
      );

    const { isAllowed, errorMessage, statusCode } = canUpdateUser({
      user: req.user,
      roles,
      updatedUserName: username,
    });
    if (!isAllowed) {
      throw new CustomError(errorMessage, statusCode);
    }

    const user = await User.findById(id);
    if (!user) {
      throw new CustomError("User not found.", 404);
    }

    const {
      isAllowed: isAllowedToUpdate,
      errorMessage: updateErrorMessage,
      statusCode: updateStatusCode,
    } = canUpdateUser({
      user: req.user,
      roles: user.roles,
      updatedUserName: user.username,
    });
    if (!isAllowedToUpdate) {
      throw new CustomError(updateErrorMessage, updateStatusCode);
    }

    const duplicate = await User.findOne({ username, _id: { $ne: id } }).lean();
    if (duplicate) {
      throw new CustomError("Username is already taken.", 400);
    }

    user.username = username;
    user.roles = roles;
    user.active = active;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        roles: updatedUser.roles,
        active: updatedUser.active,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateUser;
