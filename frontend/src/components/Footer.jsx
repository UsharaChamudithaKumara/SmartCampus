import React from 'react';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & About */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/dashboard" className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white leading-tight">Smart Campus</p>
                <p className="text-xs text-blue-400">Operations Hub</p>
              </div>
            </Link>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Empowering campus life with smart, accessible, and seamless resource management and operations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/catalogue" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Facilities & Assets</Link></li>
              <li><Link to="/bookings" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Bookings</Link></li>
              <li><Link to="/tickets" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Support Tickets</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Campus Map</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Guidelines</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Contact Admin</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 text-slate-500" />
                <span>SLIIT, Malabe<br/>Sri Lanka</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>support@smartcampus.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 text-center md:text-left">
            &copy; {currentYear} Smart Campus Operations Hub. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-slate-500">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
