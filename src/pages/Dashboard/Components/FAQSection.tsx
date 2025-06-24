import React, { useState } from "react";
import { Link } from "react-router-dom";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

const faqData: FAQItem[] = [
  {
    id: "item1",
    question: "How do I access study notes?",
    answer:
      "You can access study notes by logging into your student account. Navigate to the 'Notes' section where you will find categorized notes for various subjects. Click on the desired subject to view and download the notes.",
  },
  {
    id: "item2",
    question: "How can I find previous question papers?",
    answer:
      "Finding previous question papers is easy. Simply go to the 'Exams' section on our platform. You can search for question papers by entering the year, subject, or exam name in the search bar. Results will display available question papers that you can view and download.",
  },
  {
    id: "item3",
    question: "What's the best way to prepare for exams using your resources?",
    answer:
      "Utilize our resources effectively by creating a study plan. Start with reviewing study notes, practicing with previous question papers, and utilizing additional resources such as explanatory videos and quizzes. Stay consistent and focused to maximize your exam preparation.",
  },
];

const FAQSection: React.FC = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-white rounded-lg border border-gray-200 shadow-lg">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-gray-600">
          Find answers to common questions about accessing notes and question
          papers.
        </p>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {faqData.map(({ id, question, answer }) => (
          <div key={id} className="border border-gray-300 rounded-md shadow-sm">
            <button
              onClick={() => toggleItem(id)}
              aria-expanded={openItem === id}
              aria-controls={`${id}-content`}
              className="flex justify-between items-center w-full px-5 py-4 text-left focus:outline-none hover:bg-gray-50 transition"
            >
              <span className="text-lg font-medium text-gray-900">
                {question}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                  openItem === id ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
            {openItem === id && (
              <div id={`${id}-content`} className="px-5 pb-5 text-gray-600">
                {answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-gray-600">
        Can't find what you're looking for?{" "}
        <Link
          to="/contact"
          className="text-blue-600 font-semibold hover:underline"
        >
          Contact our support
        </Link>
      </p>
    </section>
  );
};

export default FAQSection;
