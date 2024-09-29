const { verify } = require("jsonwebtoken");
const customizeError = require("./customizeError");

const verifyToken = (token, privateKey) =>
  new Promise((resolve, reject) => {
    verify(token, privateKey, (err, decoded) => {
      if (err) {
        return reject(customizeError(err));
      }
      resolve(decoded);
    });
  });

module.exports = verifyToken;
