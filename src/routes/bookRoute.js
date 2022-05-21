import { Router } from "express";
const router = Router();
import {
  findAll,
  createBook,
  findOne,
  updateBook,
  deleteBook,
} from "../controller/bookcontroller.js";
import auth from "../auth/auth.js";
import roleAuth from "../auth/roleAuth.js";
import imgUpload from "../Middlewares/imgUpload.js";

router.route("/livro").get(findAll).post(auth, roleAuth, imgUpload, createBook);

router
  .route("/livro/:id")
  .get(findOne)
  .put(auth, roleAuth, updateBook)
  .delete(auth, roleAuth, deleteBook);

export default router;


