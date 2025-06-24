import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { BarChart2, Lock, Target, ShieldCheck, Zap, Eye } from "lucide-react";
import Footerd from "../Dashboard/Components/Footerd";
import ConnectCollegeModal from "../Attendance/Components/ConnectCollegeModal";
import { useState } from "react";

const AttendancePage2 = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="flex flex-col-reverse lg:flex-row items-center gap-12 mb-24">
            <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Get Complete{" "}
                <span className="text-blue-600">Attendance Analysis</span>
              </h1>
              <p className="text-lg text-gray-600">
                Connect your college portal securely and gain full insights into
                your class attendance. Know how many classes you can skip or
                need to attend based on your goals.
              </p>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded-full"
                onClick={() => setIsModalOpen(true)}
              >
                📊 Link Attendance Now
              </Button>
            </div>
            <img
              src="https://img.freepik.com/premium-vector/confirmed-attendance-concept-illustration_86047-872.jpg?w=2000"
              alt="Attendance Insight"
              className="lg:w-1/2 w-full max-h-[420px] object-contain rounded-lg "
            />
          </section>

          {/* Highlights Section */}
          <section className="grid md:grid-cols-2 gap-10 items-start mb-24">
            <img
              src="https://img.freepik.com/free-vector/global-data-security-personal-data-security-cyber-data-security-online-concept-illustration-internet-security-information-privacy-protection_1150-37375.jpg?t=st=1750522900~exp=1750526500~hmac=fe30f22cadf1fa9a8cba7b17dd96c96d1941456c16687839f4fefbb3ea57f82d&w=996"
              alt="Analytics"
              className="w-full max-h-[400px] object-contain rounded-lg"
            />
            <div className="space-y-5">
              <h2 className="text-3xl font-semibold text-gray-800">
                Why use attendance analysis?
              </h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <BarChart2 className="text-blue-600 mt-1" />
                  <span>
                    Track attendance across subjects and semesters visually.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Target className="text-green-600 mt-1" />
                  <span>
                    Set a percentage target and get insights on how many classes
                    to skip or attend.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Eye className="text-indigo-600 mt-1" />
                  <span>
                    Instantly see weak spots and maintain your eligibility and
                    internal marks.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="text-red-500 mt-1" />
                  <span>
                    We never store your credentials. Everything is end-to-end
                    encrypted.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="bg-white p-10 rounded-xl shadow-xl border border-gray-100 mb-24">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              How it works?
            </h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <ShieldCheck
                  className="mx-auto mb-3 text-green-500"
                  size={40}
                />
                <h4 className="text-lg font-semibold">1. Connect Portal</h4>
                <p className="text-sm text-gray-500 mt-2">
                  Login once with your college credentials. No data is stored.
                </p>
              </div>
              <div>
                <Zap className="mx-auto mb-3 text-blue-500" size={40} />
                <h4 className="text-lg font-semibold">
                  2. Get Instant Analysis
                </h4>
                <p className="text-sm text-gray-500 mt-2">
                  View current attendance stats, subject-wise breakdown, and
                  missed classes.
                </p>
              </div>
              <div>
                <Target className="mx-auto mb-3 text-purple-500" size={40} />
                <h4 className="text-lg font-semibold">3. Set Target</h4>
                <p className="text-sm text-gray-500 mt-2">
                  Choose a percentage goal and plan how many classes to attend
                  or skip.
                </p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="flex flex-col-reverse md:flex-row justify-between items-center gap-10 text-center md:text-left">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your attendance, simplified.
              </h2>
              <p className="text-gray-600 mb-6">
                Just link your credentials once — we’ll give you a clear picture
                of where you stand.
              </p>
              <Button
                className="text-white bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg rounded-full"
                onClick={() => navigate("/link-attendance")}
              >
                🔗 Link Now & Analyze
              </Button>
            </div>
            <img
              src="https://dzrgyozxbybhnvunxjgv.supabase.co/storage/v1/object/public/topic/avatars/ChatGPT%20Image%20Jun%2022,%202025,%2008_19_07%20AM.png"
              alt="Track Attendance"
              className="md:w-1/2 w-full max-h-[320px] object-contain"
            />
          </section>
        </div>
        <ConnectCollegeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
      <Footerd />
    </>
  );
};

export default AttendancePage2;
