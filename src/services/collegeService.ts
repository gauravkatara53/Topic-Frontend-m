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
    const res = await getAttendanceData();
    const data = res.data?.data;

    console.log("Attendance API response:", res.data); // ✅ LOG full response

    // Check if data is an array and first row is ["No Records Found !!!"]
    if (
      !res.data.success ||
      !Array.isArray(data) ||
      data.length === 0 ||
      (data.length === 1 &&
        data[0].length === 1 &&
        data[0][0] === "No Records Found !!!")
    ) {
      console.warn("No attendance records found."); // ✅ LOG
      return [];
    }

    const rows = data.slice(1); // Skip the header

    const subjects: SubjectData[] = rows.map((row: string[]) => {
      const [_, code, name, faculty, presentTotal] = row;
      const [present, total] = presentTotal.split("/").map(Number);
      return { code, name, faculty, present, total };
    });

    return subjects;
  } catch (err: any) {
    console.error("❌ Error fetching attendance:");
    console.error("🔸 Axios error:", err);
    console.error("🔸 Error response:", err.response);
    console.error("🔸 Status:", err.response?.status);
    console.error("🔸 Data:", err.response?.data);
    handleError(err); // toast or logger
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
