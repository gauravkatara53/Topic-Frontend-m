import React, { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "@/api/authApi";
import { ParsedUser, parseUser } from "@/services/authService";

interface AuthContextType {
  user: ParsedUser;
}

const defaultUser: ParsedUser = {
  id: "",
  name: "",
  role: "",
  isLoggedIn: false,
  isUploaderVerified: false,
  isAttendancePortalConnected: false,
  collegeId: null,
  email: "",
  avatar: "",
  bio: "",
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ParsedUser>(defaultUser);

  const fetchUser = async () => {
    try {
      const res = await getUser();
      const parsed = parseUser(res);
      setUser(parsed);
    } catch (error) {
      setUser(defaultUser);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
