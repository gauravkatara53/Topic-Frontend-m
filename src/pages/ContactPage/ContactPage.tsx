import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footerd from "../Dashboard/Components/Footerd";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  // When form is submitted, show success message and toast
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const dataObj = Object.fromEntries(formData.entries());

    console.log("📤 Submitting form with data:", dataObj);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(dataObj),
      });

      console.log("📥 Raw response object:", res); // status, ok, etc.

      const data = await res.json();
      console.log("📦 Parsed JSON response:", data); // <-- most important

      if (data.success) {
        setSubmitted(true);
        toast.success("✅ Message sent successfully!");
        form.reset();
      } else {
        console.error("❌ API error:", data.message);
        toast.error(`❌ ${data.message || "Something went wrong."}`);
      }
    } catch (err) {
      console.error("🚨 Network or CORS error:", err);
      toast.error("❌ Network error. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="min-h-[86vh] flex items-center justify-center bg-gradient-to-tr px-4 py-14">
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-10 bg-white/80 backdrop-blur-xl rounded-3xl p-10 border border-gray-200">
          {/* Left Column */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Let’s Talk 👋
            </h1>
            <p className="text-gray-600 text-sm">
              Have a question, suggestion or feedback? We’d love to hear from
              you.
            </p>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <span>NIT Jamshedpur, Jharkhand, India</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-indigo-600" />
                <span>hello@topic.com</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-indigo-600" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          {submitted ? (
            <div className="text-center col-span-2">
              <h2 className="text-xl font-semibold text-green-600">
                ✅ Message Sent!
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                Thanks for reaching out. We’ll get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Web3Forms Required Hidden Fields */}
              <input
                type="hidden"
                name="access_key"
                value="4ca4fa2d-6f38-4d58-b02d-2366cf3432d8"
              />
              <input type="checkbox" name="botcheck" className="hidden" />

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input
                  type="text"
                  name="name"
                  required
                  placeholder="Your full name"
                  className="mt-1 bg-white/70 backdrop-blur border-gray-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="mt-1 bg-white/70 backdrop-blur border-gray-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Subject
                </label>
                <Input
                  type="text"
                  name="subject"
                  required
                  placeholder="Subject"
                  className="mt-1 bg-white/70 backdrop-blur border-gray-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Message
                </label>
                <Textarea
                  name="message"
                  required
                  placeholder="Write your message here..."
                  className="mt-1 bg-white/70 backdrop-blur border-gray-300"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg"
              >
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
      <Footerd />
    </>
  );
}
