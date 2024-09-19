const { createProject } = require("../controller/projectController");

const router = require("express").Router();

router.route("/create").post(createProject);



module.exports = router;