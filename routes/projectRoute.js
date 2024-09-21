const { authentication, restrictTo } = require("../controller/authController");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controller/projectController");

const router = require("express").Router();

router.route("/create").post(authentication, restrictTo("1"), createProject);

router.route("/").get(authentication, restrictTo("1"), getAllProjects);

router
  .route("/:id")
  .get(authentication, restrictTo("1"), getProjectById)
  .patch(authentication, restrictTo("1"), updateProject)
  .delete(authentication, restrictTo("1"), deleteProject);

module.exports = router;
