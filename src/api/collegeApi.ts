// src/api/collegeApi.ts
import { AxiosResponse } from "axios";
import apiService from "@/api/apiService";

export interface CollegeCredentials {
  userId: string;
  password: string;
}

export interface CollegeResponse {
  statusCode: number;
  data: {
    collegeId: string;
    collegePassword: string;
    [key: string]: any;
  };
  success: boolean;
  message: string;
  errors: any;
  timestamp: string;
}

// Fix: ✅ Return AxiosResponse
export const fillAttendanceDetail = (
  data: CollegeCredentials
): Promise<AxiosResponse<CollegeResponse>> => {
  return apiService.post("/college/fill/college", data);
};

export const getAttendanceData = () =>
  apiService.post("/college/get/attendance/data");

export const getOTP = (data: { email: string }) =>
  apiService.post("/otp/send-otp", data);

export const verifyOTP = (otp: string) =>
  apiService.post("/otp/verify-otp", { otp });
