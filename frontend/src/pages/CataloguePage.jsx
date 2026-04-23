import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import the hook
import { fetchResources } from '../api';
import { Building2, CheckCircle2, AlertCircle, Layers, Plus, LayoutGrid } from 'lucide-react';
import ResourceForm from '../components/ResourceForm';
import ResourceList from '../components/ResourceList';
import { motion } from 'framer-motion'; 

const CataloguePage = () => {
    const [resources, setResources] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [refresh, setRefresh] = useState(0);
    
    // 2. Initialize the navigate function
    const navigate = useNavigate(); 

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchResources();
                setResources(data || []);
            } catch (error) {
                console.error("Failed to load resources:", error);
            }
        };
        load();
    }, [refresh]);

    // Derived Stats
    const activeCount = resources.filter(r => r.status === 'ACTIVE').length;
    const oosCount = resources.filter(r => r.status === 'OUT_OF_SERVICE').length;
    const typesCount = [...new Set(resources.map(r => r.type))].length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header Area */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Overview of all bookable resources across campus.</p>
                </div>
                
                {/* 3. The button now uses the initialized navigate function */}
                <button 
                    onClick={() => navigate('/catalogue/all')} 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm font-medium"
                >
                    <LayoutGrid className="w-4 h-4" /> View Catalogue
                </button>
            </div>

            {/* Stat Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="TOTAL RESOURCES" value={resources.length} icon={<Building2 className="text-blue-600" />} color="bg-blue-50" />
                <StatCard label="ACTIVE" value={activeCount} icon={<CheckCircle2 className="text-green-600" />} color="bg-green-50" />
                <StatCard label="OUT OF SERVICE" value={oosCount} icon={<AlertCircle className="text-red-600" />} color="bg-red-50" />
                <StatCard label="RESOURCE TYPES" value={typesCount} icon={<Layers className="text-amber-600" />} color="bg-amber-50" />
            </div>

            {/* Form Toggle */}
            {showForm && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4 duration-300">
                    <ResourceForm onResourceAdded={() => { setRefresh(r => r + 1); setShowForm(false); }} />
                </div>
            )}

            {/* Detailed Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">By Resource Type</h3>
                    <div className="space-y-6">
                        <CategoryProgress label="Lecture Hall" count={resources.filter(r => r.type === 'Lecture Hall').length} total={resources.length || 1} color="bg-blue-600" />
                        <CategoryProgress label="Laboratory" count={resources.filter(r => r.type === 'Lab').length} total={resources.length || 1} color="bg-indigo-600" />
                        <CategoryProgress label="Meeting Room" count={resources.filter(r => r.type === 'Meeting Room').length} total={resources.length || 1} color="bg-amber-500" />
                        <CategoryProgress label="Equipment" count={resources.filter(r => r.type === 'Equipment').length} total={resources.length || 1} color="bg-slate-700" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">By Location</h3>
                    <div className="space-y-4">
                        <LocationItem label="Main Building" count={resources.filter(r => r.location?.includes('Main')).length} />
                        <LocationItem label="New Building" count={resources.filter(r => r.location?.includes('New')).length} />
                        <LocationItem label="Library" count={resources.filter(r => r.location?.includes('Library')).length} />

                        <LocationItem label="Engineering Building" count={resources.filter(r => r.location?.includes('Engineering')).length} />
                        <LocationItem label="Block B/C" count={resources.filter(r => r.location?.includes('Block')).length} />
                    </div>
                </div>
            </div>

            {/* Recent Additions List */}
            <div className="mt-8">
                <ResourceList refreshTrigger={refresh} />
            </div>
        </div>
    );
};

// Reusable Sub-Components
const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-start shadow-sm hover:shadow-md transition-shadow">
        <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1 uppercase">{label}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
    </div>
);

const CategoryProgress = ({ label, count, total, color }) => (
    <div>
        <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full text-xs">{label}</span>
            <span className="font-bold text-slate-900">{count}</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(count / total) * 100}%` }}
                className={`h-full ${color}`} 
                transition={{ duration: 0.8, ease: "easeOut" }}
            />
        </div>
    </div>
);

const LocationItem = ({ label, count }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
        <span className="text-slate-600 text-sm">{label}</span>
        <span className="font-bold text-slate-800">{count}</span>
    </div>
);

export default CataloguePage;