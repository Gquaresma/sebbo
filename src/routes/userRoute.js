const express = require("express");
const router = express.Router();
const usercontroller = require("../controller/usercontroller");


router.route("/user/register").post(usercontroller.register);
router.route("/user/login").post(usercontroller.login);
router.route("/user/data").post(usercontroller.findOneByJwt);

module.exports = router;
