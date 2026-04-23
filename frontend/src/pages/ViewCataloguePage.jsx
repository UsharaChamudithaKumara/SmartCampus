import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { fetchResources } from '../api';
import { Search, MapPin, Users, Clock, ArrowLeft } from 'lucide-react'; // 2. Import ArrowLeft icon

const ViewCataloguePage = () => {
    const [resources, setResources] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ type: '', status: '', location: '', minCapacity: '' });
    
    const navigate = useNavigate(); // 3. Initialize navigate

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchResources();
                setResources(data || []);
            } catch (error) {
                console.error("Error fetching resources:", error);
            }
        };
        load();
    }, []);

    const filteredItems = resources.filter(res => {
        const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !filters.type || res.type === filters.type;
        const matchesStatus = !filters.status || res.status === filters.status;
        const resourceLocation = res.location ? res.location.toLowerCase() : "";
        const filterLocation = filters.location.toLowerCase();
        const matchesLocation = !filters.location || resourceLocation.includes(filterLocation);
        const matchesCapacity = !filters.minCapacity || res.capacity >= parseInt(filters.minCapacity);

        return matchesSearch && matchesType && matchesStatus && matchesLocation && matchesCapacity;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 px-4">
            
            {/* 4. Top Back Button Section */}
            <div className="pt-6">
                <button 
                    onClick={() => navigate(-1)} // Navigates to the previous page
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors group"
                >
                    <div className="p-2 rounded-lg bg-white border border-slate-200 group-hover:border-slate-300 shadow-sm transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Back to Dashboard
                </button>
            </div>

            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Catalogue</h1>
                <p className="text-slate-500 mt-1">Browse all bookable facilities, labs, rooms, and equipment.</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="text"
                        placeholder="Search by name..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select 
                        className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-sm outline-none cursor-pointer"
                        value={filters.type}
                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                    >
                        <option value="">All types</option>
                        <option value="Lecture Hall">Lecture Hall</option>
                        <option value="Lab">Lab</option>
                        <option value="Meeting Room">Meeting Room</option>
                        <option value="Equipment">Equipment</option>
                    </select>

                    <select 
                        className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-sm outline-none cursor-pointer"
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                        <option value="">All statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="OUT_OF_SERVICE">Out of Service</option>
                    </select>

                    <select 
                        className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-sm outline-none cursor-pointer"
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                    >
                        <option value="">All locations</option>
                        <option value="Building A">Building A</option>
                        <option value="Engineering">Engineering Building</option>
                        <option value="Building C">Building C</option>
                        <option value="FOC">FOC Building</option>
                        <option value="Library">Library</option>
                    </select>

                    <input 
                        type="number" 
                        placeholder="Min capacity" 
                        className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-sm outline-none"
                        value={filters.minCapacity}
                        onChange={(e) => setFilters({...filters, minCapacity: e.target.value})}
                    />
                </div>
                <p className="text-xs font-semibold text-slate-400">
                    Showing {filteredItems.length} of {resources.length} resources
                </p>
            </div>

            {/* Resource Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                    <ResourceCard key={item.id} item={item} />
                ))}
            </div>
            
            {filteredItems.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">No resources match your current selection.</p>
                </div>
            )}
        </div>
    );
};

// Card Component remains the same...
const ResourceCard = ({ item }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        {item.type}
                    </div>
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${
                    item.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {item.status}
                </div>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed">
                {item.description || "Facility available for booking and scheduled academic activities."}
            </p>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-y-3">
                <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>Capacity: {item.capacity}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[11px] col-span-2 italic">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Availability: {item.availabilityWindows || '08:00–18:00'}</span>
                </div>
            </div>
        </div>
    </div>
);

export default ViewCataloguePage;