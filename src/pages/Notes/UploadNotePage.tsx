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
  FileText,
  BookOpen,
  GraduationCap,
  Hash,
  FilePlus2,
  Landmark,
} from "lucide-react";
import { uploadNotesService } from "@/services/noteService";
import { toast } from "react-toastify";

const branches = ["MME", "CSE", "EE", "ME", "CE", "ECM", "PIE", "ECE"];

const UploadNotePage = () => {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState({
    title: "",
    description: "",
    semester: "",
    branch: "",
    subject: "",
    file: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, files } = e.target as any;
    if (name === "file") {
      setNote((prev) => ({ ...prev, file: files[0] }));
    } else {
      setNote((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (!note.file) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      const result = await uploadNotesService({ ...note, file: note.file! });
      console.log("🎉 Upload result:", result);
      toast.success("Note uploaded successfully!");
      setLoading(false);
      // Reset form if needed
      setNote({
        title: "",
        description: "",
        semester: "",
        branch: "",
        subject: "",
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
      <div className="min-h-screen px-4 py-14 bg-gradient-to-br from-indigo-100 via-sky-50 to-purple-100">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-white/30 bg-white/50 shadow-xl backdrop-blur-2xl rounded-3xl transition-all">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3 mb-3">
                <UploadCloud className="text-indigo-600" size={28} />
                <h2 className="text-3xl font-bold text-gray-800">
                  Upload Study Note
                </h2>
              </div>
              <p className="text-sm text-gray-500">
                Fill in the details to share your notes with others.
              </p>
              <Separator className="my-4" />

              <form onSubmit={handleSubmit} className="space-y-6 text-sm">
                <div>
                  <Label
                    htmlFor="title"
                    className="flex items-center gap-2 text-gray-700 font-medium"
                  >
                    <FileText size={16} /> Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={note.title}
                    onChange={handleChange}
                    placeholder="e.g., Iron Making"
                    className="mt-1 focus-visible:ring-2 ring-indigo-300"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2 text-gray-700 font-medium"
                  >
                    <BookOpen size={16} /> Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={note.description}
                    onChange={handleChange}
                    placeholder="Brief overview of the note content..."
                    className="mt-1 focus-visible:ring-2 ring-indigo-300"
                    required
                  />
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
                      value={note.semester}
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
                      value={note.branch}
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
                      value={note.subject}
                      placeholder="e.g., Math"
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
                  {note.file && (
                    <p className="text-xs text-gray-600 mt-1">
                      Selected:{" "}
                      <span className="font-medium">{note.file.name}</span>
                    </p>
                  )}
                </div>

                <div className="pt-2">
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
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UploadNotePage;
