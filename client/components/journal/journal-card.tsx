import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

interface User {
    id: string;
    name: string;
    email: string;
}

interface JournalCardProps {
    id: string;
    title: string;
    description: string;
    users: User[];
}

const JournalCard = ({ id, title, description, users }: JournalCardProps) => {
    const copyId = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(id);
        toast.success("Journal ID copied to clipboard");
    };

    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer relative group">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                            {description}
                        </CardDescription>
                    </div>
                    <Button
                        variant="default"
                        size="icon"
                        className="rounded-2xl cursor-pointer"
                        onClick={copyId}
                        title="Invite to journal"
                    >
                        <UserPlus className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mt-4">
                    <div className="flex -space-x-2 overflow-hidden">
                        {users.map((user) => (
                            <Avatar
                                key={user.id}
                                className="inline-block h-8 w-8 rounded-full ring-2 ring-background"
                            >
                                <AvatarImage src="" alt={user.name} />
                                <AvatarFallback>
                                    {user.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        ))}
                        {users.length === 0 && (
                            <span className="text-sm text-muted-foreground">No members</span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default JournalCard;
