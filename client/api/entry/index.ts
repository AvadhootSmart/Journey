import api from "@/config/axios.config";
import { getToken } from "@/lib/utils";
import { toast } from "sonner";

export async function createEntry(journalId: string, description: string) {
    const token = getToken();
    try {
        const response = await api.post(
            "/entry/create",
            {
                journalId,
                description,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (response.status === 201) {
            toast.success("Entry created successfully");
        }
        return response.data;
    } catch (error) {
        console.error("Error creating entry", error);
        toast.error("Error creating entry");
    }
}

export async function getEntriesForJournal(journalId: string) {
    const token = getToken();
    try {
        const response = await api.get(`/entry/journal/${journalId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching entries", error);
        toast.error("Error fetching entries");
    }
}

export async function getEntriesForJournalByDate(journalId: string, date: string) {
    const token = getToken();
    try {
        const response = await api.get(`/entry/journal/${journalId}/date/${date}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching entries for date", error);
        toast.error("Error fetching entries for date");
    }
}

export async function getEntriesForJournalDates(journalId: string) {
    const token = getToken();
    try {
        const response = await api.get(`/entry/journal/${journalId}/dates`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching entry dates", error);
        toast.error("Error fetching entry dates");
    }
}
