import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createJournal } from "@/api/journal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreateJournalModalProps {
    children: React.ReactNode;
    onJournalCreated?: () => void;
}

const CreateJournalModal = ({ children, onJournalCreated }: CreateJournalModalProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const res = await createJournal(title, description);
            if (res) {
                setOpen(false);
                setTitle("");
                setDescription("");
                if (onJournalCreated) {
                    onJournalCreated();
                }
                router.refresh(); // Refresh to show new journal
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Journal</DialogTitle>
                    <DialogDescription>
                        Create a new journal to start documenting your journey.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="col-span-3"
                            placeholder="My Awesome Journey"
                        />
                    </div>
                    <div className="space-y-2 mb-2">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                            placeholder="A place for my thoughts..."
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Journal"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateJournalModal;
