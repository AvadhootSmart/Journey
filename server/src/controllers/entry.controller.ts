import prisma from "../lib/prisma";
import type { AuthRequest } from "../middleware/auth";
import type { Response } from "express";

export async function createEntry(req: AuthRequest, res: Response) {
  try {
    const { journalId, description } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!journalId) {
      return res.status(400).json({ error: "Journal ID is required" });
    }

    const journal = await prisma.journal.findUnique({
      where: { id: journalId },
      include: {
        users: true,
      },
    });

    if (!journal) {
      return res.status(404).json({ error: "Journal not found" });
    }

    if (journal.users.some((user) => user.id !== userId)) {
      return res
        .status(400)
        .json({ error: "You are not a member of this journal" });
    }

    const entry = await prisma.entry.create({
      data: {
        description,
        journal: {
          connect: {
            id: journalId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return res.status(201).json(entry);
  } catch (error) {
    console.error("Error creating entry:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error });
  }
}

export async function getUserEntriesForJournal(
  req: AuthRequest,
  res: Response,
) {
  try {
    const userId = req.user?.userId;

    const { journalId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!journalId) {
      return res.status(400).json({ error: "Journal ID is required" });
    }

    const journal = await prisma.journal.findUnique({
      where: { id: journalId },
      include: {
        entries: {
          where: {
            user: {
              id: userId,
            },
          },
        },
      },
    });

    if (!journal) {
      return res.status(404).json({ error: "Journal not found" });
    }

    return res.status(200).json(journal.entries);
  } catch (error) {
    console.error("Error fetching user entries for journal", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error });
  }
}

export async function getEntriesForJournalByDate(
  req: AuthRequest,
  res: Response,
) {
  try {
    const { journalId, date } = req.params;

    if (!journalId || !date) {
      return res.status(400).json({ error: "Journal ID and Date is required" });
    }

    const entry = await prisma.entry.findMany({
      where: {
        journal: {
          id: journalId,
        },
        createdAt: {
          gte: new Date(date),
          lte: new Date(date),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    return res.status(200).json(entry);
  } catch (error) {
    console.error("Error fetching user entries for journal", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error });
  }
}

export async function getEntriesForJournal(req: AuthRequest, res: Response) {
  try {
    const { journalId } = req.params;

    if (!journalId) {
      return res.status(400).json({ error: "Journal ID is required" });
    }
    const entries = await prisma.entry.findMany({
      where: {
        journal: {
          id: journalId,
        },
      },
    });

    if (!entries) return res.status(404).json({ error: "Entries not found" });

    return res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching user entries for journal", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error });
  }
}

export async function getEntriesForJournalDates(
  req: AuthRequest,
  res: Response,
) {
  try {
    const { journalId } = req.params;

    if (!journalId) {
      return res.status(400).json({ error: "Journal ID is required" });
    }

    const entries = await prisma.entry.findMany({
      where: {
        journal: {
          id: journalId,
        },
      },
      select: {
        createdAt: true,
      },
    });

    if (!entries) return res.status(404).json({ error: "Entries not found" });

    return res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching user entries for journal", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error });
  }
}
