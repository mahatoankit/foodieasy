import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/restaurants" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="FoodiEasy" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold text-gray-900">FoodiEasy</span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your favorite meals delivered fresh and fast. Delicious food from the best local restaurants, right to your door.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-500 hover:text-white transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-500 hover:text-white transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-500 hover:text-white transition-colors"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/restaurants" className="text-sm text-gray-600 hover:text-primary-500 transition-colors">
                  Browse Restaurants
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-sm text-gray-600 hover:text-primary-500 transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-gray-600 hover:text-primary-500 transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm text-gray-600 hover:text-primary-500 transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-primary-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-gray-600 hover:text-primary-500 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/partner" className="text-sm text-gray-600 hover:text-primary-500 transition-colors">
                  Partner with Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-primary-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">
                  New Baneshwor, Kathmandu, Nepal
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-gray-500 flex-shrink-0" />
                <a href="tel:+9779812345678" className="text-sm text-gray-600 hover:text-primary-500 transition-colors">
                  +977 981-2345678
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-gray-500 flex-shrink-0" />
                <a href="mailto:support@foodieasy.com" className="text-sm text-gray-600 hover:text-primary-500 transition-colors">
                  support@foodieasy.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-600 flex items-center">
              © {new Date().getFullYear()} FoodiEasy. Made with <Heart size={14} className="mx-1 text-red-500" fill="currentColor" /> in Nepal
            </p>
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="text-xs text-gray-600 hover:text-primary-500 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-xs text-gray-600 hover:text-primary-500 transition-colors">
                Terms
              </Link>
              <Link to="/cookies" className="text-xs text-gray-600 hover:text-primary-500 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
