import { Router } from "express";
import { getMsgs, sendMsg } from "../controllers/msgs.controller";

const router = Router();

router.get("/msgs", getMsgs);
router.post("/msgs", sendMsg);

export default router;  