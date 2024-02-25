
const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const {
<<<<<<< HEAD
  newTool,getTool,updateTool,deleteTool,getSingleTool
=======
  newTool,getTool,updateTool,deleteTool
>>>>>>> 0a83a8e43be353d042e4fe561c49ddb94c70531a
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
router
  .route("/admin/tool/:toolId", isAuthenticatedUser, 
  authorizeRoles("admin"))
  .put(upload.array("timages", 10), updateTool)
  .delete(deleteTool);
<<<<<<< HEAD
router.get("/tool/:id", getSingleTool);
=======
>>>>>>> 0a83a8e43be353d042e4fe561c49ddb94c70531a
module.exports = router