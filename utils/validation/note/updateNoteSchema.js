const yup = require("yup");

const createNoteSchema = yup.object().shape({
  title: yup.string().max(50, "Title must be at most 50 characters"),
  description: yup
    .string()
    .max(200, "Description must be at most 200 characters"),
  completed: yup.boolean(),
});

module.exports = createNoteSchema;
