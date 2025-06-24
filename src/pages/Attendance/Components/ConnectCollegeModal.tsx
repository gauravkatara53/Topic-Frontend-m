import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { submitCollegeCredentials } from "@/services/collegeService"; // ✅ imported here

interface ConnectCollegeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectCollegeModal: React.FC<ConnectCollegeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const payload = {
        userId: rollNumber,
        password: password,
      };

      const response = await submitCollegeCredentials(payload);
      console.log("College Credentials Saved:", response);

      setStatus("success");

      // ⏳ Wait 2 seconds → then close modal → then refresh page
      setTimeout(() => {
        setStatus("idle");
        onClose(); // Close modal
        window.location.reload(); // Refresh page
      }, 2000);
    } catch (error) {
      setStatus("error");
    }
  };

  const renderAnimation = () => {
    const size = { height: 220, width: 220 }; // ⬅️ Increased size here

    switch (status) {
      case "loading":
        return (
          <DotLottieReact
            src="https://lottie.host/c2244ca1-5f02-4a5d-9e83-3c2ac53628a1/3jkC8FJhis.lottie"
            autoplay
            loop
            style={size}
          />
        );
      case "error":
        return (
          <DotLottieReact
            src="https://lottie.host/dc70399d-4a75-457b-8db7-ae6691a637b7/8gc5Db2gwr.lottie"
            autoplay
            loop
            style={size}
          />
        );
      case "success":
        return (
          <DotLottieReact
            src="https://lottie.host/a397c8b7-618a-4b63-8359-5aa0b8790541/5RHuLL78W9.lottie"
            autoplay
            loop
            style={size}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4 bg-black/10 backdrop-blur-sm">
        <Dialog.Panel className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg space-y-4 border border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={18} />
          </button>

          <Dialog.Title className="text-xl font-semibold text-gray-800">
            Connect College Attendance Portal
          </Dialog.Title>
          <p className="text-sm text-gray-500">
            Securely link your attendance account by entering your credentials.
          </p>

          {status === "idle" && (
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Roll Number
                </label>
                <Input
                  type="text"
                  placeholder="e.g., 2020UGMM057"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Connect
              </Button>
            </form>
          )}

          {status !== "idle" && (
            <div className="flex justify-center py-2">{renderAnimation()}</div>
          )}

          {status === "error" && (
            <p className="text-sm text-red-500 text-center -mt-2">
              Invalid credentials. Please try again.
            </p>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConnectCollegeModal;
