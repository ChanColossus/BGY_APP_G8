
const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const {
  newTool,getTool
  } = require("../controllers/toolController");
const { isAuthenticatedUser,authorizeRoles } = require('../middlewares/auth');


router.post(
    "/admin/tool/new",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    upload.array("timages", 10),
    newTool
  );
router.get("/tool", getTool);
// router
//   .route("/admin/area/:areaId", isAuthenticatedUser, 
//   authorizeRoles("admin"))
//   .put(upload.array("bimages", 10), updateArea)
//   .delete(deleteArea);
module.exports = router