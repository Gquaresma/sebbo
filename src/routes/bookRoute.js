const express = require("express");
const bookcontroller = require("../controller/bookcontroller");
const auth = require("../auth/auth");
const roleAuth = require("../auth/roleAuth");
const router = express.Router();

router
  .route("/livro")
  .get(bookcontroller.findAll)
  .post(auth, roleAuth, bookcontroller.createBook);

router
  .route("/livro/:id")
  .get(bookcontroller.findOne)
  .put(auth, roleAuth, bookcontroller.updateBook)
  .delete(auth, roleAuth, bookcontroller.deleteBook);

module.exports = router;
