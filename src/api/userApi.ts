import { apiService } from "./apiService";

// Login
export const loginUser = (data: any) => apiService.post("/auth/login", data);

// login with google

export const googleAuth = (data: any) => apiService.post("/auth/google", data);

// Register
export const registerUser = (data: any) =>
  apiService.post("/auth/register", data);

// get user profile
export const getUser = () => apiService.get("/auth/getUser");

export const updateProfileData = (data: any) =>
  apiService.put("/auth/update/data", data);
export const updateAvatar = (formData: FormData) =>
  apiService.patch("/auth/update-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const logoutUser = () => apiService.post("/auth/logout", {});
