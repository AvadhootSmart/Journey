import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createEntry, getEntriesForJournal, getEntriesForJournalByDate, getEntriesForJournalDates, getUserEntriesForJournal } from "../controllers/entry.controller.js";

const router = Router();

router.post("/create", isAuthenticated, createEntry)
router.get("/user/:journalId", isAuthenticated, getUserEntriesForJournal)
router.get("/journal/:journalId/date/:date", isAuthenticated, getEntriesForJournalByDate)
router.get("/journal/:journalId", isAuthenticated, getEntriesForJournal)
router.get("/journal/:journalId/dates", isAuthenticated, getEntriesForJournalDates)

export { router as entryRouter };
