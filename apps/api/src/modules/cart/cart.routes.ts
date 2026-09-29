import { Router } from "express";
import { CartController } from "./cart.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { addToCartSchema, updateCartItemSchema } from "@indigo/shared";

const router = Router();

router.use(requireAuth);

router.get("/", CartController.getCart);
router.post("/items", validate(addToCartSchema), CartController.addItem);
router.patch("/items/:itemId", validate(updateCartItemSchema), CartController.updateItem);
router.delete("/items/:itemId", CartController.removeItem);
router.delete("/", CartController.clearCart);

export default router;
