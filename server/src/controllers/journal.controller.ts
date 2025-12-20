import prisma from "../lib/prisma.js";
import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";

export async function createJournal(req: AuthRequest, res: Response) {
  try {
    const { title, description } = req.body;

    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
    }

    if (title === "") {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const newJournal = await prisma.journal.create({
      data: {
        title,
        description,
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.status(201).json(newJournal);
  } catch (error) {
    console.error("Error creating journal:", error);
    res.status(500).json({ error: "Internal server error", message: error });
  }
}

export async function joinJournal(req: AuthRequest, res: Response) {
  try {
    const { journalId } = req.body;

    const userId = req.user?.userId;

    if (!journalId) {
      return res.status(400).json({ error: "Journal ID is required" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
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

    if (journal.users.some((user) => user.id === userId)) {
      return res
        .status(400)
        .json({ error: "You are already a member of this journal" });
    }

    await prisma.journal.update({
      where: { id: journalId },
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return res
      .status(200)
      .json({ message: `${userId} has joined journal ${journal.id}` });
  } catch (error) {
    console.error("Invite error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error });
  }
}

export async function getJournalUsers(req: AuthRequest, res: Response) {
  try {
    const { journalId } = req.params;

    if (!journalId) {
      return res.status(400).json({ error: "Journal ID is required" });
    }
    const journal = await prisma.journal.findUnique({
      where: { id: journalId },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!journal) {
      return res.status(404).json({ error: "Journal not found" });
    }

    return res.status(200).json(journal.users);
  } catch (error) {
    console.error("Error getting journal users:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error });
  }
}

export async function getUserJournals(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        journals: {
          select: {
            id: true,
            title: true,
            description: true,
            users: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user.journals);
  } catch (error) {
    console.error("Error getting user journals:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error });
  }
}

export async function getJournalById(req: AuthRequest, res: Response) {
  try {
    const { journalId } = req.params;

    if (!journalId) {
      return res.status(400).json({ error: "Journal ID is required" });
    }

    const journal = await prisma.journal.findUnique({
      where: { id: journalId },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!journal) {
      return res.status(404).json({ error: "Journal not found" });
    }

    return res.status(200).json(journal);
  } catch (error) {
    console.error("Error getting journal by id:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error });
  }
}

