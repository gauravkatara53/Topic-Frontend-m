import { apiService } from "./apiService";

export const getNews = () => apiService.get("/news/get/current/new");
