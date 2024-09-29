const { isValidObjectId } = require("mongoose");
const Note = require("../../models/Note");
const { CustomError } = require("../../utils/helper");
const { canDeleteNote } = require("../../utils/permissions");

// @desc Delete A Note
// @route DELETE /api/notes
// @access Private
const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!isValidObjectId(id)) {
      throw new CustomError("Invalid user ID.", 400);
    }

    const note = await Note.findById(id).lean();
    if (!note) {
      throw new CustomError("Note not found.", 404);
    }

    const { isAllowed, errorMessage, statusCode } = canDeleteNote({
      user: req.user,
      note,
    });
    if (!isAllowed) {
      throw new CustomError(errorMessage, statusCode);
    }

    const deletedNote = await Note.findByIdAndDelete(id).lean();

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully.",
      note: {
        id: deletedNote._id,
        ticket: deletedNote.ticket,
        title: deletedNote.title,
        description: deletedNote.description,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteNote;
