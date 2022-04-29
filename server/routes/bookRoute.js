const express = require("express");
const bookcontroller = require("../controller/bookcontroller");
const router = express.Router();

router
  .route("/livro")
  .get(bookcontroller.findAll)
  .post(bookcontroller.createBook);

router
  .route("/livro/:id")
  .get(bookcontroller.findOne)
  .put(bookcontroller.updateBook)
  .delete(bookcontroller.deleteBook);

module.exports = router;
