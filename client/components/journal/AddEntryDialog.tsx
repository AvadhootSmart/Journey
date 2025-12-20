"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createEntry } from "@/api/entry";

interface AddEntryDialogProps {
    children: React.ReactNode;
    journalId: string;
    onEntryCreated?: () => void;
}

export function AddEntryDialog({
    children,
    journalId,
    onEntryCreated,
}: AddEntryDialogProps) {
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!description.trim()) return;

        setLoading(true);
        try {
            await createEntry(journalId, description);
            setDescription("");
            setOpen(false);
            if (onEntryCreated) onEntryCreated();
        } catch (error) {
            console.error("Error creating entry", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Entry</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <textarea
                        placeholder="What's on your mind?..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full min-h-[150px] p-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        disabled={loading}
                    />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading || !description.trim()}>
                        {loading ? "Saving..." : "Save Entry"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
