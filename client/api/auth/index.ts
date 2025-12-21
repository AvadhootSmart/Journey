import api from "@/config/axios.config";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("auth error", error);
    throw error;
  }
};

export const registerUser = async (
  email: string,
  username: string,
  password: string,
) => {
  try {
    const response = await api.post("/auth/register", {
      email,
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("auth error", error);
    throw error;
  }
};

export const getMe = async (token: string) => {
  try {
    const response = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user", error);
    throw error;
  }
};

