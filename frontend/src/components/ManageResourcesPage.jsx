import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Power, 
  MapPin, Users, Tag as TagIcon, Clock 
} from 'lucide-react';
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

  // Handle Quick Status Toggle (Active/Out of Service)
  const handleToggleStatus = async (resource) => {
    const newStatus = resource.status === 'Active' || resource.status === 'ACTIVE' 
      ? 'OUT_OF_SERVICE' 
      : 'ACTIVE';
    try {
      await api.updateResource(resource.id, { ...resource, status: newStatus });
      loadResources(); 
    } catch (error) {
      alert("Failed to update status");
    }
  };

  // Handle Delete
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

  // Filtering Logic
  const filteredResources = resources.filter(res =>
    res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Resources</h1>
          <p className="text-slate-500">Create, edit, and manage facilities and assets.</p>
        </div>
        <button 
          onClick={() => { setSelectedResource(null); setIsModalOpen(true); }}
          className="bg-[#1e293b] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition shadow-sm"
        >
          <Plus size={20} /> Add Resource
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search resources..."
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
                  
                  {/* Availability Column */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      {resource.availabilityWindows && resource.availabilityWindows.length > 0 ? (
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
                      resource.status === 'Active' || resource.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${resource.status === 'Active' || resource.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {resource.status}
                    </span>
                  </td>

                  {/* Actions Column */}
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
                     // EDIT MODE: Call Update API
                     await api.updateResource(selectedResource.id, formData);
                   } else {
                     // ADD MODE: Call Create API
                     await api.createResource(formData);
                   }
                   loadResources(); // Refresh Table
                   setIsModalOpen(false); // Close Modal
                   setSelectedResource(null); // Reset Selection
                 } catch (err) {
                   console.error("Form submission failed:", err);
                   alert("An error occurred while saving. Please check your inputs.");
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