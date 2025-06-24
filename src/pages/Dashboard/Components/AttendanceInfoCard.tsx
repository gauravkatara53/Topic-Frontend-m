import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart2, Lock, Target } from "lucide-react";

const AttendanceInfoCard = () => {
  const navigate = useNavigate();

  return (
    <div className="py-14 px-6 flex items-center justify-center">
      <div className="max-w-7xl w-full grid md:grid-cols-2 items-center gap-10 p-6 md:p-10 bg-white/70 backdrop-blur-lg rounded-3xl shadow-md border border-gray-200">
        {/* Left: Text Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Smart Attendance Analysis
          </h1>
          <p className="text-gray-600 text-lg">
            Link your attendance portal using your
            <span className="font-semibold text-indigo-600">
              {" "}
              college credentials
            </span>
            . We never store your data — 100% secure & local only.
          </p>

          <ul className="space-y-3 text-gray-700 text-sm">
            <li className="flex items-center gap-2">
              <Target size={18} className="text-indigo-500" />
              Skip planner: choose your desired % and see how many classes you
              can miss or need to attend.
            </li>
            <li className="flex items-center gap-2">
              <BarChart2 size={18} className="text-blue-500" />
              Visual breakdown of your subject-wise attendance.
            </li>
            <li className="flex items-center gap-2">
              <Lock size={18} className="text-red-500" />
              Your credentials are never saved or shared.
            </li>
          </ul>

          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2 rounded-full transition-all"
            onClick={() => navigate("/attendance")}
          >
            📊 Analyze My Attendance
          </Button>

          <p className="text-xs text-gray-500 pt-2">
            Need help?{" "}
            <span className="underline cursor-pointer">Contact support</span>.
          </p>
        </div>

        {/* Right: Illustration */}
        <div className="w-full">
          <img
            src="https://dzrgyozxbybhnvunxjgv.supabase.co/storage/v1/object/public/topic/avatars/ChatGPT%20Image%20Jun%2022,%202025,%2008_19_07%20AM.png"
            alt="Attendance Analysis"
            className="w-full max-h-[360px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default AttendanceInfoCard;
