import axiosInstance from "@/lib/axios";

export class DiscordAccountService {
  static async getAll() {
    try {
      const response = await axiosInstance.get("/discord-accounts");
      return response.data;
    } catch {
      throw new Error("Не вдалося отримати акаунти");
    }
  }

  static async create(data: { name: string; accountToken: string }) {
    try {
      const response = await axiosInstance.post("/discord-accounts", data);
      return response.data;
    } catch (error) {
      if (error.response.data.message === "Невірний токен Discord акаунта") {
        throw new Error("Невірний токен Discord акаунта");
      } else {
        throw new Error("Не вдалося створити акаунт");
      }
    }
  }

  static async update(
    id: string,
    data: { name: string; accountToken: string }
  ) {
    try {
      const response = await axiosInstance.patch(
        `/discord-accounts/${id}`,
        data
      );
      return response.data;
    } catch {
      throw new Error("Не вдалося оновити акаунт");
    }
  }

  static async delete(id: string) {
    try {
      const response = await axiosInstance.delete(`/discord-accounts/${id}`);
      return response.data;
    } catch {
      throw new Error("Не вдалося видалити акаунт");
    }
  }
}
