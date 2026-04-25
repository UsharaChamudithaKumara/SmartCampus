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
                    
                    <p className="text-slate-500 mt-1">Overview of all bookable resources across campus.</p>
                </div>
                
                {/* 3. The button now uses the initialized navigate function */}
                <button 
                    onClick={() => navigate('/catalogue/all')} 
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-blue-500/30 text-white px-5 py-2.5 rounded-xl transition-all font-medium"
                >
                    <LayoutGrid className="w-4 h-4" /> View Catalogue
                </button>
            </div>

            {/* Stat Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="TOTAL RESOURCES" value={resources.length} icon={<Building2 className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />} color="bg-blue-50" borderColor="border-b-blue-500" hoverBg="group-hover:bg-blue-600" />
                <StatCard label="ACTIVE" value={activeCount} icon={<CheckCircle2 className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />} color="bg-emerald-50" borderColor="border-b-emerald-500" hoverBg="group-hover:bg-emerald-500" />
                <StatCard label="OUT OF SERVICE" value={oosCount} icon={<AlertCircle className="w-6 h-6 text-rose-600 group-hover:text-white transition-colors" />} color="bg-rose-50" borderColor="border-b-rose-500" hoverBg="group-hover:bg-rose-500" />
                <StatCard label="RESOURCE TYPES" value={typesCount} icon={<Layers className="w-6 h-6 text-violet-600 group-hover:text-white transition-colors" />} color="bg-violet-50" borderColor="border-b-violet-500" hoverBg="group-hover:bg-violet-500" />
            </div>

            {/* Form Toggle */}
            {showForm && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4 duration-300">
                    <ResourceForm onResourceAdded={() => { setRefresh(r => r + 1); setShowForm(false); }} />
                </div>
            )}

            {/* Detailed Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-indigo-500" /> By Resource Type
                    </h3>
                    <div className="space-y-6">
                        <CategoryProgress label="Lecture Hall" count={resources.filter(r => r.type === 'Lecture Hall').length} total={resources.length || 1} color="bg-blue-600" />
                        <CategoryProgress label="Laboratory" count={resources.filter(r => r.type === 'Lab').length} total={resources.length || 1} color="bg-indigo-600" />
                        <CategoryProgress label="Meeting Room" count={resources.filter(r => r.type === 'Meeting Room').length} total={resources.length || 1} color="bg-amber-500" />
                        <CategoryProgress label="Equipment" count={resources.filter(r => r.type === 'Equipment').length} total={resources.length || 1} color="bg-slate-700" />
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-emerald-500" /> By Location
                    </h3>
                    <div className="space-y-2">
                        <LocationItem label="Main Building" count={resources.filter(r => r.location?.includes('Main')).length} />
                        <LocationItem label="New Building" count={resources.filter(r => r.location?.includes('New')).length} />
                        <LocationItem label="Library" count={resources.filter(r => r.location?.includes('Library')).length} />
                        <LocationItem label="Engineering Building" count={resources.filter(r => r.location?.includes('Engineering')).length} />
                        <LocationItem label="Block B/C" count={resources.filter(r => r.location?.includes('Block')).length} />
                    </div>
                </motion.div>
            </div>

            {/* Recent Additions List */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8"
            >
                <ResourceList refreshTrigger={refresh} />
            </motion.div>
        </div>
    );
};

// Reusable Sub-Components
const StatCard = ({ label, value, icon, color, borderColor, hoverBg }) => (
    <div className={`bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-start shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-b-4 ${borderColor} group`}>
        <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1 uppercase">{label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
        </div>
        <div className={`p-2.5 rounded-xl transition-colors duration-300 ${color} ${hoverBg}`}>{icon}</div>
    </div>
);

const CategoryProgress = ({ label, count, total, color }) => (
    <div className="group">
        <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-slate-600 bg-slate-50 border border-slate-100 group-hover:bg-slate-100 px-3 py-1 rounded-md text-xs transition-colors">{label}</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md text-xs">{count}</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(count / total) * 100}%` }}
                className={`h-full ${color} rounded-full`} 
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
        </div>
    </div>
);

const LocationItem = ({ label, count }) => (
    <div className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-default group">
        <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-emerald-400 transition-colors"></div>
            <span className="text-slate-600 font-medium text-sm group-hover:text-slate-900 transition-colors">{label}</span>
        </div>
        <span className="font-bold text-slate-700 bg-slate-100 group-hover:bg-white group-hover:shadow-sm px-3 py-1 rounded-lg text-xs transition-all border border-slate-200">{count}</span>
    </div>
);

export default CataloguePage;