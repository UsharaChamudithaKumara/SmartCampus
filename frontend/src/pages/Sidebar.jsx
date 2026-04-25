import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  LogOut 
} from 'lucide-react'; // Using lucide-react for icons

const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard', section: 'General' },
    { label: 'Admin Tickets', icon: <BookOpen size={20} />, path: '/admin/tickets', section: 'Administration' },
    { label: 'Facilities & Assets', icon: <Settings size={20} />, path: '/manage-resources', section: 'Administration' },
  ];

  const generalItems = navItems.filter((item) => item.section === 'General');
  const adminItems = navItems.filter((item) => item.section === 'Administration');

  return (
    <div className="w-64 h-screen bg-[#1e293b] text-slate-300 flex flex-col">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-700">
        <div className="bg-blue-600 p-2 rounded-lg">
          <span className="font-bold text-white">SC</span>
        </div>
        <h1 className="text-xl font-bold text-white">Smart Campus</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-8">
        <div>
          <p className="text-xs uppercase font-semibold text-slate-500 mb-4 px-2">General</p>
          <div className="space-y-1">
            {generalItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase font-semibold text-slate-500 mb-4 px-2">Administration</p>
          <div className="space-y-1">
            {adminItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button className="flex items-center space-x-3 px-4 py-3 w-full hover:bg-slate-800 rounded-lg transition">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ item }) => (
  <NavLink
    to={item.path}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
      }`
    }
  >
    {item.icon}
    <span>{item.label}</span>
  </NavLink>
);

export default Sidebar;