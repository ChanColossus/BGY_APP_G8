
const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const {
  newIg
} = require("../controllers/igController");
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.post(
  "/admin/ig/new",
  upload.array("gimages", 10),
  newIg
);
// router.get("/area", getArea);    
// router
//   .route("/admin/area/:areaId", isAuthenticatedUser, 
//   authorizeRoles("admin"))
//   .put(upload.array("bimages", 10), updateArea)
//   .delete(deleteArea);
module.exports = router