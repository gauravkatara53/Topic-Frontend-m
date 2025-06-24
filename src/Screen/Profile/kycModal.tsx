import { useState } from "react";
import { apiService } from "@/components/APIService/ApiService";

interface KYCModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const documentTypes = ["Aadhar", "PAN", "Passport", "Driving License"];

export default function KYCModal({ onClose, onSuccess }: KYCModalProps) {
  const [nameOnDocument, setNameOnDocument] = useState("");
  const [documentType, setDocumentType] = useState(documentTypes[0]);
  const [documentNumber, setDocumentNumber] = useState("");
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting KYC:");
    console.log("Name on Document:", nameOnDocument);
    console.log("Document Type:", documentType);
    console.log("Document Number:", documentNumber);
    console.log("Front Image:", frontImage);
    console.log("Back Image:", backImage);

    if (!frontImage || !backImage) {
      setError("Please upload both front and back images.");
      console.log("Error: Both images not provided");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("nameOnDocument", nameOnDocument);
      formData.append("documentType", documentType);
      formData.append("documentNumber", documentNumber);
      formData.append("frontImage", frontImage);
      formData.append("backImage", backImage);

      console.log("FormData prepared, sending request...");

      const response = await apiService.post("/kyc/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Response received:", response);

      onSuccess();
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err?.response?.data?.message || "Failed to upload KYC.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={() => {
            console.log("KYCModal closed");
            onClose();
          }}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Upload KYC Documents</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Name on Document</label>
            <input
              type="text"
              value={nameOnDocument}
              onChange={(e) => {
                setNameOnDocument(e.target.value);
                console.log("Updated nameOnDocument:", e.target.value);
              }}
              required
              className="input input-bordered w-full"
              placeholder="Enter name as on document"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Document Type</label>
            <select
              value={documentType}
              onChange={(e) => {
                setDocumentType(e.target.value);
                console.log("Updated documentType:", e.target.value);
              }}
              className="select select-bordered w-full"
            >
              {documentTypes.map((dt) => (
                <option key={dt} value={dt}>
                  {dt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Document Number</label>
            <input
              type="text"
              value={documentNumber}
              onChange={(e) => {
                setDocumentNumber(e.target.value);
                console.log("Updated documentNumber:", e.target.value);
              }}
              required
              className="input input-bordered w-full"
              placeholder="Enter document number"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Front Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFrontImage(file);
                console.log("Selected frontImage:", file);
              }}
              required
              className="file-input file-input-bordered w-full"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Back Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setBackImage(file);
                console.log("Selected backImage:", file);
              }}
              required
              className="file-input file-input-bordered w-full"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
