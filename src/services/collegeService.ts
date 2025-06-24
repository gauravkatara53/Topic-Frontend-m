// src/services/collegeService.ts
import {
  fillAttendanceDetail,
  getAttendanceData,
  getOTP,
  verifyOTP,
} from "@/api/collegeApi";
import { errorHandler } from "@/utils/errorHandler";
import { AxiosResponse } from "axios";

const { handleError } = errorHandler();

interface SubjectData {
  code: string;
  name: string;
  faculty: string;
  present: number;
  total: number;
}

// ✅ Submit college credentials
export const submitCollegeCredentials = async (data: {
  userId: string;
  password: string;
}) => {
  try {
    const res: AxiosResponse = await fillAttendanceDetail(data);
    console.log("API Response:", res);

    const { data: resData } = res;

    if (resData?.data?.collegeId && resData?.data?.collegePassword) {
      return resData.data; // { collegeId, collegePassword, ... }
    } else {
      throw new Error("Invalid credentials or missing data");
    }
  } catch (err) {
    handleError(err);
    throw err;
  }
};

// ✅ Parse attendance data
export const fetchParsedAttendance = async (): Promise<SubjectData[]> => {
  try {
    const res = await getAttendanceData({});
    if (!res.data.success || !res.data.data || !Array.isArray(res.data.data))
      return [];

    const rows = res.data.data.slice(1); // skip header

    const subjects: SubjectData[] = rows.map((row: string[]) => {
      const [_, code, name, faculty, presentTotal] = row;
      const [present, total] = presentTotal.split("/").map(Number);
      return { code, name, faculty, present, total };
    });

    return subjects;
  } catch (err) {
    handleError(err);
    return [];
  }
};

export const getOTPService = async (email: string) => {
  try {
    const res = await getOTP({ email });
    return res;
  } catch (err) {
    handleError(err);
    console.error("Failed to send OTP", err);
    throw err;
  }
};

export const verifyOTPService = async (otp: string) => {
  try {
    const res = await verifyOTP(otp);
    return res;
  } catch (err) {
    handleError(err);
    console.error("Failed to verify OTP", err);
    throw err;
  }
};
