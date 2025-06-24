export interface ParsedUser {
  id: string;
  name: string;
  role: string;
  isLoggedIn: boolean;
  isUploaderVerified: boolean;
  isAttendancePortalConnected: boolean;
  collegeId: string | null;
  email: string;
  avatar: string;
  bio: string;
}

export const parseUser = (response: any): ParsedUser => {
  const user = response?.data;
  const isValidUser = response?.success && user?._id;

  return {
    id: isValidUser ? user._id || "" : "",
    name: isValidUser ? user.name || "" : "",
    role: isValidUser ? user.role || "" : "",
    email: isValidUser ? user.email || "" : "",
    avatar: isValidUser ? user.avatar || "" : "",
    bio: isValidUser ? user.bio || "" : "",
    isLoggedIn: isValidUser ? user.isLoggedIn === true : false, // ✅ trust backend
    isUploaderVerified: isValidUser ? user.isUploaderVerified ?? false : false,
    collegeId: isValidUser ? user.collegeId ?? null : null,
    isAttendancePortalConnected: isValidUser
      ? user.isAttendancePortalConnected === true
      : false,
  };
};
