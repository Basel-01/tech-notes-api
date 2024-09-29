const Note = require("../../models/Note");

// @desc Get All Notes
// @route GET /api/notes
// @access Private
const getAllNotes = async (_, res, next) => {
  try {
    const notes = await Note.find()
      .select("-__v")
      .populate({
        path: "assignedTo",
        select: "username",
      })
      .populate({
        path: "createdBy",
        select: "username",
      });

    return res.status(200).json({
      success: true,
      message: "Notes retrieved successfully.",
      notes,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getAllNotes;
