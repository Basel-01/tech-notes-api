const { isValidObjectId } = require("mongoose");
const User = require("../../models/User");
const Note = require("../../models/Note");
const { CustomError } = require("../../utils/helper");
const { canDeleteUser } = require("../../utils/permissions");

// @desc Delete A User
// @route DELETE /api/users
// @access Private
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!isValidObjectId(id)) {
      throw new CustomError("Invalid user ID.", 400);
    }

    const user = await User.findById(id).lean();
    if (!user) {
      throw new CustomError("User not found.", 404);
    }

    if (req.user.id === user._id.toString()) {
      throw new CustomError("User can not delete himself.", 400);
    }

    const { isAllowed, errorMessage, statusCode } = canDeleteUser({
      user: req.user,
      roles: user.roles,
      deletedUserName: user.username,
    });
    if (!isAllowed) {
      throw new CustomError(errorMessage, statusCode);
    }

    const note = await Note.findOne({ assignedTo: id }).lean();
    if (note) {
      throw new CustomError("Cannot delete user with assigned notes.", 400);
    }

    const deletedUser = await User.findByIdAndDelete(id).lean();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
      user: {
        id: deletedUser._id,
        username: deletedUser.username,
        roles: deletedUser.roles,
        active: deletedUser.active,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteUser;
