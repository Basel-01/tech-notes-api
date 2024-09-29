const yup = require("yup");

const createNoteSchema = yup.object().shape({
  title: yup
    .string()
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  description: yup
    .string()
    .max(200, "Description must be at most 200 characters")
    .required("Description is required"),
});

module.exports = createNoteSchema;
