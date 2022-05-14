const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

router.route("/user/register").post(userController.register);
router.route("/user/login").post(userController.login);
router.route("/user/data").post(userController.findOneByJwt);
router.route("/user/data/update").post(userController.updateUser); //passar o token no body, como em findOneByJwt
router.route("/user/data/delete").delete(userController.deleteUser); //passar o token no body, como em findOneByJwt

module.exports = router;
