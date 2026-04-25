
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Power, 
  MapPin, Users, Tag as TagIcon, Clock,
  BarChart2, Activity, ShieldAlert, Layout
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid 
} from 'recharts';
import api from '../api'; 
import ResourceForm from '../components/ResourceForm';

const ManageResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // Load resources from the backend
  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await api.fetchResources();
      setResources(data || []);
    } catch (error) {
      console.error("Failed to load resources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  // --- ANALYTICS LOGIC ---
  const totalResources = resources.length;
  const activeResources = resources.filter(r => r.status?.toUpperCase() === 'ACTIVE').length;
  const oosResources = resources.filter(r => r.status?.toUpperCase() === 'OUT_OF_SERVICE').length;
  const uniqueTypes = [...new Set(resources.map(r => r.type))].length;

  // Data for the Analytics Chart (Top 6 resources by capacity)
  const chartData = [...resources]
    .sort((a, b) => b.capacity - a.capacity)
    .slice(0, 6)
    .map(r => ({ name: r.name, capacity: r.capacity }));

  const handleToggleStatus = async (resource) => {
    const newStatus = resource.status?.toUpperCase() === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
    try {
      await api.updateResource(resource.id, { ...resource, status: newStatus });
      loadResources(); 
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await api.deleteResource(id);
        loadResources();
      } catch (error) {
        alert("Failed to delete resource");
      }
    }
  };

  const filteredResources = resources.filter(res =>
    res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 text-left">Manage Resources</h1>
          <p className="text-slate-500 text-left">Real-time analytics and asset management dashboard.</p>
        </div>
        <button 
          onClick={() => { setSelectedResource(null); setIsModalOpen(true); }}
          className="bg-[#1e293b] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition shadow-sm"
        >
          <Plus size={20} /> Add Resource
        </button>
      </div>

      {/* ADDITIONAL FEATURE: Analytics Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-left">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Layout size={20}/></div>
            <p className="text-slate-500 text-sm font-medium">Total Assets</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{totalResources}</h3>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Activity size={20}/></div>
            <p className="text-slate-500 text-sm font-medium">Active Resources</p>
          </div>
          <h3 className="text-2xl font-bold text-green-600">{activeResources}</h3>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><ShieldAlert size={20}/></div>
            <p className="text-slate-500 text-sm font-medium">Out of Service</p>
          </div>
          <h3 className="text-2xl font-bold text-red-600">{oosResources}</h3>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TagIcon size={20}/></div>
            <p className="text-slate-500 text-sm font-medium">Resource Categories</p>
          </div>
          <h3 className="text-2xl font-bold text-purple-600">{uniqueTypes}</h3>
        </div>
      </div>

      {/* ADDITIONAL FEATURE: Usage Chart Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 text-left">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 size={20} className="text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-800">Resource Capacity Analytics</h3>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}} 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
              />
              <Bar dataKey="capacity" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search resources by name or type..."
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Resources Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Capacity</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Location</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Availability</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="7" className="text-center py-10 text-slate-400">Loading resources...</td></tr>
            ) : filteredResources.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-10 text-slate-400">No resources found.</td></tr>
            ) : (
              filteredResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">{resource.name}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 w-fit">
                      <TagIcon size={12} /> {resource.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{resource.capacity}</td>
                  <td className="px-6 py-4 text-slate-600">{resource.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      {resource.availabilityWindows?.length > 0 ? (
                        resource.availabilityWindows.map((timeRange, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100 w-fit">
                            <Clock size={12} className="text-slate-400" />
                            <span className="text-slate-900">{timeRange}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No windows defined</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      resource.status?.toUpperCase() === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${resource.status?.toUpperCase() === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {resource.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleToggleStatus(resource)} className="p-2 text-slate-400 hover:text-blue-600 transition" title="Toggle Status">
                        <Power size={18} />
                      </button>
                      <button onClick={() => { setSelectedResource(resource); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 transition" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(resource.id)} className="p-2 text-slate-400 hover:text-red-600 transition" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
             <ResourceForm 
               initialData={selectedResource} 
               onSuccess={async (formData) => {
                 try {
                   if (selectedResource) {
                     await api.updateResource(selectedResource.id, formData);
                   } else {
                     await api.createResource(formData);
                   }
                   loadResources(); 
                   setIsModalOpen(false); 
                   setSelectedResource(null); 
                 } catch (err) {
                   console.error("Form submission failed:", err);
                   alert("An error occurred while saving.");
                 }
               }}
               onCancel={() => { 
                 setIsModalOpen(false); 
                 setSelectedResource(null); 
               }}
             />
          </div>
        </div>
      )}
    </div>
  );

import React, { useState } from 'react';
import { Plus, LayoutGrid } from 'lucide-react';
import ResourceList from './ResourceList';
import ResourceFormModal from './ResourceForm'; 

const ManageResourcesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-[1600px] mx-auto pb-20 bg-slate-50/30 min-h-screen">
            {/* TOP HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-8 py-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Resources</h1>
                    <p className="text-slate-500 mt-1 font-medium">Create, edit, and manage facilities and assets.</p>
                </div>
                
                {/* ADD RESOURCE BUTTON (Top Right Corner) */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[#1e293b] hover:bg-slate-800 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-slate-200 font-bold text-sm active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Add Resource
                </button>
            </div>

            {/* THE BORDERED TABLE CONTAINER */}
            <div className="px-8">
                <ResourceList refreshTrigger={refreshTrigger} />
            </div>

            {/* POPUP MODAL FOR FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="absolute inset-0 cursor-pointer" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-4xl max-h-full my-8">
                        <div className="absolute top-6 right-6 z-10">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 p-2 rounded-full shadow-md transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <ResourceFormModal onResourceAdded={handleRefresh} />
                    </div>
                </div>
            )}
        </div>
    );

};

export default ManageResourcesPage;