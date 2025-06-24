import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
  FileText,
  RefreshCcw,
  BookOpen,
  GraduationCap,
  Hash,
  Eye,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { fetchNotes } from "@/services/noteService";
import { Skeleton } from "@/components/ui/skeleton";

const branches = ["MME", "CSE", "EE", "ME", "CE", "ECM", "PIE", "ECE"];

const NotesSearchPage = () => {
  const [filters, setFilters] = useState({
    title: "",
    semester: "",
    branch: "",
    subject: "",
  });
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({ title: "", semester: "", branch: "", subject: "" });
  };

  const loadNotes = async () => {
    setLoading(true);
    try {
      const fetched = await fetchNotes({
        ...filters,
        title: filters.title,
        semester: filters.semester,
        branch: filters.branch,
        subject: filters.subject,
        page: 1,
        limit: 6,
      });
      setNotes(fetched);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (firstLoad) {
      loadNotes();
      setFirstLoad(false);
    }
  }, []);

  useEffect(() => {
    if (!firstLoad) {
      loadNotes();
    }
  }, [filters]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Search Study Notes
          </h1>

          <div className="flex justify-end mb-6">
            <Link to={"/upload/notes"}>
              <Button className="bg-[#81d0c7] hover:bg-[#5ccfc1] text-white">
                + Upload Note
              </Button>
            </Link>
          </div>

          {/* Filter Bar */}
          <div className="bg-white/70  backdrop-blur-md rounded-xl shadow-sm p-6 mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border border-gray-200">
            <div>
              <Label
                htmlFor="title"
                className="text-sm text-gray-600 flex items-center gap-1"
              >
                <BookOpen size={14} /> Topic
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Eg. Phase Transformation"
                value={filters.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label
                htmlFor="semester"
                className="text-sm text-gray-600 flex items-center gap-1"
              >
                <GraduationCap size={14} /> Semester
              </Label>
              <Input
                type="number"
                id="semester"
                name="semester"
                placeholder="Eg. 4"
                value={filters.semester}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label
                htmlFor="branch"
                className="text-sm text-gray-600 flex items-center gap-1"
              >
                🏛️ Branch
              </Label>
              <select
                name="branch"
                id="branch"
                value={filters.branch}
                onChange={handleChange}
                className="w-full border rounded-md p-2 text-sm bg-white"
              >
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label
                htmlFor="subject"
                className="text-sm text-gray-600 flex items-center gap-1"
              >
                <Hash size={14} /> Subject
              </Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Eg. Math"
                value={filters.subject}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-full flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="gap-1 text-sm"
              >
                <RefreshCcw size={16} /> Reset
              </Button>
            </div>
          </div>

          {/* Notes Cards */}
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
          ) : notes.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              No notes found with current filters.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {notes.map((note) => (
                <Card
                  key={note._id}
                  className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all"
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-700 font-semibold text-lg">
                      <FileText size={20} /> {note.title}
                    </div>
                    <Separator />
                    <p className="text-sm text-gray-600">
                      {note.description || "No description available."}
                    </p>
                    <div className="text-xs text-gray-500 mt-2 space-y-1">
                      <p>
                        <span className="font-medium">Semester:</span>{" "}
                        {note.semester}
                      </p>
                      <p>
                        <span className="font-medium">Branch:</span>{" "}
                        {note.branch}
                      </p>
                      <p>
                        <span className="font-medium">Subject:</span>{" "}
                        {note.subject}
                      </p>
                    </div>
                    <div className="pt-3 flex justify-end">
                      <a
                        href={note.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-700 gap-1"
                        >
                          <Eye size={16} /> View Note
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

export default NotesSearchPage;
