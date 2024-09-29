const mongoose = require("mongoose");
const app = require("../app");

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(3000, () =>
    console.log("Server is running on http://localhost:3000...")
  );
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to the database:", err);
});
