
const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const {
<<<<<<< HEAD
  newIg,getIg,getSingleIg,deleteIg,updateIg
=======
  newIg
>>>>>>> 0a83a8e43be353d042e4fe561c49ddb94c70531a
} = require("../controllers/igController");
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.post(
  "/admin/ig/new",
  upload.array("gimages", 10),
  newIg
);
<<<<<<< HEAD
router.get("/ig", getIg);    
router.get("/ig/:id", getSingleIg);
router
  .route("/admin/ig/:id", isAuthenticatedUser, 
  authorizeRoles("admin"))
  .put(upload.array("gimages", 10), updateIg)
  .delete(deleteIg);
=======
// router.get("/area", getArea);    
// router
//   .route("/admin/area/:areaId", isAuthenticatedUser, 
//   authorizeRoles("admin"))
//   .put(upload.array("bimages", 10), updateArea)
//   .delete(deleteArea);
>>>>>>> 0a83a8e43be353d042e4fe561c49ddb94c70531a
module.exports = router