import axiosInstance from "@/lib/axios";

export class UserService {
  static async getUser() {
    try {
      const response = await axiosInstance.get("user/me");
      return response.data;
    } catch {
      throw new Error("Помилка отримання користувача");
    }
  }

  static async updateOpenaiApiKey(apiKey: string | null) {
    try {
      const respone = await axiosInstance.patch("user/openai-key", {
        openai_api_key: apiKey,
      });
      return respone.data;
    } catch (error: any) {
      console.log("error", error);

      // Переконаємося, що є `response` та `data`
      if (error.response && error.response.data) {
        if (error.response.data.message === "Невірний OpenAI API Key") {
          throw new Error("Невірний OpenAI API Key");
        }
      }

      throw new Error("Помилка оновлення API Key");
    }
  }
}
