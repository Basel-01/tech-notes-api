const User = require("../../models/User");

// @desc Get All Users
// @route GET /api/users
// @access Private
const getAllUsers = async (_, res, next) => {
  try {
    const users = await User.find().select("-password -__v").lean();

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully.",
      users,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getAllUsers;
