import { Router } from "express";
import { isAuthenticated } from "../middleware/auth";
import { getUserJournals } from "../controllers/journal.controller";

const router = Router();

router.get("/journals", isAuthenticated, getUserJournals);

export { router as userRouter };
