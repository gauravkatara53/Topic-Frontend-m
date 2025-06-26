import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/RegisterPage";
import GoogleSuccessPage from "./pages/GoogleSuccessPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import AttendancePage from "./pages/Attendance/attendace";
import ProfilePage from "./pages/Profile/Profile";
import NotesSearchPage from "./pages/Notes/Notes";
import UploadNotePage from "./pages/Notes/UploadNotePage";
import UploadPYQPage from "./pages/PYQ/uploadPYQ";
import GetPYQPage from "./pages/PYQ/PYQ";
import BecomeUploaderPage from "./pages/AudiencePage/BecomeUploaderPage";
import VerifyUploaderPage from "./pages/VerificationPage/VerifyUploaderPage";
import AttendancePage2 from "./pages/AudiencePage/linkCollegeCredentail";
import ProfileHeader from "./pages/Test/profile";
import { useAuth } from "@/context/AuthContext";
import AcademicPage from "./pages/AcademicPage/AcademicPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import MyNotesSearchPage from "./pages/Notes/myNotes";
import MyPYQ from "./pages/PYQ/myPyq";

export default function App() {
  const { user } = useAuth();

  const { isUploaderVerified, isAttendancePortalConnected } = user;

  console.log(isAttendancePortalConnected);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/GoogleSuccessPage" element={<GoogleSuccessPage />} />
        {isAttendancePortalConnected ? (
          <Route path="/attendance" element={<AttendancePage />} />
        ) : (
          <Route path="/attendance" element={<AttendancePage2 />} />
        )}

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/get/notes" element={<NotesSearchPage />} />
        {isUploaderVerified ? (
          <Route path="/upload/notes" element={<UploadNotePage />} />
        ) : (
          <Route path="/upload/notes" element={<BecomeUploaderPage />} />
        )}
        {isUploaderVerified ? (
          <Route path="/upload/pyq" element={<UploadPYQPage />} />
        ) : (
          <Route path="/upload/pyq" element={<BecomeUploaderPage />} />
        )}

        <Route path="/get/pyq" element={<GetPYQPage />} />
        <Route
          path="/verify/become/uploader"
          element={<VerifyUploaderPage />}
        />
        {isUploaderVerified && (
          <Route
            path="/verify/become/uploader"
            element={<VerifyUploaderPage />}
          />
        )}

        {isUploaderVerified ? (
          <Route path="/my/notes" element={<MyNotesSearchPage />} />
        ) : (
          <Route path="/my/notes" element={<BecomeUploaderPage />} />
        )}

        {isUploaderVerified ? (
          <Route path="/my/pyqs" element={<MyPYQ />} />
        ) : (
          <Route path="/my/pyqs" element={<BecomeUploaderPage />} />
        )}

        <Route path="/academic" element={<AcademicPage />} />
        <Route path="/upload" element={<BecomeUploaderPage />} />
        <Route path="/1" element={<ProfileHeader />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
