// import { createContext, useContext, useEffect, useState } from "react";
// import { apiService } from "../APIService/ApiService";

// interface AuthContextType {
//   isAuthenticated: boolean;
//   setIsAuthenticated: (value: boolean) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         await apiService.get("/partner/verify"); // ✅ Check if user is logged in
//         setIsAuthenticated(true);
//       } catch (error) {
//         setIsAuthenticated(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
