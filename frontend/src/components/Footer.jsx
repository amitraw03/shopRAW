import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg border-t border-emerald-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <Link to={'/'} className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                <span style={{ fontFamily: 'cursive' }}>R</span>
                <span className="text-xl font-bold text-emerald-400">-Store</span>
              </span>
            </Link>
            <p className="mt-2 text-sm text-gray-400">Your one-stop shop for amazing products.</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-emerald-400 transition duration-300">Home</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-emerald-400 transition duration-300">Cart</Link></li>
              <li><Link to="/signup" className="text-gray-400 hover:text-emerald-400 transition duration-300">Sign Up</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-emerald-400 transition duration-300">Login</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition duration-300">
                <Facebook size={20} />
              </a>
              <a href="https://x.com/rawatAmit30" className="text-gray-400 hover:text-emerald-400 transition duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition duration-300">
                <Instagram size={20} />
              </a>
              {/* <a href="#" className="text-gray-400 hover:text-emerald-400 transition duration-300">
                <GitHub size={20} />
              </a> */}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} R-Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;