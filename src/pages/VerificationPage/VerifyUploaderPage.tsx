import { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { getOTPService, verifyOTPService } from "@/services/collegeService";

const VerifyUploaderPage = () => {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "verifying" | "success" | "error"
  >("idle");
  const navigate = useNavigate();
  const email = "student@nitjsr.ac.in";

  const handleSendOTP = async () => {
    setStatus("sending");
    try {
      await getOTPService(email);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  const handleVerify = async () => {
    setStatus("verifying");
    try {
      const res = await verifyOTPService(otp);
      if (res?.data?.success) {
        setStatus("success");
        setTimeout(() => navigate("/"), 2500);
      } else {
        throw new Error("Invalid OTP");
      }
    } catch {
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
        setOtp("");
      }, 2000);
    }
  };

  const renderAnimation = () => {
    const lotties = {
      verifying:
        "https://lottie.host/c2244ca1-5f02-4a5d-9e83-3c2ac53628a1/3jkC8FJhis.lottie",
      success:
        "https://lottie.host/a397c8b7-618a-4b63-8359-5aa0b8790541/5RHuLL78W9.lottie",
      error:
        "https://lottie.host/dc70399d-4a75-457b-8db7-ae6691a637b7/8gc5Db2gwr.lottie",
    };
    if (status === "verifying" || status === "success" || status === "error") {
      return (
        <DotLottieReact
          src={lotties[status]}
          autoplay
          loop={status !== "success"}
          style={{ height: 200 }}
        />
      );
    }
    return null;
  };

  return (
    <>
      <Navbar />
      <div className="mt-20 flex items-center justify-center px-4 py-12 min-h-[60vh]">
        {status !== "idle" && status !== "sending" ? (
          <div className="text-center max-w-md mx-auto space-y-6 animate-fade-in">
            {renderAnimation()}
            {status === "success" && (
              <>
                <h2 className="text-3xl font-bold text-green-600">
                  Verification Successful!
                </h2>
                <p className="text-gray-600 text-base">
                  You’re now a verified uploader. Time to share valuable
                  resources!
                </p>
                <Button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg"
                  onClick={() => navigate("/dashboard")}
                >
                  🚀 Go to Dashboard
                </Button>
              </>
            )}
            {status === "verifying" && (
              <p className="text-gray-600 animate-pulse">Verifying OTP...</p>
            )}
            {status === "error" && (
              <p className="text-red-500">Invalid OTP! Please try again.</p>
            )}
          </div>
        ) : (
          <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-200 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Verify Your College Email
            </h2>
            <p className="text-sm text-center text-gray-500 mb-6">
              We’ve sent an OTP to <b>{email}</b>
            </p>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none rounded-xl p-3 text-center text-2xl tracking-widest"
              placeholder="Enter OTP"
            />
            <Button
              className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-lg"
              onClick={handleVerify}
            >
              Verify
            </Button>
            <Button
              variant="outline"
              className="w-full mt-3 border-dashed"
              onClick={handleSendOTP}
              disabled={status === "sending"}
            >
              📩 {status === "sending" ? "Sending..." : "Resend OTP"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default VerifyUploaderPage;
