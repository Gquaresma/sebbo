const express = require("express");
const bookcontroller = require("../controller/bookcontroller");
const auth = require("../auth/auth");
const router = express.Router();

router.use(auth);

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
