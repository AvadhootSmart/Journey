import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { getUserJournals } from "../controllers/journal.controller.js";

const router = Router();

router.get("/journals", isAuthenticated, getUserJournals);

export { router as userRouter };
