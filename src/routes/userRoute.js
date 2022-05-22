import { Router } from "express";
import {
  register,
  login,
  findOneByJwt,
  updateUser,
  deleteUser,
} from "../controller/userController.js";
import auth from "../auth/auth.js";
import authorization from "../auth/authorization.js";

const router = Router();

router.route("/user/register").post(register);
router.route("/user/login").post(login);
router.route("/user/data").post(auth, findOneByJwt);
router.route("/user/:userId/update").put(authorization, updateUser); //passar o token no body, como em findOneByJwt
router.route("/user/:userId/delete").delete(authorization, deleteUser); //passar o token no body, como em findOneByJwt

export default router;
