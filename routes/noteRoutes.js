const router = require("express").Router();

const {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/note");

const { checkAuth, requireRole } = require("../middleware");

router.use(checkAuth);

router
  .route("/")
  .get(requireRole(["admin", "manager", "employee"]), getAllNotes)
  .post(requireRole(["admin", "manager"]), createNote)
  .patch(requireRole(["admin", "manager", "employee"]), updateNote)
  .delete(requireRole(["admin", "manager"]), deleteNote);

module.exports = router;
