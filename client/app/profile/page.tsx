"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/store/user-store";
import { getUserJournals } from "@/api/journal";
import JournalCard from "@/components/journal/journal-card";
import CreateJournalModal from "@/components/journal/create-journal-modal";
import { Button } from "@/components/ui/button";
import { Plus, Book } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface Journal {
  id: string;
  title: string;
  description: string;
  users: {
    id: string;
    username: string;
    email: string;
  }[];
}

const ProfilePage = () => {
  const { user, token } = useUser();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJournals = async () => {
    try {
      const data = await getUserJournals();
      if (data) {
        setJournals(data);
      }
    } catch (error) {
      console.error("Failed to fetch journals", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchJournals();
  }, []);

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
        <Avatar className="h-24 w-24 text-4xl rounded-2xl">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>
            {user?.username?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">{user?.username}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Journals Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Book className="h-6 w-6" />
            Your Journals
          </h2>
          {journals.length > 0 && (
            <CreateJournalModal onJournalCreated={fetchJournals}>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Journal
              </Button>
            </CreateJournalModal>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
            ))}
          </div>
        ) : journals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journals.map((journal) => (
              <JournalCard
                key={journal.id}
                title={journal.title}
                description={journal.description || "No description"}
                users={journal.users.map((u) => ({
                  id: u.id,
                  name: u.username || "Unknown", // Map username to name
                  email: u.email,
                }))}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg bg-muted/50">
            <div className="bg-background p-4 rounded-full mb-4">
              <Book className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No journals yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              You haven't created or joined any journals. Start your journey by
              creating one.
            </p>
            <CreateJournalModal onJournalCreated={fetchJournals}>
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" /> Create Journal
              </Button>
            </CreateJournalModal>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
