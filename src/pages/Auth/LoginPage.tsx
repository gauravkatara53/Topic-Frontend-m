import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
// import { FcGoogle } from "react-icons/fc";
import { login } from "@/services/userService";
import { errorHandler } from "@/utils/errorHandler"; // ✅ Correct utility
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { verifyGoogleToken } from "@/api/userApi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { showSuccess, handleError } = errorHandler(); // ✅ Using correct toast handler

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login({ email, password });
      showSuccess(`Welcome, ${user.data.name}`);
      window.location.href = "/";
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Side: Form Section */}
      <div className="w-full md:w-2/5 bg-white flex flex-col p-8 md:p-12">
        {/* Logo */}
        <div className="text-3xl font-bold text-[#7FD0C7] mb-8 md:mb-12 flex items-center gap-2">
          <Link to={"/"}>
            <div className="flex">
              <img
                src="https://topic-frontend.vercel.app/assets/mortarboard-DQ6alufg.png"
                alt="TOPIC Logo"
                className="w-8 h-8 mr-2"
              />
              TOPIC
            </div>
          </Link>
        </div>

        {/* Login Form */}
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-sm shadow-lg p-6 border-none">
            <CardContent>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 text-center md:text-left">
                Welcome Back!
              </h2>
              <p className="text-gray-500 mb-6 text-center md:text-left">
                Please enter login details below
              </p>

              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="mb-4">
                  <label className="block mb-1 text-gray-700">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter the email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="mb-2">
                  <label className="block mb-1 text-gray-700">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter the Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end mb-4 text-sm text-gray-500 cursor-pointer hover:underline">
                  Forgot password?
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full mb-4 bg-[#7FD0C7] hover:bg-teal-500 text-white font-semibold rounded-md"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="mx-2 text-gray-500 text-sm">Or continue</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

              {/* Google Sign In */}
              {/* <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 mb-4 border-gray-400"
                onClick={() => {
                  window.location.href = `${"https://topic-backend-2rsf.onrender.com/api/v1"}/auth/google`;
                }}
              >
                <FcGoogle className="text-xl" />
                Log in with Google
              </Button> */}
              <GoogleLogin
                onSuccess={async ({ credential }) => {
                  try {
                    const res = await verifyGoogleToken({ token: credential! });
                    console.log("Login Success:", res.data);

                    // ✅ Hard reload to ensure cookies/session are applied
                    window.location.replace("/");
                  } catch (err) {
                    console.error("Google login failed", err);
                  }
                }}
                onError={() => console.log("Google login failed")}
                useOneTap
              />

              {/* Signup Link */}
              <p className="text-center text-gray-500 text-sm">
                Don't have an account?{" "}
                <Link to={"/register"}>
                  <span className="text-[#7FD0C7] hover:underline cursor-pointer">
                    Sign Up
                  </span>
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side: Image Section */}
      <div className="hidden md:flex w-full md:w-3/5 bg-[#cce6e4] flex-col items-center justify-center p-8 rounded-l-3xl">
        <img
          src="https://dzrgyozxbybhnvunxjgv.supabase.co/storage/v1/object/public/topic/avatars/vector-illustration-information-privacy-concept-protect-data-from-data-theft-malware_675567-2877-removebg-preview.png"
          alt="Login Illustration"
          className="max-w-[600px] h-[500px] rounded-xl mb-6 object-contain"
        />
      </div>
    </div>
  );
}
