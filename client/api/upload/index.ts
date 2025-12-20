import api from "@/config/axios.config";
import { getToken } from "@/lib/utils";
import { toast } from "sonner";

export async function uploadImage(file: File) {
    const token = getToken();
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await api.post("/upload", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error("Error uploading image", error);
        toast.error("Error uploading image");
        throw error;
    }
}
