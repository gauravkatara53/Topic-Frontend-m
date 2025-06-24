import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // Ensure you are using React Router
import { apiService } from "@/components/APIService/ApiService";
import Navbar from "@/components/Navbar";
import { CheckCircle, AlertTriangle, LogOut } from "lucide-react";
import KYCModal from "./kycModal";
interface PartnerProfile {
  _id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: string;
  kycStatus: string;
}

export default function PartnerProfilePage() {
  // const navigate = useNavigate();
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [loggingOut, setIsLoadingLogOut] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    apiService
      .get<{ data: PartnerProfile }>("partner/get-partner")
      .then((res) => {
        setProfile(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
        });
      })
      .finally(() => setInitialLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoadingDetails(true);
    try {
      await apiService.patch("partner/update-detail", formData);
      const res = await apiService.get<{ data: PartnerProfile }>(
        "partner/get-partner"
      );
      setProfile(res.data);
      setIsEditing(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("avatar", file);
      setUploadingAvatar(true);

      try {
        await apiService.patch("partner/update-avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const res = await apiService.get<{ data: PartnerProfile }>(
          "partner/get-partner"
        );
        setProfile(res.data);
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  const handleLogout = async () => {
    console.log("handleLogout called");
    setIsLoadingLogOut(true);

    // ✅ Define the response type inline
    interface LogoutResponse {
      statusCode: number;
      data: Record<string, any>;
      message: string;
      success: boolean;
      errors: any;
      timestamp: string;
    }

    try {
      // ✅ Use the type with apiService.post
      const res: LogoutResponse = await apiService.post<LogoutResponse>(
        "/partner/loginOut",
        {}
      );

      console.log("Logout response:", res);

      if (res.statusCode === 200 && res.success) {
        console.log("✅ Logout successful:", res.message);
        window.location.href = "/signin";
      } else {
        console.error("❌ Logout failed:", res.message || "Unknown error");
        setError(res.message || "Logout failed. Please try again.");
      }
    } catch (error: any) {
      console.error("🔥 Logout error:", error?.response?.data || error.message);
      setError("Logout failed. Please try again.");
    } finally {
      setIsLoadingLogOut(false);
    }
  };

  const handleClickOnKyc = () => {
    if (profile?.kycStatus !== "Verified") {
      setModalOpen(true);
    }
  };

  return (
    <div className="bg-base-100 min-h-screen w-full">
      <Navbar />

      {initialLoading && (
        <div className="flex justify-center mt-10">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      )}

      {!initialLoading && profile && (
        <div className="max-w-5xl mx-auto py-10 px-4 w-full">
          <div className="bg-base-200 shadow-xl rounded-2xl p-6 w-full">
            {/* Avatar + Logout Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex items-center gap-6">
                <div className="relative w-fit">
                  <div className="avatar">
                    <div className="w-28 sm:w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={profile.avatar} alt="avatar" />
                    </div>
                  </div>
                  <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.978 19.674a4.5 4.5 0 01-1.897 1.13l-2.25.643.643-2.25a4.5 4.5 0 011.13-1.897L16.863 4.487z"
                      />
                    </svg>
                    <input
                      type="file"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                  {uploadingAvatar && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center rounded-full">
                      <span className="loading loading-spinner text-primary"></span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-error flex items-center gap-2"
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <LogOut className="w-5 h-5" />
                    Logout
                  </>
                )}
              </button>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label font-medium">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label font-medium">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label font-medium">Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label font-medium">Username</label>
                <input
                  value={profile.username}
                  disabled
                  className="input input-disabled w-full"
                />
              </div>
              <div>
                <label className="label font-medium">Membership</label>
                <input
                  value={profile.status}
                  disabled
                  className="input input-disabled w-full"
                />
              </div>

              <div className="flex items-center gap-3 mt-6">
                <span className="text-sm font-medium text-gray-400">
                  KYC Status:
                </span>
                {["Pending", "Failed", "Rejected"].includes(
                  profile.kycStatus
                ) ? (
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full hover:bg-yellow-200 transition"
                    onClick={handleClickOnKyc}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {`KYC ${profile.kycStatus} - Click to Verify`}
                  </button>
                ) : (
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-full ${
                      profile.kycStatus === "Verified"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {profile.kycStatus === "Verified" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    {profile.kycStatus}
                  </div>
                )}
              </div>
            </div>

            {/* Edit / Save Buttons */}
            <div className="mt-6 flex justify-end gap-4">
              {isEditing ? (
                <>
                  <button
                    className="btn btn-outline"
                    onClick={() => setIsEditing(false)}
                    disabled={loadingDetails}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={loadingDetails}
                  >
                    {loadingDetails ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Save"
                    )}
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
              {modalOpen && (
                <KYCModal
                  onClose={() => setModalOpen(false)}
                  onSuccess={async () => {
                    setModalOpen(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
