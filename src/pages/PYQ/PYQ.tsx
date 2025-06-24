import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Hash,
  FileText,
  FileSearch2,
  Landmark,
  CalendarDays,
  Eye,
  RefreshCcw,
} from "lucide-react";
import { fetchPYQs } from "@/services/pyqService";
import { Skeleton } from "@/components/ui/skeleton";

const branches = ["MME", "CSE", "EE", "ME", "CE", "ECM", "PIE", "ECE"];
const term = ["MID", "END"];

const PYQ = () => {
  const [filters, setFilters] = useState({
    subject: "",
    semester: "",
    branch: "",
    term: "",
    sessionFrom: "",
    sessionTo: "",
  });

  const [pyqs, setPyqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({
      subject: "",
      semester: "",
      branch: "",
      term: "",
      sessionFrom: "",
      sessionTo: "",
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchPYQs({
        ...filters,
        page: 1,
        limit: 6,
        sessionFrom: filters.sessionFrom ? Number(filters.sessionFrom) : 0,
        sessionTo: filters.sessionTo ? Number(filters.sessionTo) : 0,
      });
      setPyqs(result);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
            Previous Year Questions
          </h1>

          {/* Filter Section */}
          <div className="bg-white/60 border border-gray-200 shadow-lg rounded-2xl backdrop-blur-md p-8 mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Subject  */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="subject"
                  className="text-gray-700 font-medium flex items-center gap-2"
                >
                  <Hash size={16} className="text-indigo-600" /> Subject
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="e.g. Math"
                  value={filters.subject}
                  onChange={handleChange}
                  className="focus-visible:ring-2 focus-visible:ring-indigo-400 transition"
                />
              </div>
              {/* Semester */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="semester"
                  className="text-gray-700 font-medium flex items-center gap-2"
                >
                  <GraduationCap size={16} className="text-indigo-600" />{" "}
                  Semester
                </Label>
                <Input
                  type="number"
                  id="semester"
                  name="semester"
                  placeholder="e.g. 4"
                  value={filters.semester}
                  onChange={handleChange}
                  className="focus-visible:ring-2 focus-visible:ring-indigo-400 transition"
                />
              </div>
              {/* Branch */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="branch"
                  className="text-gray-700 font-medium flex items-center gap-2"
                >
                  <Landmark size={16} className="text-indigo-600" /> Branch
                </Label>
                <select
                  id="branch"
                  name="branch"
                  value={filters.branch}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm bg-white focus-visible:ring-2 ring-indigo-400"
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* term */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="term"
                  className="text-gray-700 font-medium flex items-center gap-2"
                >
                  <Landmark size={16} className="text-indigo-600" /> Term
                </Label>
                <select
                  id="term"
                  name="term"
                  value={filters.term}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm bg-white focus-visible:ring-2 ring-indigo-400"
                >
                  <option value="">Select Term</option>
                  {term.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Session From */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="sessionFrom"
                  className="text-gray-700 font-medium flex items-center gap-2"
                >
                  <CalendarDays size={16} className="text-indigo-600" /> Session
                  From
                </Label>
                <Input
                  type="number"
                  id="sessionFrom"
                  name="sessionFrom"
                  placeholder="e.g. 2022"
                  value={filters.sessionFrom}
                  onChange={handleChange}
                  className="focus-visible:ring-2 focus-visible:ring-indigo-400 transition"
                />
              </div>
              {/* Session To */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="sessionTo"
                  className="text-gray-700 font-medium flex items-center gap-2"
                >
                  <CalendarDays size={16} className="text-indigo-600" /> Session
                  To
                </Label>
                <Input
                  type="number"
                  id="sessionTo"
                  name="sessionTo"
                  placeholder="e.g. 2023"
                  value={filters.sessionTo}
                  onChange={handleChange}
                  className="focus-visible:ring-2 focus-visible:ring-indigo-400 transition"
                />
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={handleReset}
                className="text-sm border-gray-300 hover:border-gray-400"
              >
                <RefreshCcw size={16} className="mr-1" /> Reset
              </Button>
              <Link to={"/upload/pyq"}>
                <Button
                  variant="default"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
                >
                  <FileText size={16} className="mr-1" /> Upload PYQ
                </Button>
              </Link>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card
                  key={index}
                  className="bg-white/50 border rounded-xl shadow"
                >
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-24 mt-3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : pyqs.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              <FileSearch2 className="inline-block mr-2" size={18} /> No PYQs
              found for given filters.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pyqs.map((pyq) => (
                <Card
                  key={pyq._id}
                  className="bg-white/60 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-700 font-semibold text-lg">
                      <FileText size={20} /> {pyq.title}
                    </div>
                    <Separator />
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Subject:</span>{" "}
                        {pyq.subject}
                      </p>
                      <p>
                        <span className="font-medium">Semester:</span>{" "}
                        {pyq.semester}
                      </p>
                      <p>
                        <span className="font-medium">Term:</span> {pyq.term}
                      </p>
                      <p>
                        <span className="font-medium">Branch:</span>{" "}
                        {pyq.branch}
                      </p>
                      <p>
                        <span className="font-medium">Session:</span>{" "}
                        {pyq.sessionFrom} - {pyq.sessionTo}
                      </p>
                    </div>
                    <div className="pt-2 flex justify-end">
                      <a
                        href={pyq.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-700"
                        >
                          <Eye size={16} className="mr-1" /> View File
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PYQ;
