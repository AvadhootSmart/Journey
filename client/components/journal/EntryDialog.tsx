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
    imgs: string[];
    habits: string[];
    createdAt: string;
    userId: string;
    user: User;
}

interface EntryDialogProps {
    children: React.ReactNode;
    date: Date;
    journalId: string;
    currentUserId: string | null;
    journalCreatedAt?: string;
}

export function EntryDialog({
    children,
    date,
    journalId,
    currentUserId,
    journalCreatedAt,
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

    const calculateDay = () => {
        if (!journalCreatedAt) return null;
        const start = new Date(journalCreatedAt);
        start.setHours(0, 0, 0, 0);
        const current = new Date(date);
        current.setHours(0, 0, 0, 0);
        const diffTime = Math.abs(current.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const dayNumber = calculateDay();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:min-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-xl border-none shadow-2xl">
                <div className="sm:p-8 p-4 pb-4">
                    <DialogHeader className="mb-6 text-left">
                        <DialogTitle className="sm:text-2xl text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            <span>{formattedDate}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="bg-[#F5F2EE] dark:bg-zinc-900/50 p-4 rounded-2xl flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div
                                onClick={() => setFilterMine(!filterMine)}
                                className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative ${filterMine ? 'bg-[#40C18D]' : 'bg-zinc-300 dark:bg-zinc-700'
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${filterMine ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                />
                            </div>
                            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Show only my entries</span>
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-3xl" />
                                ))}
                            </div>
                        ) : filteredEntries.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                                {filteredEntries.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md"
                                    >
                                        {/* Image Section */}
                                        <div className="relative aspect-[4/5] overflow-hidden">
                                            {entry.imgs && entry.imgs.length > 0 ? (
                                                <img
                                                    src={entry.imgs[0]}
                                                    alt="Entry"
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900" />
                                            )}

                                            {/* Content Overlay */}
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20">
                                                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
                                                        Highlights
                                                    </p>
                                                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 leading-relaxed overflow-y-auto max-h-[400px]">
                                                        {entry.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Content */}
                                        <div className="p-5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-8 h-8 border-2 border-white dark:border-zinc-800 shadow-sm">
                                                    <AvatarFallback className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800">
                                                        {(entry.user.username || entry.user.email).charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                    {entry.user.username || "Anonymous"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-4 text-zinc-300">
                                    <p className="text-2xl">✍️</p>
                                </div>
                                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 italic">No entries yet</p>
                                <p className="text-sm text-zinc-500 mt-1 max-w-[200px]">Be the first one to share a moment today.</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

