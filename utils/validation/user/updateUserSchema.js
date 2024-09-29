const yup = require("yup");
const { usernameSchema, rolesSchema } = require("./validationSchemas");

const updateUserSchema = yup.object().shape({
  username: usernameSchema,
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(25, "Password must be at most 25 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one special character"
    ),
  roles: rolesSchema,
  active: yup.boolean().required("Active feild is required"),
});

module.exports = updateUserSchema;
