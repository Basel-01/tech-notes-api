const yup = require("yup");
const {
  usernameSchema,
  passwordSchema,
  rolesSchema,
} = require("./validationSchemas");

const createUserSchema = yup.object().shape({
  username: usernameSchema,
  password: passwordSchema,
  roles: rolesSchema,
});

module.exports = createUserSchema;
