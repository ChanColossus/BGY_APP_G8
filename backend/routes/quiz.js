
const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const {
    newQuiz,getQuiz,updateQuiz,deleteQuiz
  } = require("../controllers/quizController");
const { isAuthenticatedUser,authorizeRoles } = require('../middlewares/auth');

router.use(upload.array());
router.post(
    "/admin/quiz/new",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    newQuiz
  );
router.get("/quiz", getQuiz);
router
  .route("/admin/quiz/:quizId", isAuthenticatedUser, 
  authorizeRoles("admin"))
  .put(updateQuiz)
  .delete(deleteQuiz);
module.exports = router