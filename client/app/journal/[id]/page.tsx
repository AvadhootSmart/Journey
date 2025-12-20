"use client";

import { useEffect, useState, use, useMemo } from "react";
import { getJournalById } from "@/api/journal";
import { getEntriesForJournalDates } from "@/api/entry";
import useUser from "@/store/user-store";
import { JournalHeader } from "@/components/journal/JournalHeader";
import { JournalCalendar } from "@/components/journal/JournalCalendar";
import { Skeleton } from "@/components/ui/skeleton";

export default function JournalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [journal, setJournal] = useState<any>(null);
  const [entryDates, setEntryDates] = useState<Record<string, string[]>>({}); // "YYYY-MM-DD": [userId1, userId2]
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useUser();

  const fetchData = async () => {
    try {
      const journalData = await getJournalById(id);
      setJournal(journalData);

      const dates = await getEntriesForJournalDates(id);
      if (dates) {
        const dateMap: Record<string, string[]> = {};
        dates.forEach((d: any) => {
          const dateStr = new Date(d.createdAt).toISOString().split("T")[0];
          if (!dateMap[dateStr]) dateMap[dateStr] = [];
          if (!dateMap[dateStr].includes(d.userId)) {
            dateMap[dateStr].push(d.userId);
          }
        });
        setEntryDates(dateMap);
      }
    } catch (error) {
      console.error("Error fetching journal data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Color palette for users
  const userColors = useMemo(() => {
    if (!journal?.users) return {};
    const colors = ["#4285F4", "#DB4437", "#F4B400", "#0F9D58", "#AB47BC", "#00ACC1", "#FF7043"];
    const map: Record<string, string> = {};
    journal.users.forEach((user: any, index: number) => {
      map[user.id] = colors[index % colors.length];
    });
    return map;
  }, [journal]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-white dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-7xl px-4 pt-8">
          <Skeleton className="h-48 w-full rounded-3xl" />
        </div>
        <div className="flex-grow p-4 mx-auto w-full max-w-7xl">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-medium text-zinc-500">Journal not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] dark:bg-zinc-950 relative overflow-x-hidden pb-20">
      <JournalHeader
        journalId={id}
        title={journal.title}
        description={journal.description}
        users={journal.users}
        onEntryCreated={fetchData}
      />

      <div className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <JournalCalendar
            journalId={id}
            currentUserId={currentUser?.id || null}
            entryDates={entryDates}
            userColors={userColors}
            journalCreatedAt={journal?.createdAt}
          />
        </div>
      </div>
    </div>
  );
}
