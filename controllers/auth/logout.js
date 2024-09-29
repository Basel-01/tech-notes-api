// @desc Logout
// @route POST /api/auth/logout
// @access Private
const logout = async (_, res, next) => {
  try {
    res.clearCookie("jwt", { httpOnly: true, secure: true });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = logout;
