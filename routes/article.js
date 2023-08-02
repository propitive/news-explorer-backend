const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getArticles,
  addArticle,
  removeArticle,
} = require("../controllers/article");

const {
  validateArticleInfoBody,
  validateArticleId,
} = require("../middlewares/validation");

// CRUD

// CREATE
router.post("/", auth, validateArticleInfoBody, addArticle);

// UPDATE

// DELETE
router.delete("/:articleId", auth, validateArticleId, removeArticle);

// READ
router.get("/", auth, getArticles);

module.exports = router;
