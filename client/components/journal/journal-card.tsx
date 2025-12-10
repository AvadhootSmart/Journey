import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
    id: string;
    name: string;
    email: string;
}

interface JournalCardProps {
    title: string;
    description: string;
    users: User[];
}

const JournalCard = ({ title, description, users }: JournalCardProps) => {
    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                <CardDescription className="line-clamp-2">
                    {description}
                </CardDescription>
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
