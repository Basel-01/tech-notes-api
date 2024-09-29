const router = require("express").Router();

const {
  createDefaultUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const { checkAuth, requireRole } = require("../middleware");

router.route("/create-default-user").post(createDefaultUser);

router.use(checkAuth);

router
  .route("/")
  .get(requireRole(["admin", "manager"]), getAllUsers)
  .post(requireRole(["admin", "manager"]), createUser)
  .patch(requireRole(["admin", "manager"]), updateUser)
  .delete(requireRole(["admin", "manager"]), deleteUser);

module.exports = router;
