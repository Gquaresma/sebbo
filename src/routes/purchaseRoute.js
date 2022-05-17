const express = require("express");
const itemController = require("../controller/itemController");
const authorization = require("../auth/authorization");

const router = express.Router();

// router.use(authorization);

router.route("/user/:userId/purchase").get(authorization, itemController.getPurchases);
router.route("/user/:userId/purchase").post(authorization, itemController.createPurchase);
router.route("/user/:userId/purchase/cart").get(authorization, itemController.getCartPurchase);
router.route("/user/:userId/purchase/:purchaseId").get(authorization, itemController.getPurchaseById);
router.route("/user/:userId/purchase/cart/add").post(authorization, itemController.addItem);
router.route("/user/:userId/purchase/cart/remove").post(authorization, itemController.removerItem);
router.route("/user/:userId/purchase/cart/add-quantity").post(authorization, itemController.addQuantity);
router.route("/user/:userId/purchase/cart/remove-quantity").post(authorization, itemController.removeQuantity);
router.route("/user/:userId/purchase/cart/confirm").post(authorization, itemController.confirmPurchase);


module.exports = router;
