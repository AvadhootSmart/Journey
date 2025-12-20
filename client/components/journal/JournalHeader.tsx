"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Camera } from "lucide-react";
import { AddEntryDialog } from "./AddEntryDialog";

interface User {
    id: string;
    username: string | null;
    email: string;
}

interface JournalHeaderProps {
    journalId: string;
    title: string;
    description: string | null;
    users: User[];
    onEntryCreated?: () => void;
}

export function JournalHeader({ journalId, title, description, users, onEntryCreated }: JournalHeaderProps) {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:pt-8">
            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-3xl border border-border p-5 sm:p-8 shadow-lg">
                {/* Subtle background plant icon or pattern could go here */}
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 sm:space-y-2">
                        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                            {title}
                        </h1>
                        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center -space-x-2">
                                {users.slice(0, 5).map((user) => (
                                    <Avatar key={user.id} className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-white dark:border-zinc-800 shadow-sm">
                                        <AvatarImage src={`/avatars/${user.id}.png`} />
                                        <AvatarFallback className="text-[10px] sm:text-xs">
                                            {(user.username || user.email).slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                            <span className="text-zinc-500 text-sm font-medium">
                                {users.length} {users.length === 1 ? 'member' : 'members'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <AddEntryDialog journalId={journalId} onEntryCreated={onEntryCreated}>
                            <Button className="w-full sm:w-auto rounded-xl px-5 py-4 sm:px-6 sm:py-6 h-auto flex items-center justify-center gap-2 font-semibold shadow-md transition-all active:scale-95 dark:bg-[#FF7A54] dark:hover:bg-[#ff693f] dark:text-black">
                                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Upload Today's Journal</span>
                            </Button>
                        </AddEntryDialog>
                        {/* <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 text-white rounded-xl w-12 h-12">
                            <Settings className="w-6 h-6" />
                        </Button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
