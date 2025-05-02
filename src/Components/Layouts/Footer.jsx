import { Link } from "react-router-dom";
import {
  Apple,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Apple size={28} className="text-emerald-400" />
              <span className="font-bold text-xl">FreshFruits</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Bringing the freshest, highest quality fruits directly to your
              doorstep since 2020.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/fruits"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin
                  size={18}
                  className="text-emerald-400 mr-2 mt-1 flex-shrink-0"
                />
                <span className="text-gray-400">
                  123 Fruit Street, Orchard City, FC 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone
                  size={18}
                  className="text-emerald-400 mr-2 flex-shrink-0"
                />
                <span className="text-gray-400">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail
                  size={18}
                  className="text-emerald-400 mr-2 flex-shrink-0"
                />
                <span className="text-gray-400">support@freshfruits.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          © {currentYear} FreshFruits. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
