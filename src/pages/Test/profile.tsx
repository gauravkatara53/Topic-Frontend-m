import { useAuth } from "@/context/AuthContext";

const ProfileHeader = () => {
  const { user } = useAuth();
  const {
    isLoggedIn,
    id,
    name,
    role,
    avatar,
    email,
    collegeId,
    isUploaderVerified,
  } = user;

  if (!isLoggedIn) {
    return <p className="text-gray-500 text-sm italic">Not logged in</p>;
  }
  console.log(avatar);

  return (
    <div className="flex flex-col items-start space-y-2 p-4 rounded-md border bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={avatar}
          alt={name || "User Avatar"}
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <h1>id -- {id}</h1>
          <h2 className="text-xl font-bold">{name || "No Name"}</h2>
          <p className="text-sm text-gray-600">Role: {role || "N/A"}</p>
        </div>
      </div>
      <p className="text-sm text-gray-700">Email: {email || "N/A"}</p>
      <p className="text-sm text-gray-700">College ID: {collegeId || "N/A"}</p>
      <p className="text-sm text-gray-700">
        Uploader Verified: {isUploaderVerified ? "✅" : "❌"}
      </p>
      <p className="text-sm text-green-600 font-semibold">
        Status: ✅ Logged In
      </p>
    </div>
  );
};

export default ProfileHeader;
