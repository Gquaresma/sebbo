const express = require("express");
const userController = require("../controller/userController");
const auth = require("../auth/auth");
const authorization = require("../auth/authorization");

const router = express.Router();

router.route("/user/register").post(userController.register);
router.route("/user/login").post(userController.login);
router.route("/user/data").post(auth, userController.findOneByJwt);
router.route("/user/:userId/update").put(authorization, userController.updateUser); //passar o token no body, como em findOneByJwt
router.route("/user/:userId/delete").delete(authorization, userController.deleteUser); //passar o token no body, como em findOneByJwt

module.exports = router;
