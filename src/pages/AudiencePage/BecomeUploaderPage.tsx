import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  UploadCloud,
  ShieldCheck,
  Users,
  Rocket,
} from "lucide-react";
import Footerd from "../Dashboard/Components/Footerd";

const BecomeUploaderPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br  py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="flex flex-col-reverse lg:flex-row items-center gap-12 mb-24">
            <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Become a Verified Uploader on{" "}
                <span className="text-indigo-600">Topic</span>
              </h1>
              <p className="text-lg text-gray-600">
                Help your peers by uploading study notes, previous year papers
                and more — verified instantly using your college ID.
              </p>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 text-lg rounded-full"
                onClick={() => navigate("/verify/become/uploader")}
              >
                🚀 Join as Uploader
              </Button>
            </div>
            <img
              src="https://img.freepik.com/free-vector/verified-concept-illustration_114360-5167.jpg?ga=GA1.1.380385030.1750518397&semt=ais_hybrid&w=740"
              alt="Become Uploader"
              className="lg:w-1/2 w-full max-h-[420px] object-contain rounded-lg "
            />
          </section>

          {/* Benefits Section */}
          <section className="grid md:grid-cols-2 gap-10 items-start mb-24">
            <img
              src="https://img.freepik.com/premium-vector/problem-solution-business-solving-look-ideas-with-concept-teamwork-can-use-web-banner-background-flat-illustration_2175-2901.jpg?w=2000"
              alt="Community"
              className="w-full max-h-[400px] object-contain rounded-lg"
            />
            <div className="space-y-5">
              <h2 className="text-3xl font-semibold text-gray-800">
                Why should you join?
              </h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <UploadCloud className="text-blue-600 mt-1" />
                  <span>
                    Contribute quality content and earn reputation points.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="text-green-600 mt-1" />
                  <span>
                    Instant verification with your college email address.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-indigo-600 mt-1" />
                  <span>
                    Become a trusted contributor and build your academic
                    portfolio.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="text-purple-600 mt-1" />
                  <span>
                    Support your friends and juniors across semesters.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* How It Works Section */}

          <section className="bg-white p-10 rounded-xl shadow-md border border-gray-100 mb-24">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              How it works?
            </h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <Rocket className="mx-auto mb-3 text-indigo-500" size={40} />
                <h4 className="text-lg font-semibold">1. Create Account</h4>
                <p className="text-sm text-gray-500 mt-2">
                  Sign up with your official NIT email to get started.
                </p>
              </div>
              <div>
                <ShieldCheck
                  className="mx-auto mb-3 text-green-500"
                  size={40}
                />
                <h4 className="text-lg font-semibold">2. Verify via OTP</h4>
                <p className="text-sm text-gray-500 mt-2">
                  Confirm your email with a quick OTP verification.
                </p>
              </div>
              <div>
                <UploadCloud className="mx-auto mb-3 text-blue-500" size={40} />
                <h4 className="text-lg font-semibold">3. Start Uploading</h4>
                <p className="text-sm text-gray-500 mt-2">
                  Share notes, lab manuals, and PYQs with your peers.
                </p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="flex flex-col-reverse md:flex-row justify-between items-center gap-10 text-center md:text-left">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to help your campus?
              </h2>
              <p className="text-gray-600 mb-6">
                It takes just a few seconds to verify and start contributing to
                the Topic community.
              </p>
              <Button
                className="text-white bg-indigo-600 hover:bg-indigo-700 px-8 py-3 text-lg rounded-full"
                onClick={() => navigate("/verify/become/uploader")}
              >
                🎓 Start Uploading Now
              </Button>
            </div>
            <img
              src="https://img.freepik.com/free-vector/video-upload-concept-illustration_114360-4702.jpg?ga=GA1.1.380385030.1750518397&semt=ais_hybrid&w=740"
              alt="Start Uploading"
              className="md:w-1/2 w-full max-h-[320px] object-contain"
            />
          </section>
        </div>
      </div>
      <Footerd />
    </>
  );
};

export default BecomeUploaderPage;
