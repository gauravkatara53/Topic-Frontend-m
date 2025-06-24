// src/pages/GoogleSuccessPage.tsx

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function GoogleSuccessPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const name = searchParams.get("name");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userName", name || "");
      window.location.href = "/";
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
      <div className="bg-white shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center gap-4 animate-fade-in">
        <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin" />
        <h1 className="text-2xl font-bold text-indigo-700">
          Logging you in...
        </h1>
        <p className="text-sm text-gray-500">
          Please wait while we log you in via Google.
        </p>
      </div>
    </div>
  );
}
