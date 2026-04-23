import React, { useEffect, useState } from 'react';
import { fetchResources, deleteResource, updateResource } from '../api';
import { Trash2, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

const ResourceList = ({ refreshTrigger }) => {
    const [resources, setResources] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchResources(filter);
            setResources(data || []);
        } catch (err) {
            console.error("Error fetching resources:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [refreshTrigger, filter]);

    // Function to check and toggle status
    const handleStatusToggle = async (resource) => {
        const newStatus = resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
        const updatedData = { ...resource, status: newStatus };
        
        try {
            await updateResource(resource.id, updatedData);
            loadData(); // Refresh the list to update dashboard cards and bars
        } catch (err) {
            alert("Failed to update status. Ensure your backend is running on 8081.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this resource?")) {
            await deleteResource(id);
            loadData();
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-bold text-slate-800">Recent Additions</h2>
                <select 
                    onChange={(e) => setFilter(e.target.value)} 
                    className="text-sm border border-slate-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="">All Types</option>
                    <option value="Lecture Hall">Lecture Halls</option>
                    <option value="Lab">Laboratories</option>
                    <option value="Meeting Room">Meeting Rooms</option>
                    <option value="Equipment">Equipment</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                            <th className="px-6 py-4">Resource Details</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4 text-center">Status Check</th>
                            
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {resources.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-slate-800">{item.name}</p>
                                    <p className="text-xs text-slate-400">ID: {item.id?.substring(0, 8)}...</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                        {item.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{item.location}</td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => handleStatusToggle(item)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                                            item.status === 'ACTIVE' 
                                            ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200' 
                                            : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
                                        }`}
                                    >
                                        {item.status === 'ACTIVE' ? <CheckCircle size={12}/> : <AlertTriangle size={12}/>}
                                        {item.status}
                                    </button>
                                </td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
                {resources.length === 0 && !loading && (
                    <div className="p-10 text-center text-slate-400 text-sm italic">
                        No resources found in the catalogue.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceList;