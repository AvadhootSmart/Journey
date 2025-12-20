import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { getEntriesForJournalByDate } from "@/api/entry";

interface User {
    id: string;
    username: string | null;
    email: string;
}

interface Entry {
    id: string;
    description: string;
    createdAt: string;
    userId: string;
    user: User;
}

interface EntryDialogProps {
    children: React.ReactNode;
    date: Date;
    journalId: string;
    currentUserId: string | null;
}

export function EntryDialog({
    children,
    date,
    journalId,
    currentUserId,
}: EntryDialogProps) {
    const [open, setOpen] = useState(false);
    const [filterMine, setFilterMine] = useState(false);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            const fetchEntries = async () => {
                setLoading(true);
                try {
                    const dateStr = date.toISOString().split("T")[0];
                    const data = await getEntriesForJournalByDate(journalId, dateStr);
                    setEntries(data || []);
                } catch (error) {
                    console.error("Error fetching entries", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchEntries();
        }
    }, [open, date, journalId]);

    const filteredEntries = filterMine
        ? entries.filter((e) => e.userId === currentUserId)
        : entries;

    const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="min-w-[40vw] max-h-[80vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold text-left">{formattedDate}</DialogTitle>
                        </div>
                        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg">
                            <button
                                onClick={() => setFilterMine(false)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${!filterMine
                                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterMine(true)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterMine
                                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                    }`}
                            >
                                Mine
                            </button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        <div className="py-20 text-center text-zinc-500">Loading...</div>
                    ) : filteredEntries.length > 0 ? (
                        filteredEntries.map((entry) => (
                            <Card key={entry.id} className="p-4 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50">
                                <div className="flex items-start gap-3">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={`/avatars/${entry.userId}.png`} />
                                        <AvatarFallback className="text-xs">
                                            {(entry.user.username || entry.user.email).charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                {entry.user.username || entry.user.email}
                                            </span>
                                            <span className="text-xs text-zinc-500">
                                                {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                            {entry.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4 text-zinc-400">
                                ∅
                            </div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 italic">No entries found</p>
                            <p className="text-xs text-zinc-500 mt-1">Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

