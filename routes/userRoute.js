const express = require("express");
const router = express.Router();
const usercontroller = require("../controller/usercontroller");

router.route("/user/register").post(usercontroller.register);
router.route("/user/login").post(usercontroller.login);

module.exports = router;
