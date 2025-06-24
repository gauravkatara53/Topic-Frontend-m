export default function Footer() {
  return (
    <footer className="bg-[#0a1217]  border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-12 sm:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-gray-400">
        {/* Company Info */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">
            BookMyWarehouse
          </h3>
          <p className="text-sm">
            Empowering warehouse partners with fast, secure, and efficient
            solutions for bookings and growth.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-white font-medium mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#how-it-works" className="hover:text-white">
                How It Works
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-white">
                Why Choose Us
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-white">
                Pricing
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Partner Links */}
        <div>
          <h4 className="text-white font-medium mb-3">Partner</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Partner Login
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Become a Partner
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h4 className="text-white font-medium mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>Email: support@BookMyWarehouse.com</li>
            <li>Phone: +91 98765 43210</li>
          </ul>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-white">
              Twitter
            </a>
            <a href="#" className="hover:text-white">
              LinkedIn
            </a>
            <a href="#" className="hover:text-white">
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-neutral-800 text-center py-4 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} BookMyWarehouse. All rights reserved.
      </div>
    </footer>
  );
}
