
const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const {
    newReport,getReport,updateReport,getSingleReport
  } = require("../controllers/reportController");
const { isAuthenticatedUser,authorizeRoles } = require('../middlewares/auth');

router.post(
    "/admin/report/new",
    isAuthenticatedUser,
    // authorizeRoles("admin"),
    newReport
  );
router.get("/reports", getReport);
router
  .route("/admin/report/:id", 
   isAuthenticatedUser) 
  // authorizeRoles("admin"))
,updateReport;
//   .delete(deleteDisaster);
router.get("/report/:id", getSingleReport);
module.exports = router;