import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import {
  UploadCloud,
  FileArchive,
  GraduationCap,
  Landmark,
  Hash,
  CalendarDays,
  FilePlus2,
} from "lucide-react";
import { toast } from "react-toastify";
import { uploadPyqService } from "@/services/pyqService";

const branches = ["MME", "CSE", "EE", "ME", "CE", "ECM", "PIE", "ECE"];
const term = ["MID", "END"];

const UploadPYQPage = () => {
  const [loading, setLoading] = useState(false);
  const [pyq, setPyq] = useState({
    title: "",
    semester: "",
    branch: "",
    subject: "",
    term: "",
    sessionFrom: "",
    sessionTo: "",
    file: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as any;
    if (name === "file") {
      setPyq((prev) => ({ ...prev, file: files[0] }));
    } else {
      setPyq((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (!pyq.file) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      const result = await uploadPyqService({ ...pyq, file: pyq.file! });
      console.log("🎉 Upload result:", result);
      toast.success("Note uploaded successfully!");
      setLoading(false);
      // Reset form if needed
      setPyq({
        title: "",
        semester: "",
        branch: "",
        subject: "",
        term: "",
        sessionFrom: "",
        sessionTo: "",
        file: null,
      });
    } catch (error) {
      toast.error("Failed to upload note");
      console.error("Upload failed:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-14 px-4 bg-gradient-to-br from-indigo-100 via-sky-50 to-purple-100">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-white/30 bg-white/60 shadow-xl backdrop-blur-2xl rounded-3xl transition-all">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <FileArchive className="text-purple-700" size={28} />
                <h2 className="text-3xl font-bold text-gray-800">
                  Upload Previous Year Question
                </h2>
              </div>
              <p className="text-sm text-gray-500">
                Share PYQs for your juniors and peers to benefit from.
              </p>
              <Separator />

              <form onSubmit={handleSubmit} className="space-y-6 text-sm">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="title"
                      className="flex items-center gap-2 text-gray-700 font-medium"
                    >
                      <UploadCloud size={16} /> Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={pyq.title}
                      onChange={handleChange}
                      placeholder="e.g., MT301 Midsem 2023"
                      className="mt-1 focus-visible:ring-2 ring-indigo-300"
                      required
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="term"
                      className="flex items-center gap-2 text-gray-700 font-medium"
                    >
                      <Landmark size={16} /> Term
                    </Label>
                    <select
                      id="term"
                      name="term"
                      value={pyq.term}
                      onChange={handleChange}
                      className="mt-1 w-full border rounded-md p-2 text-sm bg-white focus-visible:ring-2 ring-indigo-300"
                      required
                    >
                      <option value="">Select Term</option>
                      {term.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label
                      htmlFor="semester"
                      className="flex items-center gap-2 text-gray-700 font-medium"
                    >
                      <GraduationCap size={16} /> Semester
                    </Label>
                    <Input
                      type="number"
                      name="semester"
                      placeholder="e.g., 4"
                      value={pyq.semester}
                      onChange={handleChange}
                      className="mt-1 focus-visible:ring-2 ring-indigo-300"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="branch"
                      className="flex items-center gap-2 text-gray-700 font-medium"
                    >
                      <Landmark size={16} /> Branch
                    </Label>
                    <select
                      id="branch"
                      name="branch"
                      value={pyq.branch}
                      onChange={handleChange}
                      className="mt-1 w-full border rounded-md p-2 text-sm bg-white focus-visible:ring-2 ring-indigo-300"
                      required
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
                      className="flex items-center gap-2 text-gray-700 font-medium"
                    >
                      <Hash size={16} /> Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={pyq.subject}
                      placeholder="e.g., MT303"
                      onChange={handleChange}
                      className="mt-1 focus-visible:ring-2 ring-indigo-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="sessionFrom"
                      className="flex items-center gap-2 text-gray-700 font-medium"
                    >
                      <CalendarDays size={16} /> Session From
                    </Label>
                    <Input
                      type="number"
                      id="sessionFrom"
                      name="sessionFrom"
                      placeholder="e.g., 2022"
                      value={pyq.sessionFrom}
                      onChange={handleChange}
                      className="mt-1 focus-visible:ring-2 ring-indigo-300"
                      required
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="sessionTo"
                      className="flex items-center gap-2 text-gray-700 font-medium"
                    >
                      <CalendarDays size={16} /> Session To
                    </Label>
                    <Input
                      type="number"
                      id="sessionTo"
                      name="sessionTo"
                      placeholder="e.g., 2023"
                      value={pyq.sessionTo}
                      onChange={handleChange}
                      className="mt-1 focus-visible:ring-2 ring-indigo-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="file"
                    className="flex items-center gap-2 text-gray-700 font-medium"
                  >
                    <FilePlus2 size={16} /> Upload File
                  </Label>
                  <Input
                    type="file"
                    id="file"
                    name="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    className="mt-1 focus-visible:ring-2 ring-indigo-300"
                    required
                  />
                  {pyq.file && (
                    <p className="text-xs text-gray-600 mt-1">
                      Selected:{" "}
                      <span className="font-medium">{pyq.file.name}</span>
                    </p>
                  )}
                </div>

                {loading ? (
                  <Button className="w-full bg-indigo-400 hover:bg-indigo-500 text-white text-sm py-2.5 transition-all duration-200 rounded-xl">
                    Uploading ....
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2.5 transition-all duration-200 rounded-xl"
                  >
                    Upload Note
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UploadPYQPage;
