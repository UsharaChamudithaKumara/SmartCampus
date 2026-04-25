import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Power, 
  MapPin, Users, Tag as TagIcon, Clock,
  BarChart2, Activity, ShieldAlert, Layout
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';
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
    .map(r => ({ name: r.name, capacity: parseInt(r.capacity, 10) || 0 }))
    .sort((a, b) => b.capacity - a.capacity)
    .slice(0, 6);

  // Data for Pie Chart (Resource Distribution by Type)
  const typeCounts = resources.reduce((acc, resource) => {
    acc[resource.type] = (acc[resource.type] || 0) + 1;
    return acc;
  }, {});
  
  const pieData = Object.keys(typeCounts).map(type => ({
    name: type,
    value: typeCounts[type]
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b', '#06b6d4'];

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
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-blue-500/30 transition-all font-medium"
        >
          <Plus size={20} /> Add Resource
        </button>
      </div>

      {/* ADDITIONAL FEATURE: Analytics Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-left">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-b-4 border-b-blue-500 group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"><Layout size={20}/></div>
            <p className="text-slate-500 text-sm font-medium">Total Assets</p>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">{totalResources}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-b-4 border-b-emerald-500 group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300"><Activity size={20}/></div>
            <p className="text-slate-500 text-sm font-medium">Active Resources</p>
          </div>
          <h3 className="text-3xl font-bold text-emerald-600 mt-2">{activeResources}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-b-4 border-b-rose-500 group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300"><ShieldAlert size={20}/></div>
            <p className="text-slate-500 text-sm font-medium">Out of Service</p>
          </div>
          <h3 className="text-3xl font-bold text-rose-600 mt-2">{oosResources}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-b-4 border-b-violet-500 group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-violet-50 text-violet-600 rounded-lg group-hover:bg-violet-500 group-hover:text-white transition-colors duration-300"><TagIcon size={20}/></div>
            <p className="text-slate-500 text-sm font-medium">Resource Categories</p>
          </div>
          <h3 className="text-3xl font-bold text-violet-600 mt-2">{uniqueTypes}</h3>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 text-left">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 size={20} className="text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-800">Top Capacity Resources</h3>
          </div>
          <div className="w-full flex-1" style={{ minHeight: '256px' }}>
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                />
                <Bar dataKey="capacity" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity size={20} className="text-emerald-500" />
            <h3 className="text-lg font-semibold text-slate-800">Resource Distribution</h3>
          </div>
          <div className="w-full flex-1 flex flex-col" style={{ minHeight: '256px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="flex flex-wrap justify-center gap-4 mt-auto pt-2">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        <input
          type="text"
          placeholder="Search resources by name or type..."
          className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm transition-all text-slate-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Resources Table */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
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
};

export default ManageResourcesPage;