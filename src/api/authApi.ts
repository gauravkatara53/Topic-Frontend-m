import { apiService } from "./apiService";

export const getUser = () => apiService.get("/auth/getUser");
