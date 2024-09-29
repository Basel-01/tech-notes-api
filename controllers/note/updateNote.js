const { isValidObjectId } = require("mongoose");
const User = require("../../models/User");
const Note = require("../../models/Note");
const { updateNoteSchema } = require("../../utils/validation");
const { CustomError } = require("../../utils/helper");
const {
  canAssignNoteToUser,
  canUpdateNote,
} = require("../../utils/permissions");

// @desc Update A Note
// @route PATCH /api/notes
// @access Private
const updateNote = async (req, res, next) => {
  try {
    const { id, assignedTo } = req.body;
    if (!isValidObjectId(id) || (assignedTo && !isValidObjectId(assignedTo))) {
      throw new CustomError("Invalid user ID.", 400);
    }

    const { title, description, completed } = await updateNoteSchema.validate(
      req.body,
      {
        abortEarly: false,
      }
    );

    const note = await Note.findById(id);
    if (!note) {
      throw new CustomError("Note not found.", 404);
    }

    const { isAllowed, errorMessage, statusCode } = canUpdateNote({
      user: req.user,
      note,
    });
    if (!isAllowed) {
      throw new CustomError(errorMessage, statusCode);
    }

    if (req.user.role === "employee" && (assignedTo || title || description)) {
      throw new CustomError(
        "Employees can only update the completed status of notes.",
        403
      );
    }

    let assignedToUser = null;

    if (assignedTo && note.assignedTo.toString() !== assignedTo) {
      assignedToUser = await User.findById(assignedTo);
      if (!assignedToUser) {
        throw new CustomError("Assigned user not found.", 404);
      }

      const { isAllowed, errorMessage, statusCode } = canAssignNoteToUser({
        roles: assignedToUser.roles,
      });
      if (!isAllowed) {
        throw new CustomError(errorMessage, statusCode);
      }

      note.assignedTo = assignedTo;
    } else {
      assignedToUser = await User.findById(note.assignedTo);
      if (!assignedToUser) {
        throw new CustomError("User not found.", 404);
      }
    }
    if (title) note.title = title;
    if (description) note.description = description;
    if (typeof completed === "boolean") note.completed = completed;

    const updatedNote = await note.save();

    return res.status(200).json({
      success: true,
      message: "Note updated successfully.",
      note: {
        id: updatedNote._id,
        ticket: updatedNote.ticket,
        title: updatedNote.title,
        description: updatedNote.description,
        completed: updatedNote.completed,
        assignedTo: {
          _id: assignedToUser._id,
          username: assignedToUser.username,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateNote;
