import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createJournal, getJournalById, getJournalUsers, joinJournal } from "../controllers/journal.controller.js";

const router = Router();

router.post("/create", isAuthenticated, createJournal)
router.post("/join", isAuthenticated, joinJournal)

router.get("/users/:journalId", isAuthenticated, getJournalUsers)
router.get("/:journalId", isAuthenticated, getJournalById)

export { router as journalRouter };
