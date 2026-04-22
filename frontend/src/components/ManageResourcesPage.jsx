import React, { useState } from 'react';
import { Plus, LayoutGrid } from 'lucide-react';
import AdminResourceList from './ManageResourcesPage';
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
                <AdminResourceList refreshTrigger={refreshTrigger} />
            </div>

            {/* POPUP MODAL FOR FORM */}
            <ResourceFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onResourceAdded={handleRefresh} 
            />
        </div>
    );
};

export default ManageResourcesPage;