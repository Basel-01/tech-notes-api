const router = require("express").Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const noteRoutes = require("./noteRoutes");

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/notes", noteRoutes);

module.exports = router;
