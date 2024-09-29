const { isValidObjectId } = require("mongoose");
const User = require("../../models/User");
const Note = require("../../models/Note");
const { createNoteSchema } = require("../../utils/validation");
const { CustomError } = require("../../utils/helper");
const { canAssignNoteToUser } = require("../../utils/permissions");

// @desc Create New Note
// @route POST /api/notes
// @access Private
const createNote = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;
    if (!isValidObjectId(assignedTo)) {
      throw new CustomError("Invalid user ID.", 400);
    }

    const { title, description } = await createNoteSchema.validate(req.body, {
      abortEarly: false,
    });

    const assignedToUser = await User.findById(assignedTo).lean();
    if (!assignedToUser) {
      throw new CustomError("User not found.", 404);
    }

    const { isAllowed, errorMessage, statusCode } = canAssignNoteToUser({
      roles: assignedToUser.roles,
    });
    if (!isAllowed) {
      throw new CustomError(errorMessage, statusCode);
    }

    const note = await Note.create({
      title,
      description,
      assignedTo,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Note created successfully.",
      note: {
        id: note._id,
        title: note.title,
        description: note.description,
        ticket: note.ticket,
        completed: note.completed,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        createdBy: {
          _id: req.user.id,
          username: req.user.username,
        },
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

module.exports = createNote;
