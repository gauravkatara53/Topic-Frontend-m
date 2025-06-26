// src/pages/GoogleSuccessPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function GoogleSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const name = searchParams.get("name") ?? "";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Missing token from Google callback.");
      return;
    }

    // Optional: save display name for UI
    localStorage.setItem("userName", name);

    // 🔄 Call backend to store token in HttpOnly cookie
    fetch("https://topic-backend-2rsf.onrender.com/api/v1/auth/save-token", {
      method: "POST",
      credentials: "include", // 👈 Required for cookie
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Token saving failed");
        }

        navigate("/"); // ✅ Redirect to home/dashboard
      })
      .catch((e) => {
        console.error("Failed to save token:", e);
        setError("Login failed, please try again.");
        setTimeout(() => navigate("/login"), 3000);
      });
  }, [token, name, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
      <div className="bg-white shadow-2xl rounded-2xl p-8 flex flex-col items-center gap-4 animate-fade-in">
        {!error ? (
          <>
            <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin" />
            <h1 className="text-2xl font-bold text-indigo-700">
              Logging you in…
            </h1>
            <p className="text-sm text-gray-500">
              Please wait while we finish your Google sign-in.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-600">Oops!</h1>
            <p className="text-sm text-gray-500">{error}</p>
          </>
        )}
      </div>
    </div>
  );
}
