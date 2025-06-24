// src/types/user.d.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  isActive: boolean;
  role: string;
  isUploaderVerified: boolean;
  createdAt: string;
  updatedAt: string;
  collegeId: string;
  isLoggedIn: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
  errors?: any;
  timestamp: string;
}
