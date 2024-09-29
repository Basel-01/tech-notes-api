const yup = require("yup");
const { usernameSchema, passwordSchema } = require("./validationSchemas");

const loginSchema = yup.object().shape({
  username: usernameSchema,
  password: passwordSchema,
  rememberMe: yup.boolean(),
});

module.exports = loginSchema;
