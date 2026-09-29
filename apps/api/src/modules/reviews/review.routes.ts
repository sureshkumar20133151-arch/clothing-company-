import { Router } from "express";
import { ReviewController } from "./review.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/product/:productId", ReviewController.listByProduct);
router.post("/", requireAuth, ReviewController.create);

export default router;
