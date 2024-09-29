const { sign } = require("jsonwebtoken");
const customizeError = require("./customizeError");

const signToken = (payload, privateKey, options = {}) =>
  new Promise((resolve, reject) => {
    sign(payload, privateKey, options, (err, token) => {
      if (err) {
        return reject(customizeError(err));
      }
      resolve(token);
    });
  });

module.exports = signToken;
