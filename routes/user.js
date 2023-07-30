const router = require("express").Router();
const auth = require("../middlewares/auth");

const { getCurrentUser } = require("../controllers/user");

// CRUD

// CREATE

// READ
router.get("/me", auth, getCurrentUser);

// UPDATE

module.exports = router;
