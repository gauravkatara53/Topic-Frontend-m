import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import News from "./Components/News";
import AcademicCalendar from "./Components/AcadmicCalender";
import BrowseTopics from "./Components/BrowseTopics";
import FAQSection from "./Components/FAQSection";
import TestimonialPage from "./Components/TestimonialPage";
import Footerd from "./Components/Footerd";
import BecomeUploaderSection from "./Components/becomeUploader";
import AttendanceInfoCard from "./Components/AttendanceInfoCard";

const DashboardPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      {/* Hero Section */}
      <div
        className="pt-16 pb-12 flex flex-col items-center rounded-b-3xl text-white text-center px-6"
        style={{
          background:
            "linear-gradient(360deg, hsla(201, 66%, 30%, 1) 0%, hsla(178, 37%, 59%, 1) 100%)",
        }}
      >
        {/* Hero Text */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Discover. Learn. Enjoy.
        </h1>
        <p className="text-xl md:text-2xl font-semibold mb-8">
          Platform for creatives around the world
        </p>

        {/* Search Box */}
        <div className="bg-white rounded-full shadow-md flex items-center w-full max-w-xl px-4 py-2 mb-12">
          <svg
            className="text-gray-500 mr-2"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="9" cy="9" r="7" stroke="#718096" strokeWidth="2" />
            <line
              x1="14"
              y1="14"
              x2="18"
              y2="18"
              stroke="#718096"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <Input
            type="text"
            placeholder="Notes, PYQ's, Courses, more ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow border-none focus-visible:ring-0 text-gray-700"
          />
          <Button className="ml-3 bg-[#7fd0c7] hover:bg-[#1e5f81] text-white">
            Search
          </Button>
        </div>

        {/* News & Calendar Grid (Inside Hero Section) */}
        <div className="max-w-screen-xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          <News />
          <AcademicCalendar />
        </div>
      </div>

      {/* Additional Sections  */}
      <BrowseTopics />
      <BecomeUploaderSection />
      <AttendanceInfoCard />
      <FAQSection />
      <TestimonialPage />

      {/* Footer */}
      <div className="mt-12">
        <Footerd />
      </div>
    </div>
  );
};

export default DashboardPage;
