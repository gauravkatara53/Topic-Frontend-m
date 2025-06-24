import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check, ShieldCheck, Upload, Users } from "lucide-react";

const BecomeUploaderSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className=" py-14 px-6 flex items-center justify-center">
        <div className="max-w-7xl w-full grid md:grid-cols-2 items-center gap-10 p-6 md:p-10 bg-white/70 backdrop-blur-lg rounded-3xl shadow-md border border-gray-200">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Become an Uploader
            </h1>
            <p className="text-gray-600 text-lg">
              Verified in seconds via your{" "}
              <span className="font-semibold text-indigo-600">college ID</span>.
              Start uploading notes and PYQs to help others — and help yourself!
            </p>

            <ul className="space-y-3 text-gray-700 text-sm">
              <li className="flex items-center gap-2">
                <Upload size={18} className="text-indigo-500" /> Upload study
                notes, PYQs, resources
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-500" /> Verified
                instantly with college email
              </li>
              <li className="flex items-center gap-2">
                <Check size={18} className="text-blue-500" /> Earn credibility
                in the Topic community
              </li>
              <li className="flex items-center gap-2">
                <Users size={18} className="text-purple-500" /> Help friends &
                peers across your college
              </li>
            </ul>

            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2 rounded-full transition-all"
              onClick={() => navigate("/upload")}
            >
              🚀 Get Started Now
            </Button>

            <p className="text-xs text-gray-500 pt-2">
              Already verified?{" "}
              <span
                className="underline cursor-pointer"
                onClick={() => navigate("/upload")}
              >
                Upload your first note
              </span>
              .
            </p>
          </div>

          {/* Right: Illustration */}
          <div className="w-full">
            <img
              src="https://img.freepik.com/free-vector/video-upload-concept-illustration_114360-4702.jpg?semt=ais_hybrid&w=740"
              alt="Become an Uploader"
              className="w-full max-h-[360px] object-contain"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeUploaderSection;
