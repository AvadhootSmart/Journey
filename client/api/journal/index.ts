import api from "@/config/axios.config";
import { getToken } from "@/lib/utils";
import { toast } from "sonner";

export async function createJournal(title: string, description: string) {
  const token = getToken();
  try {
    const response = await api.post(
      "/journal/create",
      {
        title,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 201) {
      toast.success("Journal created successfully");
    }
    return response.data;
  } catch (error) {
    console.error("Error creating journal", error);
    toast.error("Error creating journal");
  }
}

export async function getUserJournals() {
  const token = getToken();
  try {
    const response = await api.get("/user/journals", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user journals", error);
    toast.error("Error fetching user journals");
  }
}
