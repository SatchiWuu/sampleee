import express from "express";
import { newOrder } from "../controllers/OrderController.js";
import { upload } from "../utils/multer.js";
const router = express.Router();

router.post("/new/order", newOrder);

export default router;
