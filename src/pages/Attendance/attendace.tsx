import { useEffect, useState } from "react";
import { fetchParsedAttendance } from "@/services/collegeService";
import { errorHandler } from "@/utils/errorHandler";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CircleGauge, UsersRound, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import SkeletonCard from "./Components/skeltonloading"; // ✅ Add this at the top
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface SubjectData {
  name: string;
  code: string;
  faculty: string;
  present: number;
  total: number;
}

const calculatePercentage = (present: number, total: number) =>
  total > 0 ? Math.round((present / total) * 100) : 0;

const getAttendanceAdvice = (
  present: number,
  total: number,
  targetPercent: number
) => {
  const currentPercent = calculatePercentage(present, total);
  const neededClasses = Math.ceil(
    (targetPercent * total - 100 * present) / (100 - targetPercent)
  );
  const possibleLeaves = Math.floor(
    (present * 100 - targetPercent * total) / targetPercent
  );

  if (currentPercent >= targetPercent) {
    return {
      text: `Can miss ${
        possibleLeaves > 0 ? possibleLeaves : 0
      } classes to maintain ${targetPercent}%`,
      isGood: true,
    };
  } else {
    return {
      text: `Need to attend next ${
        neededClasses > 0 ? neededClasses : 0
      } classes to reach ${targetPercent}%`,
      isGood: false,
    };
  }
};

const AttendancePage = () => {
  const [targetAttendance, setTargetAttendance] = useState(75);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const loadingToast = toast.loading("Fetching attendance...");
      setLoading(true);
      try {
        const data = await fetchParsedAttendance();
        setSubjects(data);
      } catch (error) {
        errorHandler().handleError(error); // ← Use your utility here
      } finally {
        setLoading(false);
        toast.dismiss(loadingToast);
      }
    };

    load();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Attendance Dashboard
        </h1>

        <div className="flex justify-center items-center gap-3 mb-8">
          <label className="text-gray-700 font-medium">
            🎯 Target Attendance:
          </label>
          <select
            value={targetAttendance}
            onChange={(e) => setTargetAttendance(Number(e.target.value))}
            className="border border-gray-300 px-3 py-2 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[75, 80, 85, 90, 95].map((percent) => (
              <option key={percent} value={percent}>
                {percent}%
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : subjects.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "100px",
            }}
          >
            <DotLottieReact
              src="https://lottie.host/772dea80-fbe2-4d27-9d82-f461138c03fd/m50ie5Po8j.lottie"
              style={{ width: 300, height: 300 }}
              autoplay
              loop
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, idx) => {
              const percent = calculatePercentage(
                subject.present,
                subject.total
              );
              const { text, isGood } = getAttendanceAdvice(
                subject.present,
                subject.total,
                targetAttendance
              );

              return (
                <Card
                  key={idx}
                  className="shadow-md hover:shadow-lg transition-transform"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {subject.name}
                        </h2>
                        <p className="text-sm text-gray-500">{subject.code}</p>
                        <p className="text-sm text-gray-500">
                          {subject.faculty}
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <CircleGauge className="text-blue-600" size={32} />
                        <span className="text-blue-700 font-semibold">
                          {percent}%
                        </span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <UsersRound className="w-4 h-4" />
                        <span>
                          {subject.present}/{subject.total} Classes
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-2 font-medium ${
                          isGood ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>{text}</span>
                      </div>
                    </div>

                    <Progress value={percent} className="h-2 rounded-full" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default AttendancePage;
