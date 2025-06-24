// Enhanced ProfilePage with modern UI improvements and proper loading indicators
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Edit3,
  LogOut,
  UploadCloud,
  Pencil,
  Loader2,
  BadgeCheck,
} from "lucide-react";
import {
  userProfileData,
  updateProfile,
  updateProfileAvatar,
  logout,
} from "@/services/userService";
import { errorHandler } from "@/utils/errorHandler";
import { useNavigate } from "react-router-dom";

const { showSuccess } = errorHandler();

interface UserType {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  collegeId?: string;
  role?: string;
  isUploaderVerified?: boolean;
  gender?: string;
  phone?: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    gender: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await userProfileData();
      if (data) {
        setUser(data);
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          phone: data.phone || "",
          gender: data.gender || "",
        });
        showSuccess("User profile loaded");
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    const success = await logout();
    if (success) {
      // ✅ Clear app state (if needed), then redirect and reload
      navigate("/login");
      window.location.reload(); // ✅ Forces full reload
    }
    setLoggingOut(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async () => {
    setSaving(true);
    const updated = await updateProfile(formData);
    if (updated) {
      setUser({ ...user!, ...updated });
      setIsEditing(false);
    }
    setSaving(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const form = new FormData();
      form.append("avatar", file);
      setUploadingAvatar(true);
      const updated = await updateProfileAvatar(form);
      if (updated) {
        setUser({ ...user!, avatar: updated.avatar });
        showSuccess("Avatar updated successfully!");
      }
      setUploadingAvatar(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-[#f4fefc] py-10 px-4 font-sans">
        {loading ? (
          <div className="max-w-6xl mx-auto animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white/40 h-96 rounded-3xl" />
            <div className="col-span-2 bg-white/40 h-96 rounded-3xl" />
          </div>
        ) : !user ? (
          <div className="text-red-500 text-center mt-10">
            Failed to load profile.
          </div>
        ) : (
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row rounded-3xl shadow-lg bg-white/40 backdrop-blur-md overflow-hidden border border-white/30 transition-all">
            <div className="bg-white/70 lg:w-1/3 p-8 flex flex-col items-center text-center gap-4 border-r border-white/20 relative">
              <div className="relative group">
                <img
                  src={
                    uploadingAvatar
                      ? "https://i.stack.imgur.com/kOnzy.gif"
                      : user.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          user.name
                        )}`
                  }
                  className={`w-28 h-28 rounded-full border-4 border-white shadow-md object-cover ${
                    uploadingAvatar ? "opacity-70" : ""
                  }`}
                  alt="avatar"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-white shadow-sm border rounded-full p-1 group-hover:scale-110 transition"
                  title="Update Avatar"
                  disabled={uploadingAvatar}
                >
                  <UploadCloud size={16} className="text-gray-700" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <Separator className="my-4 w-20" />
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex items-center gap-2 justify-center text-gray-600">
                  <MapPin size={16} /> NIT Jamshedpur
                </div>
              </div>
            </div>

            <div className="flex-1 p-10 flex flex-col gap-8 bg-white/20">
              <div className="flex justify-between items-start flex-col sm:flex-row sm:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Profile Overview
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your account and personal details
                  </p>
                </div>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 text-sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 size={16} /> Edit Profile
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    disabled={saving}
                    className="flex items-center gap-2 text-sm text-green-700 border-green-400"
                    onClick={handleProfileUpdate}
                  >
                    {saving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Pencil size={16} />
                    )}{" "}
                    Save
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Full Name</p>
                  {isEditing ? (
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 border rounded"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{user.name}</p>
                  )}
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Phone</p>
                  {isEditing ? (
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 border rounded"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {user.phone || "N/A"}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 mb-1">College ID</p>
                  <p className="text-gray-900 font-medium">
                    {user.collegeId || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Gender</p>
                  {isEditing ? (
                    <input
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 border rounded"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {user.gender || "Not specified"}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Uploader</p>

                  <p className="text-green-600 font-medium flex items-center gap-2">
                    Verified:
                    {user.isUploaderVerified ? (
                      <BadgeCheck className="text-green-600" size={20} />
                    ) : (
                      <span className="text-red-500 font-medium">False</span>
                    )}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-gray-500 mb-1">Bio</p>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 border rounded"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {user.bio || "No bio provided"}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  disabled={loggingOut}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold"
                >
                  {loggingOut ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={16} />
                  )}{" "}
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
