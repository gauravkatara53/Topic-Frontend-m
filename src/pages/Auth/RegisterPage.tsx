import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { registerUser } from "@/api/userApi"; // Your API function
import { useNavigate } from "react-router-dom";
import { errorHandler } from "@/utils/errorHandler"; // Your error handling file
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, handleError } = errorHandler(); // use your error handler

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await registerUser(formData);
      showSuccess("Registration successful!");
      navigate("/");
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

        {/* Signup Form */}
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-sm shadow-lg p-6 border-none">
            <CardContent>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 text-center md:text-left">
                Create Account
              </h2>
              <p className="text-gray-500 mb-6 text-center md:text-left">
                Please enter your details below
              </p>

              {/* Name Field */}
              <div className="mb-4">
                <label className="block mb-1 text-gray-700">Name</label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label className="block mb-1 text-gray-700">Email</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Phone Field */}
              <div className="mb-4">
                <label className="block mb-1 text-gray-700">Phone</label>
                <Input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label className="block mb-1 text-gray-700">Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Sign Up Button */}
              <Button
                className="w-full mb-4 bg-[#7FD0C7] hover:bg-teal-500 text-white font-semibold rounded-md"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
              {/* Divider */}
              <div className="flex items-center my-4 mt-2">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="mx-2 text-gray-500 text-sm">Or continue</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

              {/* Google Sign In */}
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 mb-4 border-gray-400"
                onClick={() => {
                  window.location.href = `${"http://localhost:5002/api/v1"}/auth/google`;
                }}
              >
                <FcGoogle className="text-xl" />
                Log in with Google
              </Button>
              {/* Redirect to Login */}
              <p className="text-center text-gray-500 text-sm">
                Already have an account?{" "}
                <Link to={"/login"}>
                  <span
                    className="text-[#7FD0C7] hover:underline cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    Sign In
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
          alt="Signup Illustration"
          className="max-w-[600px] h-[500px] rounded-xl mb-6 object-contain"
        />
      </div>
    </div>
  );
}
