const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

router.route("/user/register").post(userController.register);
router.route("/user/login").post(userController.login);
router.route("/user/data").post(userController.findOneByJwt);

module.exports = router;
