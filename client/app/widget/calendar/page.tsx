"use client";

import { useEffect, useState, useMemo } from "react";
import { getUserJournals, getJournalById } from "@/api/journal";
import { getEntriesForJournalDates } from "@/api/entry";
import useUser from "@/store/user-store";
import { JournalCalendar } from "@/components/journal/JournalCalendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function WidgetCalendarPage() {
    const [journal, setJournal] = useState<any>(null);
    const [entryDates, setEntryDates] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user: currentUser, token } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                setError("Please log in to view the calendar.");
                setLoading(false);
                return;
            }

            try {
                const journals = await getUserJournals();
                if (!journals || journals.length === 0) {
                    setError("No journals found.");
                    setLoading(false);
                    return;
                }

                const firstJournal = journals[0];
                // Fetch full journal details if needed (users for colors)
                const journalData = await getJournalById(firstJournal.id);
                setJournal(journalData);

                const dates = await getEntriesForJournalDates(firstJournal.id);
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
            } catch (err) {
                console.error("Error fetching widget data:", err);
                setError("Failed to load calendar.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

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
            <div className="flex items-center justify-center min-h-screen bg-transparent p-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-transparent p-4 text-center">
                <p className="text-zinc-500 font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-2 sm:p-4 bg-transparent scale-90 sm:scale-100 origin-top">
            <div className="mb-4 text-center">
                <h2 className="text-lg font-bold truncate max-w-[250px] mx-auto">
                    {journal.title}
                </h2>
            </div>
            <JournalCalendar
                journalId={journal.id}
                currentUserId={currentUser?.id || null}
                entryDates={entryDates}
                userColors={userColors}
                journalCreatedAt={journal?.createdAt}
            />
        </div>
    );
}
