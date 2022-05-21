import { Router } from "express";
import {
  getPurchases,
  createPurchase,
  getCartPurchase,
  getPurchaseById,
  addItem,
  removerItem,
  addQuantity,
  removeQuantity,
  confirmPurchase,
} from "../controller/itemController.js";
import authorization from "../auth/authorization.js";

const router = Router();

// router.use(authorization);

router.route("/user/:userId/purchase").get(authorization, getPurchases);
router.route("/user/:userId/purchase").post(authorization, createPurchase);
router.route("/user/:userId/purchase/cart").get(authorization, getCartPurchase);
router
  .route("/user/:userId/purchase/:purchaseId")
  .get(authorization, getPurchaseById);
router.route("/user/:userId/purchase/cart/add").post(authorization, addItem);
router
  .route("/user/:userId/purchase/cart/remove")
  .post(authorization, removerItem);
router
  .route("/user/:userId/purchase/cart/add-quantity")
  .post(authorization, addQuantity);
router
  .route("/user/:userId/purchase/cart/remove-quantity")
  .post(authorization, removeQuantity);
router
  .route("/user/:userId/purchase/cart/confirm")
  .post(authorization, confirmPurchase);

export default router;
