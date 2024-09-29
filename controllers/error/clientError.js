const clientError = (_, res) => {
  return res.status(404).json({ success: false, message: "Not found." });
};

module.exports = clientError;
