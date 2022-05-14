const express = require("express");
const itemController = require("../controller/itemController");
const auth = require("../auth/auth");

const router = express.Router();

// router.use(auth);

router.route("/user/:userId/:bookId/purchase").post(itemController.createPurchase);
router.route("/user/:userId/purchase/cart").get(auth, itemController.getCartPurchase);
router.route("/user/:userId/purchase/:purchaseId").get(itemController.getPurchaseById);
router.route("/user/:userId/purchase/cart/add").post(itemController.addItem);
router.route("/user/:userId/purchase/cart/remove").post(itemController.removerItem);
router.route("/user/:userId/purchase/cart/add-quantity").post(itemController.addQuantity);
router.route("/user/:userId/purchase/cart/remove-quantity").post(itemController.removeQuantity);
router.route("/user/:userId/purchase/cart/confirm").post(itemController.confirmPurchase);


module.exports = router;
