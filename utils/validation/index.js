const { loginSchema, createUserSchema, updateUserSchema } = require("./user");
const { createNoteSchema, updateNoteSchema } = require("./note");

module.exports = {
  loginSchema,
  createUserSchema,
  updateUserSchema,
  createNoteSchema,
  updateNoteSchema,
};
