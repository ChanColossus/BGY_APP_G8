
const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const {
<<<<<<< HEAD
  newQuiz, getQuiz, updateQuiz, deleteQuiz,getSingleQuiz
=======
  newQuiz, getQuiz, updateQuiz, deleteQuiz
>>>>>>> 0a83a8e43be353d042e4fe561c49ddb94c70531a
} = require("../controllers/quizController");
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// router.use();
router.post(
  "/admin/quiz/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.array(),
  newQuiz
);
router.get("/quiz", getQuiz);
router
  .route("/admin/quiz/:quizId", isAuthenticatedUser,
    authorizeRoles("admin"))
  .put(upload.array(),updateQuiz)
  .delete(deleteQuiz);
<<<<<<< HEAD
  router.get("/quiz/:id", getSingleQuiz);
=======
>>>>>>> 0a83a8e43be353d042e4fe561c49ddb94c70531a
module.exports = router