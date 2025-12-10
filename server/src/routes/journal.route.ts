import { Router } from "express";
import { isAuthenticated } from "../middleware/auth";
import { createJournal, getJournalUsers, joinJournal } from "../controllers/journal.controller";

const router = Router();

router.post("/create", isAuthenticated, createJournal)
router.post("/join", isAuthenticated, joinJournal)

router.get("/users/:journalId", isAuthenticated, getJournalUsers)

export { router as journalRouter };
