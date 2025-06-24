import {
  loginUser,
  registerUser,
  googleAuth,
  getUser,
  updateProfileData,
  updateAvatar,
  logoutUser,
} from "../api/userApi";
import { showError, showSuccess } from "../utils/errorHandler";
import { errorHandler } from "@/utils/errorHandler";

const { handleError } = errorHandler();

export const login = async (data: any) => {
  try {
    const user = await loginUser(data);
    showSuccess("Login successful!");
    return user;
  } catch (error) {
    showError(error);
    throw error;
  }
};

export const googleLogin = async (data: any) => {
  try {
    const user = await googleAuth(data);
    showSuccess("Google login successful!");
    return user;
  } catch (error) {
    showError(error);
    throw error;
  }
};

export const register = async (data: any) => {
  try {
    const user = await registerUser(data);
    showSuccess("Registration successful!");
    return user;
  } catch (error) {
    showError(error);
    throw error;
  }
};

export const userProfileData = async () => {
  try {
    const res = await getUser();
    if (res.success && res.data) {
      return res.data;
    } else {
      throw res.message || "Failed to fetch user.";
    }
  } catch (error) {
    handleError(error);
    return null;
  }
};

// 1. Update Profile (Name, Phone, Gender, Bio)
export const updateProfile = async (data: any) => {
  try {
    const res = await updateProfileData(data);
    if (res.success && res.data) {
      showSuccess(res.message || "Profile updated successfully");
      return res.data;
    } else {
      throw res.message || "Failed to update profile.";
    }
  } catch (error) {
    handleError(error);
    return null;
  }
};

// 2. Update Avatar Image
export const updateProfileAvatar = async (data: any) => {
  try {
    const res = await updateAvatar(data);
    if (res.success && res.data) {
      showSuccess(res.message || "Avatar updated successfully");
      return res.data;
    } else {
      throw res.message || "Failed to update avatar.";
    }
  } catch (error) {
    handleError(error);
    return null;
  }
};

// 3. Logout
export const logout = async () => {
  try {
    const res = await logoutUser();
    if (res.success) {
      showSuccess(res.message || "Logged out successfully");
      return true;
    } else {
      throw res.message || "Logout failed.";
    }
  } catch (error) {
    handleError(error);
    return false;
  }
};
