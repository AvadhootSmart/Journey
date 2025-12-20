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
import { uploadImage } from "@/api/upload";
import { ImageIcon, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

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
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<string[]>([]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const toastId = toast.loading("Uploading image...");
        try {
            const data = await uploadImage(file);
            setImages((prev) => [...prev, data.url]);
            toast.success("Image uploaded", { id: toastId });
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Upload failed", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!description.trim() && images.length === 0) return;

        setLoading(true);
        try {
            await createEntry(journalId, description, images);
            setDescription("");
            setImages([]);
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
                <div className="py-4 space-y-4">
                    <textarea
                        placeholder="What's on your mind?..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full min-h-[120px] p-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        disabled={loading}
                    />

                    {/* Image Previews */}
                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {images.map((url, index) => (
                                <div key={url} className="relative group w-20 h-20 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-800">
                                    <Image
                                        src={url}
                                        alt="Uploaded"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <label className={`flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={uploading || loading}
                            />
                            {uploading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <ImageIcon className="w-4 h-4" />
                            )}
                            <span className="text-sm font-medium">Add Image</span>
                        </label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading || uploading || (!description.trim() && images.length === 0)}>
                        {loading ? "Saving..." : "Save Entry"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
